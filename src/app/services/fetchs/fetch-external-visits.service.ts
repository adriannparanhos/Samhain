import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchExternalVisitsService {

  constructor(private http: HttpClient) { }

  addVisit(visitData: any): Observable<any> {
    const url = 'https://v2.calculadora.backend.baron.dev.br/api/external-visits';
    // const url = 'http://localhost:8080/api/external-visits';

    return this.http.post<any[]>(url, visitData, {
      responseType: 'json'
    });
  }
}
