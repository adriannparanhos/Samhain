import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService, Page } from '../../services/fetchs/fetch-budgets.service'; // Importa Page
import { ListarOrcamentosDTOBackend, BudgetParaTabela, DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent, CommonModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css'
})
export class BudgetsComponent implements OnInit {

  pagedBudgets: BudgetParaTabela[] = [];
  isLoading: boolean = false;

  searchTerm: string = '';
  currentPage = 0; 
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  isDeleting: boolean = false;

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
    private router: Router,
    private fetchBudgetsService: FetchBudgetsService,
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService
  ) { }

  ngOnInit() {
    this.loadFilteredBudgets();
  }

  loadFilteredBudgets(): void {
    this.isLoading = true;
    this.fetchBudgetsService.getOrcamentosPendentesEReprovadoss(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (page: Page<ListarOrcamentosDTOBackend>) => {
          this.pagedBudgets = page.content.map(e => ({
            proposta: e.proposta || 'Proposta inválida',
            razaoSocial: e.razaoSocial || 'Razão Social não informada',
            date: e.data ? new Date(e.data) : null,
            status: e.status || 'Status não informado',
            totalValue: e.grandTotal || 0,
          }));

          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar orçamentos:', error);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0;
    this.loadFilteredBudgets();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadFilteredBudgets();
  }

  onEdit(budget: BudgetParaTabela) {
    this.router.navigate(['budgets/edit', budget.proposta]);
  }

  onDelete(budget: BudgetParaTabela) {
    if (!confirm(`Excluir ${budget.proposta}?`)) return;
    this.isDeleting = true;

    this.fetchBudgetsService.deleteBudget(budget.proposta).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadFilteredBudgets();
      },
      error: (error: any) => {
        console.error('Erro ao excluir orçamento:', error);
        this.isDeleting = false;
      }
    });
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }
}
