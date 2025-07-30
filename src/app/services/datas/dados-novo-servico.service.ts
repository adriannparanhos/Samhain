import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceBudgetData } from '../../models/interfaces/dados-orcamento';


@Injectable({
  providedIn: 'root'
})
export class DadosNovoServicoService {
  private dataServico = new BehaviorSubject<ServiceBudgetData | null>(null);
  public servicoAtual$: Observable<ServiceBudgetData | null> = this.dataServico.asObservable();

  setServico(servico: ServiceBudgetData | null): void {
    this.dataServico.next(servico);
  }

  getServico(): ServiceBudgetData | null {
    return this.dataServico.getValue();
  }

  constructor() { }
}
