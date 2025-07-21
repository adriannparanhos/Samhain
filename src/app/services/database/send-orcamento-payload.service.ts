import { Injectable } from '@angular/core';7
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { Product } from '../../models/interfaces/produtos';

@Injectable({
  providedIn: 'root'
})
export class SendOrcamentoPayloadService {

  constructor(private http: HttpClient) { }

  sendPayload(data: DadosOrcamento): Observable<DadosOrcamento> {
    const url = 'https://v2.calculadora.backend.baron.dev.br/api/orcamentos/salvar';
    // const url = 'http://localhost:8080/api/orcamentos/salvar';
    return this.http.post<DadosOrcamento>(url, data, {
      responseType: 'json'
    });
  }
  
}
