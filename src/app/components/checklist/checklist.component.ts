import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { DadosNovoOrcamentoService } from '../../services/datas/dados-novo-orcamento.service';
import { DadosOrcamento } from '../../models/interfaces/dados-orcamento';

export interface ClienteData {
  empresa: string;
  cnpj: string;
  ie: string;
  enderecoFaturamento: string;
  enderecoEntrega: string;
  enderecoCobranca: string;
  contribuinteIcms: boolean;
  clienteFinal: boolean;
  cidade: string;
  estado: string;
}

export interface PedidoData {
  cliente: ClienteData;
  condicoesPagamento: string;
  contatos: {
    finalidade: string;
    nome: string;
    telefone: string;
    email: string;
  }[];
  numeroPedido?: string;
  transportadora?: {
    nome: string;
    cnpj: string;
    contato: string;
    email: string;
  };
  formaPagamentoBoleto?: boolean;
  formaPagamentoDeposito?: boolean;
  frete?: 'FOB' | 'CIF';
  observacoes?: string;
}


@Component({
  selector: 'app-checklist',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.css'
})
export class ChecklistComponent implements OnInit, OnChanges {
  clienteFinal = false;
  revenda = false;
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
  pesoTotal: number | undefined; 
  valorKg: number | undefined;
  
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
  inscricao_estadual: string | undefined = '';
  enderecoFaturamento: string | undefined = '';

  @Input() dadosPedido!: PedidoData;
  orcamentoRecebido: DadosOrcamento | null = null;
  private orcamentoSubscription: Subscription | undefined;
  checklistForm: FormGroup;

  constructor(private fb: FormBuilder, private dadosNovoOrcamentoService: DadosNovoOrcamentoService) {
    this.checklistForm = this.fb.group({
      numeroPedido: [''],
      pagamentoBoleto: [false],
      pagamentoDeposito: [false],
      condicoesPagamento: [''],
      nomeTransportadora: [''],
      cnpjTransportadora: [''],
      contatoTransportadora: [''],
      emailTransportadora: [''],
      freteFOB: [false],
      freteCIF: [false],
      observacoes: [''],
      clienteFinal: [false],
      revenda: [false],
      ICMS_SIM: [false],
      ICMS_NAO: [false],
      enderecoFaturamento: ['']
    });
  }

  ngOnInit(): void {
    if (this.dadosPedido) {
      this.preencherFormulario(this.dadosPedido);
    }
    this.orcamentoSubscription = this.dadosNovoOrcamentoService.orcamentoAtual$.subscribe(
      (dados: DadosOrcamento | null) => {
        this.orcamentoRecebido = dados;
        console.log('Orçamento recebido:', this.orcamentoRecebido);
        if (this.orcamentoRecebido) {
          this.preencherDados();
        } else {
          console.warn('Nenhum orçamento recebido.');
        }
      }
    )

    this.setupCheckboxMutualExclusion();
  }

  ngOnDestroy(): void {
    if (this.orcamentoSubscription) {
      this.orcamentoSubscription.unsubscribe();
    }
  }

  preencherDados(): void {
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
    this.pesoTotal = this.orcamentoRecebido.peso;
    this.vendedorResponsavel = this.orcamentoRecebido.vendedorResponsavel;
    this.dataUltimaModificacao = this.orcamentoRecebido.dataUltimaModificacao;
    this.cep = this.orcamentoRecebido.cep;
    this.endereco = this.orcamentoRecebido.endereco;
    this.endereco_numero = this.orcamentoRecebido.endereco_numero;
    this.bairro = this.orcamentoRecebido.bairro;
    this.estado = this.orcamentoRecebido.estado;
    this.cidade = this.orcamentoRecebido.cidade;
    this.inscricao_estadual = this.orcamentoRecebido.inscricao_estadual;
    const enderecoFormatado = `${this.orcamentoRecebido.endereco}, ${this.orcamentoRecebido.enderecoNumero ?? 'S/N'}, ${this.orcamentoRecebido.bairro} - ${this.orcamentoRecebido.cidade}, ${this.orcamentoRecebido.estado},  - Cep: ${this.orcamentoRecebido.cep}`;

    this.checklistForm.patchValue({
      enderecoFaturamento: enderecoFormatado
    });


  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosPedido'] && changes['dadosPedido'].currentValue) {
      this.preencherFormulario(changes['dadosPedido'].currentValue);
    }
  }

  private preencherFormulario(data: PedidoData): void {
    this.checklistForm.patchValue({
      numeroPedido: data.numeroPedido || '',
      pagamentoBoleto: data.formaPagamentoBoleto || false,
      pagamentoDeposito: data.formaPagamentoDeposito || false,
      condicoesPagamento: data.condicoesPagamento || '',
      nomeTransportadora: data.transportadora?.nome || '',
      cnpjTransportadora: data.transportadora?.cnpj || '',
      contatoTransportadora: data.transportadora?.contato || '',
      emailTransportadora: data.transportadora?.email || '',
      freteFOB: data.frete === 'FOB',
      freteCIF: data.frete === 'CIF',
      observacoes: data.observacoes || ''
    });
  }

  private setupCheckboxMutualExclusion(): void {
    this.checklistForm.get('clienteFinal')?.valueChanges.subscribe((valor) => {
      const revendaCtrl = this.checklistForm.get('revenda');
      if (valor) {
        revendaCtrl?.disable({ emitEvent: false });
      } else {
        revendaCtrl?.enable({ emitEvent: false });
      }
    });

    this.checklistForm.get('revenda')?.valueChanges.subscribe((valor) => {
      const clienteFinalCtrl = this.checklistForm.get('clienteFinal');
      if (valor) {
        clienteFinalCtrl?.disable({ emitEvent: false });
      } else {
        clienteFinalCtrl?.enable({ emitEvent: false });
      }
    });

    this.checklistForm.get('ICMS_SIM')?.valueChanges.subscribe((valor) => {
      const icmsNaoCtrl = this.checklistForm.get('ICMS_NAO');
      if (valor) {
        icmsNaoCtrl?.disable({ emitEvent: false });
      } else {
        icmsNaoCtrl?.enable({ emitEvent: false });
      }
    });

    this.checklistForm.get('ICMS_NAO')?.valueChanges.subscribe((valor) => {
      const icmsSimCtrl = this.checklistForm.get('ICMS_SIM');
      if (valor) {
        icmsSimCtrl?.disable({ emitEvent: false });
      } else {
        icmsSimCtrl?.enable({ emitEvent: false });
      }
    });

    this.checklistForm.get('pagamentoBoleto')?.valueChanges.subscribe((valor) => {
      const pagamentoDepositoCtrl = this.checklistForm.get('pagamentoDeposito');
      if (valor) {
        pagamentoDepositoCtrl?.disable({ emitEvent: false });
      } else {
        pagamentoDepositoCtrl?.enable({ emitEvent: false });
      }
    });

    this.checklistForm.get('pagamentoDeposito')?.valueChanges.subscribe((valor) => {
      const pagamentoBoletoCtrl = this.checklistForm.get('pagamentoBoleto');
      if (valor) {
        pagamentoBoletoCtrl?.disable({ emitEvent: false });
      } else {
        pagamentoBoletoCtrl?.enable({ emitEvent: false });
      }
    });
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; 
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onSubmit(): void {
    if (this.checklistForm.valid) {
      console.log('Dados do Checklist Salvos:', this.checklistForm.value);
      alert('Dados do checklist salvos com sucesso! Verifique o console.');
    } else {
      alert('Formulário inválido.');
    }
  }
}
