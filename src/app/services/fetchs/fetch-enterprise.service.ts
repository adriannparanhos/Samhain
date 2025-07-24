import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  private apiUrl = `${environment.apiUrl}/v1/enterprises`;

  private enterprisesState = new BehaviorSubject<IEnterprise[]>([]);
  public enterprises$ = this.enterprisesState.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialEnterprises();
  }

  private loadInitialEnterprises() {
    this.http.get<IEnterprise[]>(`${this.apiUrl}/listar`).pipe(
      tap(data => console.log("Dados carregados e disponiveis para toda a applicação"))
    ).subscribe(data => this.enterprisesState.next(data));
  }

  getEnterpriseByCnpj(cnpj: string): Observable<IEnterprise> {
    const url = `${this.apiUrl}/byCnpj`;
    const params = new HttpParams().set('cnpj', cnpj);
    return this.http.get<IEnterprise>(url, { params });
  }

  getEnterprises(
    page: number,
    size: number,
    searchTerm: string
  ): Observable<Page<IEnterprise>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<Page<IEnterprise>>(`${this.apiUrl}/listar`, { params });
  }
}