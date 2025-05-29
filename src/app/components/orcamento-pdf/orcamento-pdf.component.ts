import { Component, OnInit } from '@angular/core';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orcamento-pdf',
  imports: [],
  templateUrl: './orcamento-pdf.component.html',
  styleUrl: './orcamento-pdf.component.css'
})
export class OrcamentoPdfComponent implements OnInit {
  orcamentoRecebido: DadosOrcamento | null = null;
  private orcamentoSubscription: Subscription | undefined;


  constructor(
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService

  ) {}


  ngOnInit(): void {
    this.orcamentoSubscription = this.dadosNovoOrcamentoService.orcamentoAtual$.subscribe(
      (dados: DadosOrcamento | null) => {
        this.orcamentoRecebido = dados;
        console.log("Orçamento recebido: ", this.orcamentoRecebido);
      }
    );

    if (this.orcamentoRecebido) {
    }
  }

  ngOnDestroy(): void {
    if (this.orcamentoSubscription) {
      this.orcamentoSubscription.unsubscribe();
    }
  }
}
