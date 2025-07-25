import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { ListarOrcamentosDTOBackend } from '../../models/interfaces/dados-orcamento';

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; 
}

@Injectable({
  providedIn: 'root'
})
export class FetchBudgetsService {
  private apiUrlOrcamentos = 'https://v2.calculadora.backend.baron.dev.br/api/orcamentos'; 
  // private apiUrlOrcamentos = 'http://localhost:8080/api/orcamentos'; 

  constructor(private http: HttpClient) { }

  getBudgets(): Observable<DadosOrcamento[]> {
    const url = 'https://v2.calculadora.backend.baron.dev.br/api/orcamentos/listar';
    // const url = 'http://localhost:8080/api/orcamentos/listar';
    return this.http.get<DadosOrcamento[]>(url);
  }

  getBudgetByProposta(proposta: string): Observable<DadosOrcamento> {
    return this.http.get<DadosOrcamento>(`${this.apiUrlOrcamentos}/listarOrcamento`, { params: { proposta } });
  }

  
  getFilteredBudgets(
    status: string[],
    sortCriteria: { field: string, direction: string }[] = [] 
  ): Observable<ListarOrcamentosDTOBackend[]> {

    let params = new HttpParams();
    status.forEach(s => {
      params = params.append('status', s);
    });

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

  getPedidosAproved(
    page: number, 
    size: number, 
    searchTerm: string
  ): Observable<Page<ListarOrcamentosDTOBackend>> {
    let params = new HttpParams()
      .set('status', 'Aprovado')
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'anoProposta,desc')
      .append('sort', 'mesProposta,desc')
      .append('sort', 'incrementalProposta,desc');

    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    
    return this.http.get<Page<ListarOrcamentosDTOBackend>>(`${this.apiUrlOrcamentos}/listar`, { params });
  }

  getOrcamentosPendentesEReprovadoss(
    page: number,
    size: number,
    searchTerm: string
  ): Observable<Page<ListarOrcamentosDTOBackend>> {
    let params = new HttpParams()
      .set('status', 'Pendente')
      .append('status', 'Reprovado')
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'anoProposta,desc')
      .append('sort', 'mesProposta,desc')
      .append('sort', 'incrementalProposta,desc');

    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm);
    }
    return this.http.get<Page<ListarOrcamentosDTOBackend>>(`${this.apiUrlOrcamentos}/listar`, { params });
  }

}
