import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchProductsService {

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {
    const url = 'http://localhost:8080/api/produtos/lista'; 
    return this.http.get<any[]>(url);
  }
}
