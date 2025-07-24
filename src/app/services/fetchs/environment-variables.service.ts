import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentVariablesService {
  private url = `${environment.apiUrl}/variables`;

  // private url = 'https://v2.calculadora.backend.baron.dev.br/api/variables'
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
