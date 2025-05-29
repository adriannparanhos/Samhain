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

  numeroProposta?: string | undefined = '';  
  dataEmissao?: string | undefined = '';      
  validadeProposta?: string | undefined = '';  
  cnpj: string | undefined = '';
  razaoSocial: string | undefined = '';
  nomeContato?: string | undefined = '';
  emailContato?: string | undefined = '';
  telefoneContato?: string | undefined = '';

  condicaoPagamento: string | undefined = '';
  prazoEntrega: string | undefined = '';
  tipoFrete: string | undefined = '';

  descricao?: string | undefined = '';     
  status: string | undefined = '';

  subtotalItens: number | undefined;    
  descontoGlobal?: number | undefined;    
  valorDoFrete?: number | undefined;
  difal?: number | undefined;           
  outrasTaxas?: number | undefined;      
  grandTotal: number | undefined;     
  
  vendedorResponsavel?: string;
  dataUltimaModificacao?: string;

  produto: string | undefined = '';       
  modelo: string | undefined = '';        
  descricaoDetalhada?: string;
  quantidade: number | undefined;
  valorUnitario: number | undefined;
  unidade?: string | undefined;        
  desconto?: number | undefined;      
  valorTotalItem?: number | undefined; 

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
      this.fillHtml();
    }
  }

  ngOnDestroy(): void {
    if (this.orcamentoSubscription) {
      this.orcamentoSubscription.unsubscribe();
    }
  }

  fillHtml(): void {
    this.cnpj = this.orcamentoRecebido?.cnpj;
    this.razaoSocial = this.orcamentoRecebido?.razaoSocial;
    this.nomeContato = this.orcamentoRecebido?.nomeContato;
    this.emailContato = this.orcamentoRecebido?.emailContato;
    this.telefoneContato = this.orcamentoRecebido?.telefoneContato;
    this.condicaoPagamento = this.orcamentoRecebido?.condicaoPagamento;
    this.prazoEntrega = this.orcamentoRecebido?.prazoEntrega;
    this.tipoFrete = this.orcamentoRecebido?.tipoFrete;
    this.descricao = this.orcamentoRecebido?.descricao;
    this.status = this.orcamentoRecebido?.status;
    this.subtotalItens = this.orcamentoRecebido?.subtotalItens;
    this.descontoGlobal = this.orcamentoRecebido?.descontoGlobal;
    this.valorDoFrete = this.orcamentoRecebido?.valorDoFrete;
    this.difal = this.orcamentoRecebido?.difal;
    this.outrasTaxas = this.orcamentoRecebido?.outrasTaxas;
    this.grandTotal = this.orcamentoRecebido?.grandTotal;
    this.vendedorResponsavel = this.orcamentoRecebido?.vendedorResponsavel;
    this.dataUltimaModificacao = this.orcamentoRecebido?.dataUltimaModificacao;

  }
}
