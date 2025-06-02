import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';

@Injectable({
  providedIn: 'root'
})
export class FetchBudgetsService {

  constructor(private http: HttpClient) { }

  getBudgets(): Observable<DadosOrcamento[]> {
    const url = '';
    return this.http.get<DadosOrcamento[]>(url);
  }
}
