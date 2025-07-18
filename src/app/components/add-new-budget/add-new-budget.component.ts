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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { SendOrcamentoPayloadService } from '../../services/database/send-orcamento-payload.service';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { NewBudget, EnterpriseData, Cliente } from '../../models/interfaces/dados-orcamento';
import { AttachmentUploaderComponent } from '../attachment-uploader/attachment-uploader.component';
import { AttachmentFile } from '../attachment-uploader/attachment-uploader.component'; // Ajuste o caminho

@Component({
  selector: 'app-add-new-budget',
  standalone: true,
  imports: [ReturnArrowComponent, 
    AddNewFormComponent, 
    LucideAngularModule, 
    ReactiveFormsModule,
    ButtonFormComponent,  
    DynamicItemsTableComponent,
    AttachmentUploaderComponent
  ],
  templateUrl: './add-new-budget.component.html',
  styleUrl: './add-new-budget.component.css'
})
export class AddNewBudgetComponent implements OnInit {

  @ViewChild(DynamicItemsTableComponent) table!: DynamicItemsTableComponent;
  empresaSelecionada: EnterpriseData | null = null; 
  clienteSeleconado : Cliente | null = null;

  isEditMode: boolean = false;
  editingPropostaId: string | null = null;
  pageTitle: string = 'Novo Orçamento'; 
  isLoading: boolean = false;
  anexos: AttachmentFile[] = [];

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
    { name: 'condicaoPagamento', label: 'Condição de Pagamento', type: 'text', placeholder: 'Condição de pagamento' },
    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Aprovado', value: 'Aprovado' }, { label: 'Pendente', value: 'Pendente' }, { label: 'Reprovado', value: 'Reprovado' }] },
    { name: 'nomeContato', label: 'Contato', type: 'text', placeholder: 'Nome do contato'},
    { name: 'emailContato', label: 'Email', type: 'email', placeholder: 'contato@example.com'},
    { name: 'telefoneContato', label: 'Telefone', type: 'text', placeholder: '(16)9 9999-8888'},
    { name: 'prazoEntrega', label: 'Prazo de entrega', type: 'text', placeholder: 'Ex: 25 dias úteis'},
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

    const statusControl = this.form.get('status');
    if (statusControl) {
      statusControl.setValue('Pendente');
      console.log('Status definido como Pendente para novo orçamento.');
    } else {
      console.warn("Controle 'status' não encontrado no formulário ao tentar definir valor padrão.");
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

    const itensParaPayloadBackend = itensFromTable.map((item: any) => {
      console.log('--- DEBUG onSave - Item Recebido da Tabela ---');
      console.log('Item completo:', JSON.parse(JSON.stringify(item)));
      console.log('item.clienteForneceuDesenho:', item.clienteForneceuDesenho, '(Tipo:', typeof item.clienteForneceuDesenho, ')');
      console.log('item.adicionarProjeto:', item.adicionarProjeto, '(Tipo:', typeof item.adicionarProjeto, ')');
      console.log('item.adicionarArruela:', item.adicionarArruela, '(Tipo:', typeof item.adicionarArruela, ')');
      console.log('item.adicionarTampao:', item.adicionarTampao, '(Tipo:', typeof item.adicionarTampao, ')');
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
        desenho: !!item.clienteForneceuDesenho, 
        projeto: !!item.adicionarProjeto,
        arruela: !!item.adicionarArruela,
        tampao: !!item.adicionarTampao,

        largura: item.largura ? Number(item.largura) : undefined,
        comprimento: item.comprimento ? Number(item.comprimento) : undefined,
        quantidadeConjuntos: item.quantidadeConjuntos,
      };
    });

    const orcamentoPayload: DadosOrcamento = {
      proposta: this.isEditMode ? this.editingPropostaId : null,
      dataEmissao: new Date().toISOString().split('T')[0], 
      validadeProposta: this.form.get('validadeProposta')?.value || '30 dias',
      vendedorResponsavel: 'Vendedor Padrão', 
      dataUltimaModificacao: this.isEditMode ? new Date().toISOString().split('T')[0] : null,
      cnpj: this.form.get('cnpj')?.value,
      razaoSocial: this.form.get('razaoSocial')?.value,
      condicaoPagamento: this.form.get('condicaoPagamento')?.value,
      descricao: this.form.get('descricao')?.value || '',
      status: this.form.get('status')?.value,
      itens: itensParaPayloadBackend,
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
      
      anexos: this.anexos.map(anexo => ({
          nome: anexo.file.name,
          url: anexo.previewUrl as any 
      }))

    };

    const statusFinal = orcamentoPayload.status; 

    console.log('Payload ANTES do Interceptor:', orcamentoPayload);

    this.sendOrcamentoPayloadService.sendPayload(orcamentoPayload)
      .subscribe({
        next: (orcamentoRetornadoPeloBackend: DadosOrcamento) => {
          console.log('Orçamento salvo com sucesso!', orcamentoRetornadoPeloBackend);
          orcamentoRetornadoPeloBackend.anexos = orcamentoPayload.anexos;

          if (this.isEditMode && statusFinal === 'Reprovado') {
            console.log('Status é Reprovado. Redirecionando para a lista de orçamentos.');
            this.router.navigate(['/budgets']);
          } else {
            console.log('Redirecionando para a página do PDF.');
            this.dadosNovoOrcamentoService.setOrcamento(orcamentoRetornadoPeloBackend);
            this.router.navigate(['budget/pdf']);
          }
        },
        error: (error) => {
          console.error('Erro ao salvar orçamento:', error);
          alert('Erro ao salvar orçamento. Verifique o console para detalhes.');
        }
      });
  }

  onAttachmentsChanged(files: AttachmentFile[]): void {
    this.anexos = files;
    console.log('Anexos atualizados no componente pai:', this.anexos);
  }

}
