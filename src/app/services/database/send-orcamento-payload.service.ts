import { Injectable } from '@angular/core';7
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendOrcamentoPayloadService {
  private url = `${environment.apiUrl}/orcamentos/salvar`;

  // const url = 'https://v2.calculadora.backend.baron.dev.br/api/orcamentos/salvar';
  // const url = 'http://localhost:8080/api/orcamentos/salvar';
  
  constructor(private http: HttpClient) { }

  
  sendPayload(data: DadosOrcamento): Observable<DadosOrcamento> {    
    return this.http.post<DadosOrcamento>(this.url, data, {
      responseType: 'json'
    });
  }
  
}
