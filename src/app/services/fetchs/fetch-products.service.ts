import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject ,Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FetchProductsService {
  private productsState = new BehaviorSubject<any[]>([]);
  private products$ = this.productsState.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialProducts();
  }

  getProducts(): Observable<any[]> {
    const url = 'http://localhost:8080/api/produtos/lista'; 
    return this.http.get<any[]>(url);
  }

  private loadInitialProducts() {
    this.getProducts().pipe(
      tap(data => console.log("Dados de produtos carregados e disponíveis para toda a aplicação", data))
    ).subscribe(data => this.productsState.next(data));
  }

}
