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
  // MUDANÇA 1: Ajustamos o método para aceitar um array de critérios de ordenação
  getFilteredBudgets(
    status: string[],
    sortCriteria: { field: string, direction: string }[] = [] // Aceita um array de objetos de sort
  ): Observable<ListarOrcamentosDTOBackend[]> {

    let params = new HttpParams();
    status.forEach(s => {
      params = params.append('status', s);
    });

    // Adiciona cada critério de ordenação como um parâmetro 'sort' separado
    sortCriteria.forEach(criteria => {
      params = params.append('sort', `${criteria.field},${criteria.direction}`);
    });

    return this.http.get<ListarOrcamentosDTOBackend[]>(`${this.apiUrlOrcamentos}/listar`, { params });
  }

  private getDefaultSortCriteria() {
    return [
      { field: 'anoProposta', direction: 'desc' },
      { field: 'mesProposta', direction: 'desc' },
      { field: 'incrementalProposta', direction: 'desc' }
    ];
  }

  getPedidosAprovados(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Aprovado'], this.getDefaultSortCriteria());
  }

  getOrcamentosPendentes(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Pendente'], this.getDefaultSortCriteria());
  }

  getOrcamentosPendentesEReprovados(): Observable<ListarOrcamentosDTOBackend[]> {
    return this.getFilteredBudgets(['Pendente', 'Reprovado'], this.getDefaultSortCriteria());
  }

  deleteBudget(proposta: string): Observable<void> {
    const url = `${this.apiUrlOrcamentos}/delete`;
    return this.http.delete<void>(url, { params: { proposta } });
  }

}
