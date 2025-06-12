import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';   // Importe o 'tap'

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
  private apiUrl = 'http://localhost:8080/api/v1/enterprises'; 

  private enterprisesState = new BehaviorSubject<IEnterprise[]>([]);

  public enterprises$ = this.enterprisesState.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialEnterprises();
  }

  private loadInitialEnterprises() {
    this.http.get<IEnterprise[]>(this.apiUrl).pipe(
      tap(data => console.log("Dados carregados e disponiveis para toda a applicação"))
    ).subscribe(data => this.enterprisesState.next(data));
  }

  getEnterpriseByCnpj(cnpj: string): Observable<IEnterprise> {
    const url = `http://localhost:8080/api/v1/enterprises/byCnpj?cnpj=${cnpj}`;
    return this.http.get<IEnterprise>(url);
  }
}
