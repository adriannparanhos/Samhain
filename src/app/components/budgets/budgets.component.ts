import { Component, OnInit } from '@angular/core'; 
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { ListarOrcamentosDTOBackend } from '../../models/interfaces/dados-orcamento';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';

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
  constructor(
    private router: Router, 
    private fetchBudgetsService: FetchBudgetsService, 
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService) {}

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

  onViewPedido(pedido: BudgetParaTabela): void {
    console.log('Visualizar Pedido (resumo):', pedido);
    if (!pedido || !pedido.proposta) {
      console.error('Dados do pedido inválidos para visualização do PDF.');
      alert('Não foi possível obter o número da proposta para visualizar o PDF.');
      return;
    }

    this.isLoading = true; 
    this.fetchBudgetsService.getBudgetByProposta(pedido.proposta).subscribe({
      next: (dadosCompletosDoOrcamento: DadosOrcamento) => {
        this.isLoading = false;
        if (dadosCompletosDoOrcamento) {
          this.dadosNovoOrcamentoService.setOrcamento(dadosCompletosDoOrcamento);
          this.router.navigate(['budgets/edit', pedido.proposta]);
        } else {
          console.error('Não foram encontrados dados completos para a proposta:', pedido.proposta);
          alert('Detalhes do pedido não encontrados para gerar o PDF.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(`Erro ao buscar dados completos da proposta ${pedido.proposta}:`, err);
        alert('Erro ao buscar detalhes do pedido para o PDF.');
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