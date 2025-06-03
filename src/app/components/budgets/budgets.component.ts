import { Component, OnInit } from '@angular/core'; 
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';

interface Budget {
  proposta: string;
  razaoSocial: string;
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
export class BudgetsComponent implements OnInit { 
  constructor(private router: Router, private fetchBudgetsService: FetchBudgetsService) {}

  budgets: Budget[] = [];
  isDeleting: boolean = false;

  columns: TableColumn<Budget>[] = [
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
    this.loadBudgets(); 
  }

  private loadBudgets() {
    this.fetchBudgetsService.getBudgets().subscribe({
      next: (data: any[]) => { 
        this.budgets = data.map(e => ({
          proposta: e.proposta || 'Proposta invalida',
          razaoSocial: e.razaoSocial || 'Razão Social não informada', 
          type: e.type || '', 
          date: new Date(e.data) || 'Data inválida', 
          status: e.status || 'Status não informado',
          totalValue: e.grandTotal || 0,
          acoes: '' 
        }));
      },
      error: (error) => { 
        console.error('Erro ao carregar orçamentos:', error);
      }
    });
  }

  onEdit(budget: Budget) {
    console.log('editar', budget);
    // Exemplo: Navegar para a rota de edição
    this.router.navigate(['budgets/edit', budget.proposta]);
  }

  onDelete(budget: Budget) {
    if (!confirm(`Excluir ${budget.proposta}?`)) return;
    this.isDeleting = true;

    // Idealmente, você chamaria um serviço para deletar no backend aqui
    // this.fetchBudgetsService.deleteBudget(budget.id).subscribe({
    //   next: () => {
    //     this.budgets = this.budgets.filter(b => b.id !== budget.id);
    //     this.isDeleting = false;
    //     console.log('Orçamento deletado com sucesso!');
    //     // Opcional: mostrar uma notificação de sucesso
    //   },
    //   error: (error) => {
    //     console.error('Erro ao deletar orçamento:', error);
    //     this.isDeleting = false;
    //     // Opcional: mostrar uma notificação de erro
    //   }
    // });

    // Mantendo o setTimeout para simular a exclusão local por enquanto:
    setTimeout(() => {
      this.budgets = this.budgets.filter(b => b.proposta !== budget.proposta);
      this.isDeleting = false;
    }, 500);
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }
}