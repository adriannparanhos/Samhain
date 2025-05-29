import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';

@Injectable({
  providedIn: 'root'
})
export class DadosNovoOrcamentoService {
  private dataOrcamento = new BehaviorSubject<DadosOrcamento | null>(null);
  public orcamentoAtual$: Observable<DadosOrcamento | null> = this.dataOrcamento.asObservable();

  setOrcamento(orcamento: DadosOrcamento | null): void {
    this.dataOrcamento.next(orcamento);
  }

  getOrcamento(): DadosOrcamento | null {
    return this.dataOrcamento.getValue();
  }

  constructor() { }
}
