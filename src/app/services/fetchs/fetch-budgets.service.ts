import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { ListarOrcamentosDTOBackend } from '../../models/interfaces/dados-orcamento';

@Injectable({
  providedIn: 'root'
})
export class FetchBudgetsService {
  private apiUrlOrcamentos = 'http://localhost:8080/api/orcamentos'; 

  constructor(private http: HttpClient) { }

  getBudgets(): Observable<DadosOrcamento[]> {
    const url = 'http://localhost:8080/api/orcamentos/listar';
    return this.http.get<DadosOrcamento[]>(url);
  }

  getBudgetByProposta(proposta: string): Observable<DadosOrcamento> {
    return this.http.get<DadosOrcamento>(`${this.apiUrlOrcamentos}/listarOrcamento`, { params: { proposta } });
  }

  // ---------------------------------------------------------------------------------------------------------
  getFilteredBudgets(status: string[], sortField: string = 'dataEmissao', sortDirection: string = 'desc', secondarySortField: string = 'proposta', secondarySortDirection: string = 'desc'): Observable<ListarOrcamentosDTOBackend[]> {
    let params = new HttpParams();
    status.forEach(s => {
      params = params.append('status', s);
    });
    params = params.append('sort', `${sortField},${sortDirection}`);
    params = params.append('sort', `${secondarySortField},${secondarySortDirection}`); 

    return this.http.get<ListarOrcamentosDTOBackend[]>(`${this.apiUrlOrcamentos}/listar`, { params });
  }

  getPedidosAprovados(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Aprovado'], 'dataEmissao', 'desc', 'proposta', 'desc');
  }

  getOrcamentosPendentes(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Pendente'], 'dataEmissao', 'desc', 'proposta', 'desc');
  }

  getOrcamentosPendentesEReprovados(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Pendente', 'Reprovado'], 'dataEmissao', 'desc', 'proposta', 'desc');
  }

}
