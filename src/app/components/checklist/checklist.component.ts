import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

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
  @Input() dadosPedido!: PedidoData;

  checklistForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    if (this.dadosPedido) {
      this.preencherFormulario(this.dadosPedido);
    }
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

  onSubmit(): void {
    if (this.checklistForm.valid) {
      console.log('Dados do Checklist Salvos:', this.checklistForm.value);
      alert('Dados do checklist salvos com sucesso! Verifique o console.');
    } else {
      alert('Formulário inválido.');
    }
  }
}
