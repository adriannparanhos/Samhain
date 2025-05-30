import { Component, OnInit } from '@angular/core';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common'; 
import { TelefonePipe } from '../../pipes/telefone.pipe';


@Component({
  selector: 'app-orcamento-pdf',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TelefonePipe],
  templateUrl: './orcamento-pdf.component.html',
  styleUrl: './orcamento-pdf.component.css'
})
export class OrcamentoPdfComponent implements OnInit {
  orcamentoRecebido: DadosOrcamento | null = null;
  private orcamentoSubscription: Subscription | undefined;
  dataAtual: Date;


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

  // ADICIONAR AS PROPRIEDADES PARA A EMPRESA, CEP, ENDERECO, ENDERECO_NUMERO, BAIRRO, ESTADO, CIDADE
  cep: string | undefined = '';
  endereco: string | undefined = '';
  endereco_numero: string | number | undefined = '';
  bairro: string | undefined = '';
  estado: string | undefined = '';
  cidade: string | undefined = '';

  constructor(
    private dadosNovoOrcamentoService: DadosNovoOrcamentoService

  ) {
    this.dataAtual = new Date();
  }


  ngOnInit(): void {
    this.orcamentoSubscription = this.dadosNovoOrcamentoService.orcamentoAtual$.subscribe(
      (dados: DadosOrcamento | null) => {
        this.orcamentoRecebido = dados;
        console.log("Orçamento recebido no PDF Component: ", this.orcamentoRecebido);

        if (this.orcamentoRecebido) {
          this.preencherDadosGerais(); // Preenche os dados gerais do orçamento

          // AQUI VOCÊ TEM ACESSO AOS ITENS:
          const itensDoOrcamento = this.orcamentoRecebido.itens;
          console.log("Itens do orçamento:", itensDoOrcamento);

          // Você pode iterar sobre eles ou passá-los para o template
          if (itensDoOrcamento && itensDoOrcamento.length > 0) {
            // Exemplo de como processar cada item, se necessário:
            itensDoOrcamento.forEach(item => {
              console.log(`Produto: ${item.produto}, Qtd: ${item.quantidade}, Adicionais: `, item.adicionais);
              this.modelo = item.modelo;
              this.descricaoDetalhada = item.descricaoDetalhada
              this.quantidade = item.quantidade
              this.valorUnitario = item.valorUnitario
              this.valorTotalItem = item.valorTotalItem
            });
          }
        } else {
          this.limparDados();
        }
      }
    );
  }

  preencherDadosGerais(): void {
    if (!this.orcamentoRecebido) return; 

    this.numeroProposta = this.orcamentoRecebido.numeroProposta;
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
    this.numeroProposta = undefined;
    this.dataEmissao = undefined;
    // ... limpar todas as outras propriedades ...
    this.grandTotal = undefined;
  }

  ngOnDestroy(): void {
    if (this.orcamentoSubscription) {
      this.orcamentoSubscription.unsubscribe();
    }
  }
}
