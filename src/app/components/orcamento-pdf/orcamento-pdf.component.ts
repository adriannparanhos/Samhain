import { Component, OnInit } from '@angular/core';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common'; 
import { TelefonePipe } from '../../pipes/telefone.pipe';
import { ReturnArrowComponent } from '../return-arrow/return-arrow.component';
import { Router } from '@angular/router';
import { ItemOrcamentoPayload } from '../../models/interfaces/dados-orcamento';


@Component({
  selector: 'app-orcamento-pdf',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TelefonePipe, ReturnArrowComponent],
  templateUrl: './orcamento-pdf.component.html',
  styleUrl: './orcamento-pdf.component.css'
})
export class OrcamentoPdfComponent implements OnInit {
  orcamentoRecebido: DadosOrcamento | null = null;
  private orcamentoSubscription: Subscription | undefined;
  dataAtual: Date;
  taxInformation: string = '1- ';

  CONDICOES_GERAL_VENDA_PART1: string = `Nossos produtos são fornecidos 
  de acordo com a ABNT NBR 14.922, para peças semiacabadas. 
  Para peças usinadas, devido ao UHMW ser um material flexível, 
  a classe de tolerância dimensional utilizada, será de acordo com a DIN 2768. 
  Para que a ordem de compra seja aceita, é obrigatório a indicação e conferência 
  da transportadora, ou outro meio de envio registrado, para que a coleta dos 
  produtos fornecidos, seja feita no ato do faturamento. 
  A Baron reserva o direito de faturar os produtos adquiridos antes da data 
  prevista para a entrega. Após o recebimento da ordem de compra, o 
  pedido estará sujeito à análise de crédito pelo Departamento Financeiro. 
  Forma de pagamento, prazo, e informações do responsável pelo financeiro da 
  empresa contratante, são imprescindíveis para a validação da ordem de compra. 
  As condições de prazo de entrega serão verificadas de acordo com a posição atual 
  de estoque de materiais, podendo ser reposicionado pela fábrica, o qual será 
  imediatamente informado ao cliente. O prazo de entrega somente começara a ser 
  contabilizado a partir do aceite pela fábrica da respectiva ordem de compra, 
  via e-mail de confirmação enviado ao cliente. Caso haja algum imprevisto 
  quanto a atrasos em pagamentos, favor informar a Baron o quanto antes, 
  para que providências sejam tomadas previamente. Caso o pagamento não seja 
  efetuado nas datas constantes da ordem de compra, será acrescido aos valores, 
  2% referente a multa por atraso, de 5% ao mês, referentes a juros de mora, 
  contados a partir da data de vencimento`;

  CONDICOES_GERAL_VENDA_PART2: string = `Procedimento de Devolução: 
  Após detectado uma anomalia, o cliente deverá entrar em contato 
  imediatamente com a Baron, pelo telefone: +55 16 3378-0335; ou 
  pelo e-mail, sac@baron.com.br e informar o ocorrido. Posteriormente, 
  deverá fazer uma nota fiscal de devolução e reenviar o pedido integral ou 
  parcial à Baron. As despesas referentes ao frete de devolução serão 
  custeadas pelo cliente e poderão ser reembolsadas pela Baron, somente após 
  constatada a não conformidade ocasionada pela Baron, através do Relatório de 
  Não Conformidade (RNC). Todas as trocas deverão estar na mesma embalagem a qual 
  foi enviada ao cliente, e embaladas da mesma forma, sob o risco da não conformidade 
  ser constatada pela má qualidade da embalagem de devolução. Após recebido a mercadoria 
  integral e/ou parcial, pelo Departamento de Qualidade da Baron, serão realizadas as 
  inspeções de embalagem e da não conformidade relatada pelo cliente. 
  Após a abertura da RNC pela Baron, o Departamento de Qualidade tem o prazo 
  de 5 dias úteis para emitir o RNC correspondente. Após o recebimento da RNC, o 
  Departamento Comercial será responsável pela divulgação e ações corretivas e 
  todas as informações de procedimentos adotados para a garantia de satisfação do 
  cliente e ainda, se for o caso, a reparação do pedido, incluindo eventuais 
  reembolsos financeiros, cancelamentos de cobranças, trocas e/ou reparos`


  proposta?: string | undefined | null= '';  
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
  dataUltimaModificacao?: string | null;

  produto: string | undefined = '';       
  modelo: string | undefined = '';        
  descricaoDetalhada?: string;
  quantidade: number | undefined;
  valorUnitario: number | undefined;
  unidade?: string | undefined;        
  desconto?: number | undefined;      
  valorTotalItem?: number | undefined; 

  cep: string | undefined = '';
  endereco: string | undefined = '';
  endereco_numero: string | number | undefined | null = '';
  bairro: string | undefined = '';
  estado: string | undefined = '';
  cidade: string | undefined = '';

  constructor(
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService,
    private router: Router

  ) {
    this.dataAtual = new Date();
  }


   ngOnInit(): void {
    this.orcamentoSubscription = this.dadosNovoOrcamentoService.orcamentoAtual$.subscribe(
      (dados: DadosOrcamento | null) => {
        this.orcamentoRecebido = dados;
        console.log("Orçamento recebido no PDF Component: ", this.orcamentoRecebido);

        if (this.orcamentoRecebido) {
          this.preencherDadosGerais();
          this.calcularInformacaoImposto();
          const itensDoOrcamento = this.orcamentoRecebido.itens;
          console.log("Itens do orçamento:", itensDoOrcamento);

        } else {
          this.limparDados();
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.orcamentoSubscription) {
      this.orcamentoSubscription.unsubscribe();
    }
  }

  preencherDadosGerais(): void {
    if (!this.orcamentoRecebido) return; 

    this.proposta = this.orcamentoRecebido.proposta;
    this.dataEmissao = this.orcamentoRecebido.dataEmissao;
    this.validadeProposta = this.orcamentoRecebido.validadeProposta;
    this.cnpj = this.orcamentoRecebido.cnpj;
    this.razaoSocial = this.orcamentoRecebido.razaoSocial;
    this.nomeContato = this.orcamentoRecebido.nomeContato;
    this.emailContato = this.orcamentoRecebido.emailContato;
    this.telefoneContato = this.orcamentoRecebido.telefoneContato;
    this.condicaoPagamento = this.orcamentoRecebido.condicaoPagamento;
    this.prazoEntrega = this.orcamentoRecebido.prazoEntrega;
    this.tipoFrete = this.orcamentoRecebido.tipoFrete;
    this.descricao = this.orcamentoRecebido.descricao;
    this.status = this.orcamentoRecebido.status;
    this.subtotalItens = this.orcamentoRecebido.subtotalItens;
    this.descontoGlobal = this.orcamentoRecebido.descontoGlobal;
    this.valorDoFrete = this.orcamentoRecebido.valorDoFrete;
    this.difal = this.orcamentoRecebido.difal;
    this.outrasTaxas = this.orcamentoRecebido.outrasTaxas;
    this.grandTotal = this.orcamentoRecebido.grandTotal;
    this.vendedorResponsavel = this.orcamentoRecebido.vendedorResponsavel;
    this.dataUltimaModificacao = this.orcamentoRecebido.dataUltimaModificacao;
    this.cep = this.orcamentoRecebido.cep;
    this.endereco = this.orcamentoRecebido.endereco;
    this.endereco_numero = this.orcamentoRecebido.endereco_numero;
    this.bairro = this.orcamentoRecebido.bairro;
    this.estado = this.orcamentoRecebido.estado;
    this.cidade = this.orcamentoRecebido.cidade;


  }

  limparDados(): void {
    this.proposta = undefined;
    this.dataEmissao = undefined;
    this.grandTotal = undefined;
  }

  determinarUnidadeParaItem(item: ItemOrcamentoPayload): string {
    if (item.produto === 'Revestimento' && (item.quantidadeConjuntos ?? 1) <= 1) {
      return 'm²';
    }

    if (item.produto === 'Revestimento' && (item.quantidadeConjuntos ?? 1) > 1) {
      return 'Cj';
    }
    
    return item.unidade || 'UN'; 
  }

  getQuantidadeDisplay(item: ItemOrcamentoPayload): number | string {
    if (item.produto === 'Revestimento' && (item.quantidadeConjuntos ?? 0) > 1) {
      return item.quantidadeConjuntos ?? 0; 
    }
    return item.quantidade; 
  }

   getDescricaoPrincipalParaItem(item: ItemOrcamentoPayload): string {
    if (item.produto === 'Revestimento' && (item.quantidadeConjuntos ?? 1) > 1) {
      return `Conjunto de ${item.modelo || ''} ${item.quantidade} m²`;
    }
    return item.modelo || '';
  }

  getDescricaoDetalhadaParaPdf(item: ItemOrcamentoPayload): string | undefined {
    return item.descricaoDetalhada || undefined;
  }


  calcularInformacaoImposto(): void {
    if (!this.orcamentoRecebido || !this.orcamentoRecebido.estado) {
      this.taxInformation = '1- Impostos incluídos: Informações de estado não disponíveis.';
      return;
    }
    const state = this.orcamentoRecebido.estado;
    const taxes = this.stateTaxes[state];

    const temRevestimento = this.orcamentoRecebido.itens?.some(i => i.produto === 'Revestimento');

    if (state === 'SP' || temRevestimento) { 
        if (taxes) { 
            const currentTaxes = this.stateTaxes[state] || this.stateTaxes['SP']; 
             if(currentTaxes) {
                this.taxInformation = `1- Impostos incluídos: ICMS <span>${currentTaxes.ICMS}</span>; PIS <span>${currentTaxes.PIS}</span>; COFINS <span>${currentTaxes.COFINS}</span>; CSLL <span>${currentTaxes.CSLL}</span>; IRPJ <span>${currentTaxes.IRPJ}</span>`;
             } else {
                this.taxInformation = '1- Impostos incluídos: Configuração de impostos para o estado não encontrada.';
             }
        } else {
             this.taxInformation = '1- Impostos incluídos: Configuração de impostos para o estado não encontrada.';
        }
    } else if (taxes) {
      this.taxInformation = `1- Impostos incluídos: ICMS <span>${taxes.ICMS}%</span>; PIS <span>${taxes.PIS}</span>; COFINS <span>${taxes.COFINS}</span>; CSLL <span>${taxes.CSLL}</span>; IRPJ <span>${taxes.IRPJ}</span>`;
    } else {
      this.taxInformation = '1- Impostos incluídos: Informações não disponíveis para o estado selecionado.';
    }
  }

  stateTaxes: { [key: string]: { ICMS: string; PIS: string; COFINS: string; CSLL: string; IRPJ: string } } = {
    SP: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    MG: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    RJ: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    PR: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    SC: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    RS: { ICMS: '12%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    
    AC: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    GO: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,08%', IRPJ: '1,20%' },
    AL: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    AP: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    BA: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    CE: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    DF: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    ES: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    MA: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    MT: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    MS: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    PA: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    PB: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    PE: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    PI: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    RN: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    RO: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    RR: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    SE: { ICMS: '7%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
    TO: { ICMS: '10%', PIS: '0,65%', COFINS: '3%', CSLL: '1,10%', IRPJ: '1,20%' },
  };

  returnPage() {
    this.router.navigate(['budgets/add']);
  }
}
