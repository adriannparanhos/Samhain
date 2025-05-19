import { Component } from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';


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
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule, ButtonComponent, ButtonFormComponent, TableInfoComponent, DynamicItemsTableComponent],
  templateUrl: './add-new-budget.component.html',
  styleUrl: './add-new-budget.component.css'
})
export class AddNewBudgetComponent {
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
    { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/0000-00' },
    { name: 'Razão Social', label: 'Razão Social', type: 'text', placeholder: 'Razão Social da empresa', disabled: true },
    { name: 'Condição de pagamento', label: 'Condição de Pagamento', type: 'select', options: [{ label: '15 DDL', value: '15 DDL' }, { label: '28 DDL', value: '28 DDL' }, { label: '28/42 DDL', value: '28/42 DDL' }, { label: '28/42/56 DDL', value: '28/42/56 DDL' }, { label: 'Pagamento a vista', value: 'Pagamento a vista' }, { label: 'Pagamento para 30 dias', value: 'pagamento para 30 dias' }] },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do orçamento' },
    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Aprovado', value: 'Aprovado' }, { label: 'Pendente', value: 'Pendente' }, { label: 'Reprovado', value: 'Reprovado' }] }
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
      filter(value => value && value.replace(/\D/g, '').length === 14), 
      switchMap(value =>
        this.fetchEnterpriseService.getEnterpriseByCnpj(value).pipe(
          catchError(() => {
            this.cnpjError = 'Empresa não encontrada';
            this.form.get('Razão Social')!.setValue(''); 
            return of(null);
          })
        )
      )
    ).subscribe(data => {
      if (data) {
        this.cnpjError = '';
        this.form.get('Razão Social')!.setValue(data.corporateName); 
        console.log('Empresa encontrada:', data);
      }
    });
  }

}
