import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { SearchComponent } from '../search/search.component';
import { BudgetParaTabela, ListarOrcamentosDTOBackend, DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, TableInfoComponent, SearchComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  allPedidos: BudgetParaTabela[] = [];    
  pagedPedidos: BudgetParaTabela[] = [];  
  isLoading: boolean = false;

  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;
  totalFilteredItems = 0;

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

  constructor(
    private fetchBudgetsService: FetchBudgetsService,
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAllPedidos();
  }

  get totalPages(): number {
    if (this.totalFilteredItems === 0) return 1; 
    return Math.ceil(this.totalFilteredItems / this.pageSize);
  }

  private loadAllPedidos() {
    this.isLoading = true;
    this.fetchBudgetsService.getPedidosAprovados().subscribe({
      next: (data: ListarOrcamentosDTOBackend[]) => {
        this.allPedidos = data.map(e => ({
          proposta: e.proposta || 'Proposta inválida',
          razaoSocial: e.razaoSocial || 'Razão Social não informada',
          date: e.data ? new Date(e.data) : null,
          status: e.status || 'Status não informado',
          totalValue: e.grandTotal || 0
        }));
        this.updateView(); 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos aprovados:', err);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1; 
    this.updateView();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updateView();
  }

  private updateView(): void {
    let filtered = this.allPedidos;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filtered = this.allPedidos.filter(pedido =>
        pedido.proposta.toLowerCase().includes(lowerCaseSearchTerm) ||
        pedido.razaoSocial.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.totalFilteredItems = filtered.length;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedPedidos = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onEdit(budget: BudgetParaTabela) {
    console.log('editar', budget);
    this.router.navigate(['budgets/edit', budget.proposta]);
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
          this.router.navigate(['budget/pdf']);
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
  
}