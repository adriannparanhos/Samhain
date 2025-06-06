import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
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

  allBudgets: BudgetParaTabela[] = [];   
  pagedBudgets: BudgetParaTabela[] = [];  
  isLoading: boolean = false;

  searchTerm: string = '';
  currentPage = 1;
  pageSize = 10;
  totalFilteredItems = 0;

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
  ) {}

  ngOnInit() {
    this.loadFilteredBudgets();
  }

  get totalPages(): number {
    if (this.totalFilteredItems === 0) return 1;
    return Math.ceil(this.totalFilteredItems / this.pageSize);
  }

  private loadFilteredBudgets() {
    this.isLoading = true;
    this.fetchBudgetsService.getOrcamentosPendentesEReprovados().subscribe({
      next: (data: ListarOrcamentosDTOBackend[]) => {
        this.allBudgets = data.map(e => ({
          proposta: e.proposta || 'Proposta inválida',
          razaoSocial: e.razaoSocial || 'Razão Social não informada',
          date: e.data ? new Date(e.data) : null,
          status: e.status || 'Status não informado',
          totalValue: e.grandTotal || 0,
        }));
        this.updateView(); 
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
    this.currentPage = 1; 
    this.updateView();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateView();
  }

  private updateView() {
    let filtered = this.allBudgets;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      filtered = this.allBudgets.filter(budget =>
        budget.proposta.toLowerCase().includes(lowerCaseSearchTerm) ||
        budget.razaoSocial.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    this.totalFilteredItems = filtered.length;

    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.pagedBudgets = filtered.slice(startIndex, startIndex + this.pageSize);
  }

  onEdit(budget: BudgetParaTabela) {
    console.log('editar', budget);
    this.router.navigate(['budgets/edit', budget.proposta]);
  }

  onDelete(budget: BudgetParaTabela) {
    if (!confirm(`Excluir ${budget.proposta}?`)) return;
    this.isDeleting = true;
    
    setTimeout(() => {
        this.allBudgets = this.allBudgets.filter(b => b.proposta !== budget.proposta);
        this.updateView(); 
        this.isDeleting = false;
    }, 500);
  }

  openAddBudget() {
    this.router.navigate(['budgets/add']);
  }
}