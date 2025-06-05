import { Component, OnInit } from '@angular/core'; 
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { ListarOrcamentosDTOBackend } from '../../models/interfaces/dados-orcamento';


interface BudgetParaTabela { 
  proposta: string;
  razaoSocial: string;
  date: Date | null; 
  status: string;
  totalValue: number;
}

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit { 
  constructor(private router: Router, private fetchBudgetsService: FetchBudgetsService) {}

  budgets: BudgetParaTabela[] = [];
  isDeleting: boolean = false;
  isLoading: boolean = false;

  columns: TableColumn<BudgetParaTabela>[] = [
    { header: 'Número da Proposta', field: 'proposta' },
    { header: 'Razão Social', field: 'razaoSocial' },
    { header: 'Data', field: 'date', type: 'date' },
    { header: 'Status', field: 'status' },
    {
      header: 'Valor Total',
      field: 'totalValue',
      type: 'currency',
      currencyCode: 'BRL',         
      currencyDisplay: 'symbol',   
      currencyDigitsInfo: '1.2-2', 
      currencyLocale: 'pt-BR'      
    }
  ];

  ngOnInit() {
    this.loadFilteredBudgets(); 
  }

  private loadFilteredBudgets() {
    this.isLoading = true;
    this.fetchBudgetsService.getOrcamentosPendentes().subscribe({
      next: (data: ListarOrcamentosDTOBackend[]) => { 
        this.budgets = data.map(e => ({
          proposta: e.proposta || 'Proposta inválida',
          razaoSocial: e.razaoSocial || 'Razão Social não informada',
          date: e.data ? new Date(e.data) : null, 
          status: e.status || 'Status não informado',
          totalValue: e.grandTotal || 0,
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar orçamentos pendentes:', error);
        this.isLoading = false;
      }
    });
  }

  onEdit(budget: BudgetParaTabela) {
    console.log('editar', budget);
    this.router.navigate(['budgets/edit', budget.proposta]);
  }

  onDelete(budget: BudgetParaTabela) {
    if (!confirm(`Excluir ${budget.proposta}?`)) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.budgets = this.budgets.filter(b => b.proposta !== budget.proposta);
      this.isDeleting = false;
    }, 500);
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }
}