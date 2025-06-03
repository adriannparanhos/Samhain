import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';

@Injectable({
  providedIn: 'root'
})
export class FetchBudgetsService {

  constructor(private http: HttpClient) { }

  // Vou fazer dois endpoints, um para pegar todos orcamentos aprovados e 
  // outro para pegar todos orcamentos pendentes
  // O primeiro vai ser usado para mostrar os orcamentos aprovados na tela de orcamentos
  // O segundo vai ser usado para mostrar os orcamentos pendentes na tela de orcamentos pendentes
  getBudgets(): Observable<DadosOrcamento[]> {
    const url = 'http://localhost:8080/api/orcamentos/listar';
    return this.http.get<DadosOrcamento[]>(url);
  }

   getBudgetByProposta(proposta: string): Observable<DadosOrcamento> {
    const apiUrl = 'http://localhost:8080/api/orcamentos';
    return this.http.get<DadosOrcamento>(`${apiUrl}/listarOrcamento`, { params: { proposta } });
  }
}
