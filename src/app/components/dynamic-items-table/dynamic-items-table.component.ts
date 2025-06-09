import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalculateValueStandartService } from '../../services/calculations/calculate-value-standart.service';
import { Subscription } from 'rxjs';
import { OrcamentoItemNaTabela } from '../../models/orcamento-item';
import { ItemOrcamentoPayload as BackendItemOrcamentoPayload } from '../../models/interfaces/dados-orcamento';

@Component({
  selector: 'app-dynamic-items-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  templateUrl: './dynamic-items-table.component.html',
})
export class DynamicItemsTableComponent implements OnInit, OnDestroy {
  @Input() estadoDoCliente: string | null | undefined = null; // <<< 1. ADICIONE ESTE INPUT
  private subscription: Subscription = new Subscription();
  taxInformation: string = '1- Impostos incluídos: Selecione um estado para visualizar.';

  produtos: string[] = [];
  modelosMap: Record<string, string[]> = {};
  valoresPadrao: Record<string, number> = {};
  items: OrcamentoItemNaTabela[] = [];
  form!: FormGroup;
  descontoGlobal: number = 0;
  valorFrete: number = 0;
  valorDifal: number = 0;
  subtotal: number = 0;
  subtotalCIPI: number = 0;
  grandTotal: number = 0;
  formValidated: boolean = false;
  formErrors: string[] = [];
  groupedItems: Record<string, OrcamentoItemNaTabela[]> = {};

  constructor(
    private fb: FormBuilder,
    private fetchProductsService: FetchProductsService,
    private calculateValueStandartService: CalculateValueStandartService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      globalDiscount: [0, [Validators.min(0), Validators.max(100)]],
      shipping: [0, [Validators.min(0)]],
      difal: [0, [Validators.min(0)]],
    });

    this.form.valueChanges.subscribe(() => this.updateGlobalValues());
    this.addItem();
    this.getAllProducts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public setLoadedData(data: { items: BackendItemOrcamentoPayload[], descontoGlobal?: number, valorFrete?: number, valorDifal?: number }): void {
    this.items = []; 

    data.items.forEach(backendItem => {

      const newItem: OrcamentoItemNaTabela = {
        produto: backendItem.produto,
        modelo: backendItem.modelo,
        quantidade: backendItem.quantidade,
        valorUnitario: backendItem.valorUnitario, 
        desconto: backendItem.desconto || 0,
        ncm: backendItem.ncm,
        ipi: backendItem.aliquota, 
        clienteForneceuDesenho: backendItem.desenho || false,
        adicionarProjeto: backendItem.projeto || false,
        adicionarArruela: backendItem.arruela || false,
        adicionarTampao: backendItem.tampao || false,
        quantidadeConjuntos: backendItem.quantidadeConjuntos || 1,

        valorUnitarioCIPI: backendItem.valorTotalItemCIPI && backendItem.quantidade ? backendItem.valorTotalItemCIPI / backendItem.quantidade : 0, // Estimativa
        total: backendItem.valorTotalItem || 0,
        totalCIPI: backendItem.valorTotalItemCIPI, 
        largura: backendItem.largura || undefined,
        comprimento: backendItem.comprimento || undefined,

        peso: 0, 
        categoria: '', 
        espessura: 0, 
        isPanelVisible: false,
        pesoTotal: 0,
      };
      this.items.push(newItem);
    });

    if (this.form) { 
      this.form.patchValue({
        globalDiscount: data.descontoGlobal || 0,
        shipping: data.valorFrete || 0,
        difal: data.valorDifal || 0
      });
    } else {
      this.descontoGlobal = data.descontoGlobal || 0;
      this.valorFrete = data.valorFrete || 0;
      this.valorDifal = data.valorDifal || 0;
    }


    this.updateTotals(); 
    this.formValidated = false; 
  }

  deveDesabilitarQuantidade(item: any): boolean {
    if (item.produto === 'Peça Usinada') {
      const larguraValida = item.largura && Number(item.largura) > 0;
      const comprimentoValido = item.comprimento && Number(item.comprimento) > 0;
      return !(larguraValida && comprimentoValido);
    }
    return false;
  }

  verificarHabilitacaoQuantidade(item: any): void {
    if (item.produto === 'Peça Usinada') {
      if (this.deveDesabilitarQuantidade(item)) {
      }
    }
    this.onFieldChange(item);
  }

  getAllProducts() {
    this.fetchProductsService.getProducts().subscribe((data: OrcamentoItemNaTabela[]) => {
      const filteredItems = data.map(item => {
        let produto = item.produto || 'Outros';
        if (item.modelo.includes('HASTE')) {
          produto = 'Extratores';
        } else if (item.modelo.includes('PATOLÃO')) {
          produto = 'Patolão';
        }
        return {
          produto: produto,
          modelo: item.modelo,
          quantidade: 1,
          valorUnitario: item.valorUnitario || 0,
          valorUnitarioCIPI: item.valorUnitarioCIPI || 0,
          desconto: 0,
          categoria: item.categoria || '',
          espessura: item.espessura || 0,
          peso: item.peso || 0,
          ipi: item.ipi || 1,
          ncm: item.ncm || '',
          clienteForneceuDesenho: item.clienteForneceuDesenho || false,
          adicionarProjeto: item.adicionarProjeto || false,
          adicionarArruela: item.adicionarArruela || false,
          adicionarTampao: item.adicionarTampao || false,
          isPanelVisible: item.isPanelVisible || false
        };
      });

      this.groupedItems = filteredItems.reduce((acc, item) => {
        const family = item.produto || 'Outros';
        if (!acc[family]) {
          acc[family] = [];
        }
        acc[family].push(item);
        return acc;
      }, {} as Record<string, OrcamentoItemNaTabela[]>);

      const chapas = this.groupedItems['Chapas semiacabadas'] || [];
      const chapas1220 = chapas.filter(i => i.modelo.includes('1220 x 3050'));
      const chapas1000 = chapas.filter(i => i.modelo.includes('1000 x 3000'));
      this.groupedItems['Chapas semiacabadas'] = [...chapas1220, ...chapas1000];

      this.produtos = Object.keys(this.groupedItems);
      this.modelosMap = this.produtos.reduce((acc, family) => {
        acc[family] = this.groupedItems[family].map(item => item.modelo);
        return acc;
      }, {} as Record<string, string[]>);

      this.valoresPadrao = filteredItems.reduce((acc, item) => {
        acc[item.modelo] = item.valorUnitario || 0;
        return acc;
      }, {} as Record<string, number>);
    });
  }

  addItem(): void {
    this.items.push({
      produto: '',
      modelo: '',
      quantidade: 0,
      valorUnitario: 0,
      valorUnitarioCIPI: 0,
      desconto: 0,
      ncm: '',
      peso: 0,
      categoria: '',
      espessura: 0,
      clienteForneceuDesenho: false,
      adicionarProjeto: false,
      adicionarArruela: false,
      adicionarTampao: false,
      isPanelVisible: false,
      total: 0,
      totalCIPI: 0,
      pesoTotal: 0,
      quantidadeConjuntos: 1
    });
    this.formValidated = false;
  }

  togglePanel(index: number): void {
    this.items[index].isPanelVisible = !this.items[index].isPanelVisible;
  }

  onProdutoChange(item: OrcamentoItemNaTabela): void {
    item.modelo = '';
    item.valorUnitario = 0;
    item.total = 0;
    item.totalCIPI = 0;
    item.pesoTotal = 0;

    if (item.produto === 'Peça usinada') {
      item.produto = 'Chapas semiacabadas';
    }

    if (item.produto !== 'Peça usinada') {
      item.largura = undefined;
      item.comprimento = undefined;
    }
  }

  onModeloChange(item: OrcamentoItemNaTabela): void {
    if (!item.modelo) {
      item.valorUnitario = 0;
      item.total = 0;
      item.totalCIPI = 0;
      item.pesoTotal = 0;
      return;
    }

    const produto = item.produto === 'Peça usinada' ? 'Chapas semiacabadas' : item.produto;
    const itemSelecionado = this.groupedItems[produto]?.find(apiItem => apiItem.modelo === item.modelo);

    if (itemSelecionado) {
      item.ipi = itemSelecionado.ipi || 0;
      item.ncm = itemSelecionado.ncm || '';
      item.peso = itemSelecionado.peso || 0;
      item.categoria = itemSelecionado.categoria || '';
      item.espessura = itemSelecionado.espessura || 0;
    } else {
      item.ipi = 0;
      item.ncm = '';
      item.peso = 0;
      item.categoria = '';
      item.espessura = 0;
    }

    if (this.shouldCalculateBackend(item)) {
      this.calculateItemValue(item);
    }
  }

  onFieldChange(item: OrcamentoItemNaTabela): void {
    if (this.shouldCalculateBackend(item)) {
      this.calculateItemValue(item);
    }
  }

  private shouldCalculateBackend(item: OrcamentoItemNaTabela): boolean {
    return !!(item.produto && item.modelo && item.quantidade && item.quantidade > 0);
  }

  private calculateItemValue(item: OrcamentoItemNaTabela): void {
    const payload = this.createPayloadForItem(item);

    this.calculateValueStandartService.postCalculateValueStandart(payload).subscribe({
      next: (response) => {
        console.log('Frontend: Recebido do cálculo no backend:', response); 

        item.valorUnitario = response.valorUnitario || 0;
        item.valorUnitarioCIPI = response.valorUnitarioCIPI || 0;
        item.total = response.total || 0;
        item.totalCIPI = response.totalCIPI || 0;
        item.pesoTotal = response.pesoTotal || 0;

        this.updateTotals();
        console.log('Valores calculados:', response);
      },
      error: (err) => {
        console.error('Erro ao calcular valores:', err);
        this.formErrors.push(`Erro ao calcular item: ${err.error?.errorMessage || 'Verifique os dados e tente novamente.'}`);
      }
    });
  }

  private createPayloadForItem(item: OrcamentoItemNaTabela): any {
    return {
      produto: item.produto || '',
      modelo: item.modelo || '',
      quantidade: item.quantidade || 0,
      largura: item.largura || 0,
      comprimento: item.comprimento || 0,
      desconto: item.desconto || 0,
      desenho: item.clienteForneceuDesenho || false,
      arruela: item.adicionarArruela || false,
      tampao: item.adicionarTampao || false,
      projeto: item.adicionarProjeto || false,
      quantidadeConjuntos: item.quantidadeConjuntos || 1,
      estado: this.estadoDoCliente || 'SP', // Use o estado do cliente se disponível
    };
  }

  getModelosForProduto(produto: string): string[] {
    if (produto === 'Peça usinada') {
      return this.modelosMap['Chapas semiacabadas'] || [];
    }
    return this.modelosMap[produto] || [];
  }

  removeItem(index: number): void {
    if (this.items.length > 0) {
      this.items.splice(index, 1);
      this.updateTotals();
    }
  }

  public updateTotals(): void {
    this.subtotal = this.items.reduce((total, item) => total + (item.total || 0), 0);
    this.subtotalCIPI = this.items.reduce((totalCIPI, item) => totalCIPI + (item.totalCIPI || 0), 0);
    let grandTotal = this.subtotalCIPI;
    if (this.descontoGlobal > 0) {
      grandTotal = grandTotal * (1 - (this.descontoGlobal / 100));
    }
    grandTotal += this.valorFrete + this.valorDifal;
    this.grandTotal = grandTotal;
  }

  private updateGlobalValues(): void {
    this.descontoGlobal = this.form.get('globalDiscount')?.value || 0;
    this.valorFrete = this.form.get('shipping')?.value || 0;
    this.valorDifal = this.form.get('difal')?.value || 0;
    this.updateTotals();
  }

  isItemInvalid(item: OrcamentoItemNaTabela): boolean {
    if (!this.formValidated) return false;
    if (!item.produto || !item.modelo || !item.quantidade || item.quantidade <= 0) {
      return true;
    }
    if (item.produto === 'Peça Usinada' &&
        (!item.largura || item.largura <= 0 || !item.comprimento || item.comprimento <= 0)) {
      return true;
    }
    if (item.desconto < 0 || item.desconto > 100) return true;
    return false;
  }

  validateForm(): boolean {
    this.formValidated = true;
    this.formErrors = [];
    if (this.items.length === 0) {
      this.formErrors.push('Adicione pelo menos um item ao orçamento.');
      return false;
    }
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (this.isItemInvalid(item)) {
        this.formErrors.push(`O item ${i + 1} contém informações inválidas.`);
      }
    }
    if (this.descontoGlobal < 0 || this.descontoGlobal > 100) {
      this.formErrors.push('O desconto global deve estar entre 0% e 100%.');
    }
    if (this.valorFrete < 0) {
      this.formErrors.push('O valor do frete não pode ser negativo.');
    }
    if (this.valorDifal < 0) {
      this.formErrors.push('O valor do DIFAL não pode ser negativo.');
    }
    return this.formErrors.length === 0;
  }

  public getItemsForPayload(): OrcamentoItemNaTabela[] {
    return this.salvarItens();
  }

  salvarItens(): OrcamentoItemNaTabela[] {
    if (this.validateForm()) {
      return [...this.items];
    }
    return [];
  }

}