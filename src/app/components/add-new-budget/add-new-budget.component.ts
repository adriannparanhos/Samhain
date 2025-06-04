import { Component, ViewChild, OnInit } from '@angular/core';
import { ReturnArrowComponent } from '../return-arrow/return-arrow.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { ButtonComponent } from '../button/button.component';
import { LucideAngularModule } from 'lucide-angular';
import { FieldConfig } from '../add-new-form/add-new-form.component';
import { ButtonFormComponent } from '../button-form/button-form.component';
import { Item } from '../../models/constantes';
import { TableInfoComponent } from '../table-info/table-info.component';
import { DynamicItemsTableComponent } from '../dynamic-items-table/dynamic-items-table.component';
import { FetchEnterpriseService } from '../../services/fetchs/fetch-enterprise.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { CpfCnpjMaskDirective } from '../../directive/cpf-cnpj-mask.directive';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento, AdicionaisItem, ItemOrcamento } from '../../models/interfaces/dados-orcamento';
import { SendOrcamentoPayloadService } from '../../services/database/send-orcamento-payload.service';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';

interface NewBudget {
  id: number;
  proposalNumber: string;
  enterprise: string;
  type: string;
  date: Date;
  status: string;
  totalValue: number;
  acoes: string;
}

interface EnterpriseData {
  address?: { 
    cep: string | undefined;
    endereco: string | undefined;
    endereco_numero: number | string | undefined; 
    bairro: string | undefined;
    estado: string | undefined;
    cidade: string | undefined;
  };
  email?: string | undefined;
  phone?: string | undefined;
  stateRegistration?: string | undefined;
}

interface Cliente {
  nomeContato?: string | undefined;
  emailContato?: string | undefined;
  telefoneContato?: string | undefined;
  prazoEntrega: string | undefined;
  tipoFrete: string | undefined;
}

@Component({
  selector: 'app-add-new-budget',
  standalone: true,
  imports: [ReturnArrowComponent, 
    AddNewFormComponent, 
    LucideAngularModule, 
    ReactiveFormsModule,
    ButtonComponent, 
    ButtonFormComponent, 
    TableInfoComponent, 
    DynamicItemsTableComponent,
    CpfCnpjMaskDirective],
  templateUrl: './add-new-budget.component.html',
  styleUrl: './add-new-budget.component.css'
})
export class AddNewBudgetComponent implements OnInit {

  @ViewChild(DynamicItemsTableComponent) table!: DynamicItemsTableComponent;
  empresaSelecionada: EnterpriseData | null = null; 
  clienteSeleconado : Cliente | null = null;

  private orcamentoCarregado: DadosOrcamento | null = null;

  isEditMode: boolean = false;
  editingPropostaId: string | null = null;
  pageTitle: string = 'Novo Orçamento'; 
  isLoading: boolean = false;

  constructor(
    private router: Router, 
    private fetchEnterpriseService: FetchEnterpriseService,
    private fb: FormBuilder,
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService,
    private sendOrcamentoPayloadService: SendOrcamentoPayloadService,
    private activatedRoute: ActivatedRoute,
    private fetchBudgetsService: FetchBudgetsService
    
  ) {}

  form!: FormGroup;
  cnpjError: string = '';
  enterprises: Item[] = [];
  isDeleting: boolean = false;
  newBudgets: Item[] = [];
  razaoSocial: string = '';
  enterprise: {} = {};
  
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const proposta = params.get('proposta');
      if (proposta) {
        this.isEditMode = true;
        this.editingPropostaId = proposta;
        this.pageTitle = 'Editar Orçamento';
        console.log('Editando orçamento:', proposta);
      } else {
        this.isEditMode = false;
        this.editingPropostaId = null;
        this.pageTitle = 'Novo Orçamento';
        console.log('Criando novo orçamento');
      }
    });

    this.form = this.fb.group({});
  }

  onFormSubmit(formData: any) {
    console.log('Form Data:', formData);
  }

  formFields: FieldConfig[] = [
    { 
      name: 'cnpj', 
      label: 'CNPJ', 
      type: 'text', 
      placeholder: '00.000.000/0000-00',
      useMask: 'cpfCnpjMask'
    },
    { name: 'razaoSocial', label: 'Razão Social', type: 'text', placeholder: 'Razão Social da empresa', disabled: true },
    { name: 'condicaoPagamento', label: 'Condição de Pagamento', type: 'select', options: [{ label: '15 DDL', value: '15 DDL' }, { label: '28 DDL', value: '28 DDL' }, { label: '28/42 DDL', value: '28/42 DDL' }, { label: '28/42/56 DDL', value: '28/42/56 DDL' }, { label: 'Pagamento a vista', value: 'Pagamento a vista' }, { label: 'Pagamento para 30 dias', value: 'pagamento para 30 dias' }] },
    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Aprovado', value: 'Aprovado' }, { label: 'Pendente', value: 'Pendente' }, { label: 'Reprovado', value: 'Reprovado' }] },
    { name: 'nomeContato', label: 'Contato', type: 'text', placeholder: 'Nome do contato'},
    { name: 'emailContato', label: 'Email', type: 'email', placeholder: 'contato@example.com'},
    { name: 'telefoneContato', label: 'Telefone', type: 'text', placeholder: 'Nome do contato'},
    { name: 'tipoFrete', label: 'Frete', type: 'select', options: [{ label: 'FOB', value: 'FOB' }, { label: 'CIF', value: 'CIF' }] },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do orçamento' }
  ];

  onEdit(budget: NewBudget) {
    console.log('editar', budget);
  }

  onDelete(budget: NewBudget) {
    if (!confirm(`Excluir ${budget.proposalNumber}?`)) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.newBudgets = this.newBudgets.filter(b => b.id !== budget.id);
      this.isDeleting = false;
    }, 500);
  }

  returnPage() {
    this.router.navigate(['budgets']);
  }

  onFormReady(formGroup: FormGroup) {
    console.log("Form ready, isEditMode:", this.isEditMode, "proposta", this.editingPropostaId)
    this.form = formGroup;

    if (this.isEditMode && this.editingPropostaId) {
      this.loadBudgetForEditing(this.editingPropostaId);
    } else {
      this.configureCnpjListenerForAppForm(this.form);
      this.isLoading = false; 
    }


    if (!this.isEditMode && this.form.get('cnpj')) {
      this.configureCnpjListenerForAppForm(formGroup);
    }
  }

  loadBudgetForEditing(propostaId: string): void {
    this.isLoading = true;
    this.fetchBudgetsService.getBudgetByProposta(propostaId).subscribe({
      next: (budgetData: DadosOrcamento) => {

        this.form.patchValue({
          cnpj: budgetData.cnpj,
          razaoSocial: budgetData.razaoSocial, 
          condicaoPagamento: budgetData.condicaoPagamento,
          status: budgetData.status,
          nomeContato: budgetData.nomeContato,
          emailContato: budgetData.emailContato,
          telefoneContato: budgetData.telefoneContato,
          prazoEntrega: budgetData.prazoEntrega, 
          validadeProposta: budgetData.validadeProposta, 
          tipoFrete: budgetData.tipoFrete,
          descricao: budgetData.descricao
        });

        const cnpjControl = this.form.get('cnpj');
        if (cnpjControl) {
          cnpjControl.disable();
        }
        const razaoSocialControl = this.form.get('razaoSocial');
        if (razaoSocialControl) {
          razaoSocialControl.disable();
        }

        this.empresaSelecionada = {
          address: {
            cep: budgetData.cep,
            endereco: budgetData.endereco,
            endereco_numero: budgetData.endereco_numero,
            bairro: budgetData.bairro,
            estado: budgetData.estado,
            cidade: budgetData.cidade
          },
        };

        if (this.table) { 
          this.table.setLoadedData({
            items: budgetData.itens,
            descontoGlobal: budgetData.descontoGlobal,
            valorFrete: budgetData.valorDoFrete,
            valorDifal: budgetData.difal
          });
        } else {
          console.warn('DynamicItemsTableComponent (this.table) não estava pronta ao carregar dados.');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados do orçamento:', err);
        this.isLoading = false;
        this.router.navigate(['/budgets']); 
        alert(`Erro ao carregar orçamento: ${err.message || 'Verifique o console.'}`);
      }
    });
  }

  configureCnpjListenerForAppForm(formGroup: FormGroup) {
    const cnpjControl = formGroup.get('cnpj');
    if (cnpjControl && !this.isEditMode) {
      cnpjControl.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(value => {
          const digits = value.replace(/\D/g, '');
          return digits.length === 11 || digits.length === 14; 
        }),
        switchMap(value => 
          this.fetchEnterpriseService.getEnterpriseByCnpj(value).pipe(
            catchError(() => {
              this.cnpjError = 'Empresa não encontrada';
              formGroup.get('razaoSocial')?.setValue('');
              this.empresaSelecionada = null; 
              return of(null);
            })
          )
        )
      ).subscribe(data => {
        if (data) {
          this.cnpjError = '';
          formGroup.get('razaoSocial')?.setValue(data.corporateName);
          this.empresaSelecionada = data;
          console.log('Empresa encontrada:', data);
        } else {
          formGroup.get('razaoSocial')?.setValue('');
          this.empresaSelecionada = null;
        }
      });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.warn('Formulário inválido:', this.form.errors);
      Object.keys(this.form.controls).forEach(key => {
        const controlErrors = this.form.get(key)?.errors;
        if (controlErrors != null) {
          console.error('Controle inválido:', key, controlErrors);
        }
      });
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const itensFromTable = this.table.getItemsForPayload(); 
    if (itensFromTable.length === 0) {
      alert('Adicione ao menos um item válido ao orçamento.');
      return;
    }

    const itensOrcamento: ItemOrcamento[] = itensFromTable.map((item: any) => {
      const adicionais: AdicionaisItem = {
        desenho: item.clienteForneceuDesenho === 'Sim' || item.clienteForneceuDesenho === true, 
        projeto: item.adicionarProjeto === 'Sim' || item.adicionarProjeto === true,
        arruela: item.adicionarArruela === 'Sim' || item.adicionarArruela === true,
        tampao: item.adicionarTampao === 'Sim' || item.adicionarTampao === true
      };
      return {
        produto: item.produto,
        modelo: item.modelo,
        quantidade: Number(item.quantidade),
        valorUnitario: Number(item.valorUnitario),
        desconto: Number(item.desconto) || 0, 
        ncm: item.ncm,
        aliquota: item.ipi,
        valorTotalItem: item.total,
        valorTotalItemCIPI: item.totalCIPI,
        adicionais: adicionais,
      };
    });

    const orcamentoPayload: DadosOrcamento = {
      proposta: null, 
      dataEmissao: new Date().toISOString().split('T')[0], 
      validadeProposta: this.form.get('validadeProposta')?.value || '30 dias',
      vendedorResponsavel: 'Vendedor Padrão', 
      dataUltimaModificacao: null, 
      cnpj: this.form.get('cnpj')?.value,
      razaoSocial: this.form.get('razaoSocial')?.value,
      condicaoPagamento: this.form.get('condicaoPagamento')?.value,
      descricao: this.form.get('descricao')?.value || '',
      status: this.form.get('status')?.value,
      itens: itensOrcamento,
      subtotalItens: this.table.subtotal, 
      descontoGlobal: this.table.descontoGlobal || 0,
      valorDoFrete: this.table.valorFrete || 0,
      difal: this.table.valorDifal || 0,
      grandTotal: this.table.grandTotal,
      cep: this.empresaSelecionada?.address?.cep,
      endereco: this.empresaSelecionada?.address?.endereco,
      endereco_numero: String(this.empresaSelecionada?.address?.endereco_numero), 
      bairro: this.empresaSelecionada?.address?.bairro,
      estado: this.empresaSelecionada?.address?.estado,
      cidade: this.empresaSelecionada?.address?.cidade,
      nomeContato: this.form.get('nomeContato')?.value,
      emailContato: this.form.get('emailContato')?.value,
      telefoneContato: this.form.get('telefoneContato')?.value,
      prazoEntrega: this.form.get('prazoEntrega')?.value,
      tipoFrete: this.form.get('tipoFrete')?.value,      

    };

    console.log('Payload ANTES do Interceptor:', orcamentoPayload);

    this.sendOrcamentoPayloadService.sendPayload(orcamentoPayload)
      .subscribe({
        next: (orcamentoRetornadoPeloBackend: DadosOrcamento) => {
          console.log('Orçamento salvo com sucesso!', orcamentoRetornadoPeloBackend);

          this.dadosNovoOrcamentoService.setOrcamento(orcamentoRetornadoPeloBackend); 
          this.router.navigate(['budget/pdf']);
        },
        error: (error) => {
          console.error('Erro ao salvar orçamento:', error);
          alert('Erro ao salvar orçamento. Verifique o console para detalhes.');
        }
      });
    this.dadosNovoOrcamentoService.setOrcamento(orcamentoPayload);

  }

}
