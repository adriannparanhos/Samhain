import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrcamentoItem {
  id?: string;
  produto: string;
  modelo: string;
  quantidade: number;
  largura?: number;
  comprimento?: number;
  valorUnitario: number;
  desconto: number;
  ipi?: number;
  ncm: string;
  peso: number;
  categoria: string;
  
  textClass?: string;
  clienteForneceuDesenho?: boolean;
  adicionarProjeto?: boolean;
  adicionarArruela?: boolean;
  adicionarTampao?: boolean;
  valorDesenho?: number;
  valorProjeto?: number;
  valorArruela?: number;
  valorTampao?: number;
  isPanelVisible?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductDataService {
  private productsSubject = new BehaviorSubject<OrcamentoItem[]>([]);
  public products$ = this.productsSubject.asObservable();

  setProducts(products: OrcamentoItem[]) {
    this.productsSubject.next(products);
  }

  getProducts(): OrcamentoItem[] {
    return this.productsSubject.getValue();
  }

  constructor() { }
}
