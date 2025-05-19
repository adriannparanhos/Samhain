import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IEnterprise {
  cnpj: string,
  corporateName: string,
  email: string,
  phone: string,
  stateRegistration: string,
  address: {
    cep: string,
    endereco: string,
    endereco_numero: number,
    bairro: string,
    estado: string,
    cidade: string
  } 
}

@Injectable({
  providedIn: 'root'
})
export class FetchEnterpriseService {

  constructor(private http: HttpClient) { }

  getEnterprises(): Observable<IEnterprise[]> {
    const url = 'http://localhost:8080/api/v1/enterprises'; 
    return this.http.get<IEnterprise[]>(url);
  }

  getEnterpriseByCnpj(cnpj: string): Observable<IEnterprise> {
    const url = `http://localhost:8080/api/v1/enterprises/byCnpj?cnpj=${cnpj}`;
    return this.http.get<IEnterprise>(url);
  }
}
