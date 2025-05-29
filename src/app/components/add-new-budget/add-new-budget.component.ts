import { Component, ViewChild } from '@angular/core';
import { ReturnArrowComponent } from '../return-arrow/return-arrow.component';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-add-new-budget',
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
export class AddNewBudgetComponent {
  @ViewChild(DynamicItemsTableComponent) table!: DynamicItemsTableComponent;

  constructor(
    private router: Router, 
    private fetchEnterpriseService: FetchEnterpriseService,
    private fb: FormBuilder,
    
  ) {}

  form!: FormGroup;
  cnpjError: string = '';
  enterprises: Item[] = [];
  isDeleting: boolean = false;
  newBudgets: Item[] = [];
  razaoSocial: string = '';
  enterprise: {} = {};
  
  ngOnInit() {
    this.form = this.fb.group({
      cnpj: ['', [Validators.required]],
      'Razão Social': ['', [Validators.required]],
      'Condição de pagamento': ['', Validators.required],
      descricao: [''],
      status: ['', Validators.required]
    });
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
    this.form = formGroup;

    this.form.get('cnpj')!.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      filter(value => {
        const digits = value.replace(/\D/g, '');
        return digits.length === 11 || digits.length === 14; 
      }),
      switchMap(value =>
        this.fetchEnterpriseService.getEnterpriseByCnpj(value).pipe(
          catchError(() => {
            this.cnpjError = 'Empresa não encontrada';
            this.form.get('razaoSocial')!.setValue('');
            return of(null);
          })
        )
      )
    ).subscribe(data => {
      if (data) {
        this.cnpjError = '';
        this.form.get('razaoSocial')!.setValue(data.corporateName);
        console.log('Empresa encontrada:', data);
      }
    });
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const itens = this.table.getItemsForPayload();
    if (itens.length === 0) {
      alert('Adicione ao menos um item válido ao orçamento.');
      return;
    }

    this.router.navigate(['budget/pdf']);


    const payload = {
      cnpj: this.form.value.cnpj,
      razaoSocial: this.form.value.razaoSocial,
      condicaoPagamento: this.form.value.condicaoPagamento,
      descricao: this.form.value.descricao,
      descontoGlobal: this.table.descontoGlobal,
      valorDoFrete: this.table.valorFrete,
      difal: this.table.valorDifal,
      grandTotal: this.table.grandTotal,
      subtotal: this.table.subtotal,
      status: this.form.value.status,
      itens: itens.map(item => ({
        produto: item.produto,
        modelo: item.modelo,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
        desconto: item.desconto,
        adicionais: {
          desenho: item.clienteForneceuDesenho || false,
          projeto: item.adicionarProjeto || false,
          arruela: item.adicionarArruela || false,
          tampao: item.adicionarTampao || false
        }
      }))
    };
    console.log('Payload:', payload);
  }

}
