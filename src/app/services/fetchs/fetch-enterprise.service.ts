import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';   

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
export class FetchEnterpriseService {
  private apiUrl = 'https://v2.calculadora.backend.baron.dev.br/api/v1/enterprises/listar'; 
  // private apiUrl = 'http://localhost:8080/api/v1/enterprises/listar'; 

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
    const url = `https://v2.calculadora.backend.baron.dev.br/api/v1/enterprises/byCnpj?cnpj=${cnpj}`;
    // const url = `http://localhost:8080/api/v1/enterprises/byCnpj?cnpj=${cnpj}`;

    return this.http.get<IEnterprise>(url);
  }

  getEnterprises(
    page: number,
    size: number,
    searchTerm: string
  ): Observable<Page<IEnterprise>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
    
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm)
    }

    return this.http.get<Page<IEnterprise>>(this.apiUrl, {params})
  }

  addEnterprise(enterprise: any): Observable<any> {
    const url = 'https://v2.calculadora.backend.baron.dev.br/api/v1/enterprises/save';
    // const url = 'http://localhost:8080/api/v1/enterprises/save';

    return this.http.post<any[]>(url, enterprise, {
      responseType: 'json'
    });
  }
}
