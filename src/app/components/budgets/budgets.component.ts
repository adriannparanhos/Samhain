import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';

interface Budget {
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
  selector: 'app-budgets',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent {
  constructor(private router: Router) {}

  budgets: Budget[] = [];
  isDeleting: boolean = false;

  columns: TableColumn<Budget>[] = [
    { header: 'Número da Proposta', field: 'proposalNumber' },
    { header: 'Razão Social', field: 'enterprise' },
    { header: 'Data', field: 'date', type: 'date' },
    { header: 'Status', field: 'status' },
    { header: 'Valor Total', field: 'totalValue', type: 'currency' }
  ];

  ngOnInit() {
    this.budgets = [
      { id: 1, proposalNumber: '12345', enterprise: 'Empresa A', type: 'Tipo A', date: new Date('2023-01-01'), status: 'Aprovado', totalValue: 1000, acoes: '' },
      { id: 2, proposalNumber: '67890', enterprise: 'Empresa B', type: 'Tipo B', date: new Date('2023-02-01'), status: 'Pendente', totalValue: 2000, acoes: '' },
      { id: 3, proposalNumber: '54321', enterprise: 'Empresa C', type: 'Tipo C', date: new Date('2023-03-01'), status: 'Cancelado', totalValue: 3000, acoes: '' }
    ];
  }

  onEdit(budget: Budget) {
    console.log('editar', budget);
  }

  onDelete(budget: Budget) {
    if (!confirm(`Excluir ${budget.proposalNumber}?`)) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.budgets = this.budgets.filter(b => b.id !== budget.id);
      this.isDeleting = false;
    }, 500);
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }


}
