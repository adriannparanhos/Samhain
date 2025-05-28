import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CalcResponse {
  subtotal: number;
  grandTotal: number;
  itensComTotais?: { total: number }[];
  valorUnitario: number;
  total: number;
  totalCIPI: number;
  pesoTotal: number;
}

@Injectable({ providedIn: 'root' })
export class CalculateValueStandartService {
  private url = 'http://localhost:8080/api/calculate-item';

  constructor(private http: HttpClient) { }

  postCalculateValueStandart(payload: any): Observable<CalcResponse> {
    // repare no <CalcResponse> aqui
    return this.http.post<CalcResponse>(this.url, payload);
  }
}
