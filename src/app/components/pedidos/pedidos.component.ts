import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { SearchComponent } from '../search/search.component';
import { BudgetParaTabela } from '../../models/interfaces/dados-orcamento';
import { Router } from '@angular/router';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { ListarOrcamentosDTOBackend } from '../../models/interfaces/dados-orcamento';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, TableInfoComponent, SearchComponent],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  constructor(private router: Router, private fetchBudgetsService: FetchBudgetsService) {}

  pedidos: BudgetParaTabela[] = [];
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
    this.loadPedidosAprovados();
  }

  private loadPedidosAprovados() {
    this.isLoading = true;
    this.fetchBudgetsService.getPedidosAprovados().subscribe({
      next: (data: ListarOrcamentosDTOBackend[]) => {
        this.pedidos = data.map(e => ({
          proposta: e.proposta || 'Proposta inválida',
          razaoSocial: e.razaoSocial || 'Razão Social não informada',
          date: e.data ? new Date(e.data) : null,
          status: e.status || 'Status não informado',
          totalValue: e.grandTotal || 0
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos aprovados:', err);
        this.isLoading = false;
      }
    });

  }

}
