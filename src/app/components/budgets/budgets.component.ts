import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';

interface Budget {
  id: number;
  proposalNumber: string;
  enterprise: string;
  type: string;
  date: Date;
  status: string;
  totalValue: number;
  acoes: string; // Embora 'acoes' não esteja sendo mapeado no loadBudgets, ele está na interface.
}

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit { // Implementado OnInit
  constructor(private router: Router, private fetchBudgetsService: FetchBudgetsService) {}

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
    this.loadBudgets(); // Chamar loadBudgets aqui para carregar os dados ao iniciar o componente
  }

  private loadBudgets() {
    this.fetchBudgetsService.getBudgets().subscribe({
      next: (data: any[]) => { // 'data' é o que vem da API
        this.budgets = data.map(e => ({
          id: e.id, // Certifique-se de que o id está vindo do backend
          proposalNumber: e.proposalNumber,
          enterprise: e.razaoSocial, // Assumindo que 'razaoSocial' do backend mapeia para 'enterprise'
          type: e.type || '', // Adicione um valor padrão ou trate se 'type' não vier
          date: new Date(e.data), // Converte a string de data para objeto Date
          status: e.status,
          totalValue: e.valorTotal,
          acoes: '' // Adicione um valor padrão para 'acoes' ou trate conforme necessário
        }));
      },
      error: (error) => { // 'error' é o erro do observable
        console.error('Erro ao carregar orçamentos:', error);
        // Aqui você pode adicionar lógica para mostrar uma mensagem de erro na UI
      }
    });
  }

  onEdit(budget: Budget) {
    console.log('editar', budget);
    // Exemplo: Navegar para a rota de edição
    this.router.navigate(['budgets/edit', budget.id]);
  }

  onDelete(budget: Budget) {
    if (!confirm(`Excluir ${budget.proposalNumber}?`)) return;
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
      this.budgets = this.budgets.filter(b => b.id !== budget.id);
      this.isDeleting = false;
    }, 500);
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }
}