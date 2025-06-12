import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OrcamentoItemNaTabela } from '../../models/orcamento-item';

@Injectable({
  providedIn: 'root'
})
export class FetchProductsService {
  private apiUrl = 'http://localhost:8080/api/produtos/lista'; 

  private productsState = new BehaviorSubject<Record<string, OrcamentoItemNaTabela[]>>({});
  
  public groupedProducts$ = this.productsState.asObservable();

  constructor(private http: HttpClient) {
    this.loadAndProcessProducts(); 
  }

  public refreshProducts(): void {
    this.loadAndProcessProducts();
  }

  private loadAndProcessProducts(): void {
    this.http.get<OrcamentoItemNaTabela[]>(this.apiUrl).pipe(
      map(data => this.processAndGroupData(data)), 
      tap(() => console.log("Dados de produtos carregados, processados e disponíveis."))
    ).subscribe(processedData => {
      this.productsState.next(processedData); 
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

  private customSort = (textA: string, textB: string): number => {
    const re = /(\d+)/g; 

    const partsA = textA.split(re).filter(Boolean);
    const partsB = textB.split(re).filter(Boolean);

    const len = Math.min(partsA.length, partsB.length);

    for (let i = 0; i < len; i++) {
      const partA = partsA[i];
      const partB = partsB[i];
      
      const isNumA = !isNaN(Number(partA));
      const isNumB = !isNaN(Number(partB));

      if (isNumA && isNumB) {
        const numA = Number(partA);
        const numB = Number(partB);
        if (numA !== numB) {
          return numA - numB; 
        }
      } else {
        const textualCompare = partA.localeCompare(partB);
        if (textualCompare !== 0) {
          return textualCompare; 
        }
      }
    }
    return partsA.length - partsB.length;
  };
}