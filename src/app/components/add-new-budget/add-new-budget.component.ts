import { Component } from '@angular/core';
import { ReturnArrowComponent } from '../return-arrow/return-arrow.component';
import { Router } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { ButtonComponent } from '../button/button.component';
import { LucideAngularModule } from 'lucide-angular';
import { FieldConfig } from '../add-new-form/add-new-form.component';
import { ButtonFormComponent } from '../button-form/button-form.component';

@Component({
  selector: 'app-add-new-budget',
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule, ButtonComponent, ButtonFormComponent],
  templateUrl: './add-new-budget.component.html',
  styleUrl: './add-new-budget.component.css'
})
export class AddNewBudgetComponent {
  constructor(private router: Router) {}

  formFields: FieldConfig[] = [
    { name: 'empresa', label: 'Empresa', type: 'select', options: [{ label: 'Empresa super legal', value: 'Empresa de mineiração' }, { label: 'Empresa super chata', value: 'Empresa de games' }] },
    { name: 'Condição de pagamento', label: 'Condição de Pagamento', type: 'select', options: [{ label: '15 DDL', value: '15 DDL' }, { label: '28 DDL', value: '28 DDL' }, { label: '28/42 DDL', value: '28/42 DDL' }, { label: '28/42/56 DDL', value: '28/42/56 DDL' }, { label: 'Pagamento a vista', value: 'Pagamento a vista' }, { label: 'Pagamento para 30 dias', value: 'pagamento para 30 dias' }], },
    { name: 'valorTotal', label: 'Valor Total', type: 'currency', placeholder: 'R$ 0,00' },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do orçamento' }
  ];

  onFormSubmit(formData: any) {
    console.log('Form Data:', formData);
  }

  returnPage() {
    this.router.navigate(['budgets']);
  }

}
