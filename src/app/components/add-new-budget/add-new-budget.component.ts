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
  constructor(private router: Router, private fetchEnterpriseService: FetchEnterpriseService) {}

  enterprises: Item[] = [];
  isDeleting: boolean = false;
  newBudgets: Item[] = [];
  razaoSocial: string = '';
  enterprise: {} = {};
  
  ngOnInit() {
    
  }

  getEnterpriseByCnpj(cnpj: string) {
    this.fetchEnterpriseService.getEnterpriseByCnpj(cnpj).subscribe(
      data => {
        this.enterprise = [{
          id: +data.cnpj.replace(/\D/g, ''),
          razaoSocial: data.corporateName,
          CNPJ: data.cnpj,
          CidadeUF: `${data.address.cidade}/${data.address.estado}`
        }];
      },
      err => console.error(err)
    );
  }

  formFields: FieldConfig[] = [
    { name: 'empresa', label: 'Empresa', type: 'text', placeholder: '00.000.000/0000-00' },
    { name: 'Condição de pagamento', label: 'Condição de Pagamento', type: 'select', options: [{ label: '15 DDL', value: '15 DDL' }, { label: '28 DDL', value: '28 DDL' }, { label: '28/42 DDL', value: '28/42 DDL' }, { label: '28/42/56 DDL', value: '28/42/56 DDL' }, { label: 'Pagamento a vista', value: 'Pagamento a vista' }, { label: 'Pagamento para 30 dias', value: 'pagamento para 30 dias' }], },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do orçamento' },
    { name: 'status', label: 'Status', type: 'select', options: [{ label: 'Aprovado', value: 'Aprovado' }, { label: 'Pendente', value: 'Pendente' }, { label: 'Reprovado', value: 'Reprovado' }] },
  ];

  onFormSubmit(formData: any) {
    console.log('Form Data:', formData);
  }

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

}
