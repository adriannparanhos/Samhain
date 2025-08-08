import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentVariablesService {
  private url = 'https://v2.calculadora.backend.baron.dev.br/api/variables'
  // private url = 'http://localhost:8080/api/variables'
  constructor(
    private http: HttpClient
  ) {}

  sendVariables(data: any): Observable<any> {;
    return this.http.post<any>(this.url, data, {
      responseType: 'json' 
    });
  }

  getVariables(): Observable<any> {
    return this.http.get(this.url);
  }
}
