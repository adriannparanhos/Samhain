import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OrcamentoItemNaTabela } from '../../models/orcamento-item';
import { Product } from '../../models/interfaces/produtos';
import { ListarProdutosDTOBackend } from '../../models/interfaces/dados-orcamento';

export interface SpecialProduct {
  id: number;
  modelo: string; 
  produto: string;
  valorUnitario: number;
  ncm: string;
  ipi: number;
}

@Injectable({
  providedIn: 'root'
})
export class FetchProductsService {
  private apiUrl = 'https://v2.calculadora.backend.baron.dev.br/api/produtos/lista'; 
  private apiUrlEspeciais = 'https://v2.calculadora.backend.baron.dev.br/api/produtosEspeciais/listar'; 

  // private apiUrl = 'http://localhost:8080/api/produtos/lista'; 
  // private apiUrlEspeciais = 'http://localhost:8080/api/produtosEspeciais/listar'; 

  private standardProductsState = new BehaviorSubject<Record<string, OrcamentoItemNaTabela[]>>({});
  public standardProductsGrouped$ = this.standardProductsState.asObservable();

  private specialProductsState = new BehaviorSubject<Record<string, SpecialProduct[]>>({});
  public specialProductsGrouped$ = this.specialProductsState.asObservable();


  private _productSaved$ = new Subject<void>();


  get productSaved$(): Observable<void> {
    return this._productSaved$.asObservable();
  }

  notifyProductSaved(): void {
    this._productSaved$.next();
  }

  constructor(private http: HttpClient) {
    this.loadStandardProducts(); 
    this.loadSpecialProducts();

  }

  public refreshProducts(): void {
    this.loadStandardProducts();
    this.loadSpecialProducts();
  }

  private loadStandardProducts(): void {
    this.http.get<OrcamentoItemNaTabela[]>(this.apiUrl).pipe(
      tap(rawData => {
        console.log('[DEBUG-SERVICE] Dados BRUTOS recebidos da API de Catálogo:', rawData);
        if (rawData && rawData.length > 0) {
          console.log('[DEBUG-SERVICE] Exemplo do primeiro item bruto:', rawData);
          console.log('[DEBUG-SERVICE] Exemplo do item bruto - produto:', rawData);
        }
      }),
      
      map(data => this.processAndGroupData(data)),   

      tap(groupedData => {
        console.log('[DEBUG-SERVICE] Dados APÓS o processamento e ordenação:', groupedData);
      })
    ).subscribe(processedData => {
      console.log('[DEBUG-SERVICE] Emitindo para standardProductsState.next():', processedData);
      this.standardProductsState.next(processedData); 
    });
  }

   private loadSpecialProducts(): void {
    this.http.get<SpecialProduct[]>(this.apiUrlEspeciais).pipe(
      map(data => this.groupSpecialProducts(data)),
      tap(() => console.log("Produtos ESPECIAIS/CADASTRADOS carregados e AGRUPADOS."))
    ).subscribe(groupedData => {
      this.specialProductsState.next(groupedData);
    });
  }

   private groupStandardProducts(data: OrcamentoItemNaTabela[]): Record<string, OrcamentoItemNaTabela[]> {
    if (!data || data.length === 0) {
      console.warn('[DEBUG-SERVICE] groupStandardProducts recebeu dados vazios ou nulos. Retornando {}.');
      return {}; 
    }
    
    return data.reduce((acc, item) => {
      const family = item.produto || 'Sem Categoria';
      if (!acc[family]) {
        acc[family] = [];
      }
      acc[family].push(item);
      return acc;
    }, {} as Record<string, OrcamentoItemNaTabela[]>);
  }

  private groupSpecialProducts(data: SpecialProduct[]): Record<string, SpecialProduct[]> {
    if (!data) return {};
    
    return data.reduce((acc, item) => {
      const family = item.produto || 'Produtos Especiais';
      if (!acc[family]) {
        acc[family] = [];
      }
      acc[family].push(item);
      return acc;
    }, {} as Record<string, SpecialProduct[]>);
  }

  getProducts(): Observable<ListarProdutosDTOBackend[]> {
    return this.http.get<ListarProdutosDTOBackend[]>(this.apiUrlEspeciais);
  }

  deleteProduct(id: number | undefined): Observable<void> {
    const url = `https://v2.calculadora.backend.baron.dev.br/api/produtosEspeciais/deletar?id=${id}`;
    // const url = `http://localhost:8080/api/produtosEspeciais/deletar?id=${id}`;
    return this.http.delete<void>(url);
  }

  payloadProducts(data: Product[]): Observable<Product[]> {
    const url = 'https://v2.calculadora.backend.baron.dev.br/api/produtosEspeciais/cadastro';
    // const url = 'http://localhost:8080/api/produtosEspeciais/cadastro';
    return this.http.post<Product[]>(url, data, {
      responseType: 'json'
    });

  }

  private processAndGroupData(data: OrcamentoItemNaTabela[]): Record<string, OrcamentoItemNaTabela[]> {
    
    const normalizedData = data.map(item => {
      if (item.produto?.toLowerCase() === 'peça usinada') {
        item.produto = 'Peça Usinada';
      }
      if (item.modelo.includes('HASTE')) {
        item.produto = 'Extratores';
      } else if (item.modelo.includes('PATOLÃO')) {
        item.produto = 'Patolão';
      }
      return item;
    });

    const grouped = normalizedData.reduce((acc, item) => {
      const family = item.produto || 'Outros';
      if (!acc[family]) acc[family] = [];
      acc[family].push(item);
      return acc;
    }, {} as Record<string, OrcamentoItemNaTabela[]>);

    for (const groupName in grouped) {
      grouped[groupName].sort((a, b) => this.customSort(a.modelo, b.modelo));
    }
    
    return grouped;
  }

  private customSort = (modeloA: string, modeloB: string): number => {
    
    const extrairCaracteristicas = (modelo: string) => {
      const matchEspessura = modelo.match(/#(\d+)/);
      const espessura = matchEspessura ? parseInt(matchEspessura[1], 10) : Infinity;

      let prioridadeCor = 3; 
      if (modelo.includes('BLACK')) prioridadeCor = 0;
      else if (modelo.includes('NATURAL')) prioridadeCor = 1;
      else if (modelo.includes('ULTRA')) prioridadeCor = 2;

      const prioridadeDimensao = modelo.includes('1000 x 3000') ? 1 : 0;

      return { prioridadeCor, prioridadeDimensao };
    };

    const caracA = extrairCaracteristicas(modeloA);
    const caracB = extrairCaracteristicas(modeloB);

    if (caracA.prioridadeCor !== caracB.prioridadeCor) {
      return caracA.prioridadeCor - caracB.prioridadeCor;
    }

    if (caracA.prioridadeDimensao !== caracB.prioridadeDimensao) {
      return caracA.prioridadeDimensao - caracB.prioridadeDimensao;
    }

    return modeloA.localeCompare(modeloB);
  };

}