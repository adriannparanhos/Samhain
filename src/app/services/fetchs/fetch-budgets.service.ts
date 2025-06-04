import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';

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
}
