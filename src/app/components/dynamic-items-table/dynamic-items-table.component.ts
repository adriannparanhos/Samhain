import { Component, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalculateValueStandartService } from '../../services/calculations/calculate-value-standart.service';
import { Subscription, combineLatest } from 'rxjs';
import { OrcamentoItemNaTabela } from '../../models/orcamento-item';
import { ItemOrcamentoPayload as BackendItemOrcamentoPayload } from '../../models/interfaces/dados-orcamento';
import { SpecialProduct } from '../../services/fetchs/fetch-products.service';

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
  @Input() estadoDoCliente: string | null | undefined = null;
  private subscription: Subscription = new Subscription();
  private productsSubscription: Subscription | undefined;
  taxInformation: string = '1- Impostos incluídos: Selecione um estado para visualizar.';

  produtos: string[] = [];
  modelosMap: Record<string, string[]> = {};
  valoresPadrao: Record<string, number> = {};
  items: OrcamentoItemNaTabela[] = [];
  form!: FormGroup;
  descontoGlobal: number = 0;
  valorFrete: number = 0;
  valorDifal: number = 0;
  pesoTotal: number = 0;
  subtotal: number = 0;
  subtotalCIPI: number = 0;
  grandTotal: number = 0;
  formValidated: boolean = false;
  formErrors: string[] = [];
  standardProductsGrouped: Record<string, OrcamentoItemNaTabela[]> = {};
  specialProductsGrouped: Record<string, SpecialProduct[]> = {};
  standardProductFamilies: string[] = [];
  specialProductFamilies: string[] = [];
  specialProducts: SpecialProduct[] = [];
  private pollingInterval: any;
  private subscriptions = new Subscription();


  allProductsGrouped: Record<string, (OrcamentoItemNaTabela | SpecialProduct)[]> = {};
  productFamilies: string[] = []; 



  constructor(
    private fb: FormBuilder,
    private fetchProductsService: FetchProductsService,
    private calculateValueStandartService: CalculateValueStandartService,
    private cdRef: ChangeDetectorRef
  ) {}

   ngOnInit() {
    this.form = this.fb.group({ });

    const sub1 = this.fetchProductsService.standardProductsGrouped$.subscribe(groupedData => {
      this.standardProductsGrouped = groupedData;
      this.standardProductFamilies = Object.keys(groupedData);
      console.log('PRODUTOS DE CATÁLOGO AGRUPADOS:', this.standardProductsGrouped);
      this.cdRef.detectChanges();
    });

    const sub2 = this.fetchProductsService.specialProductsGrouped$.subscribe(groupedData => {
      this.specialProductsGrouped = groupedData;
      this.specialProductFamilies = Object.keys(groupedData);
      this.cdRef.detectChanges();
    });

    this.subscriptions.add(sub1);
    this.subscriptions.add(sub2);
  
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  addStandardItem(item: OrcamentoItemNaTabela): void {
    this.items.push(item);
    this.calculateItemValue(item); 
  }

  addSpecialItem(product: SpecialProduct): void {
    const newItem: OrcamentoItemNaTabela = {
      produto: product.produto,
      modelo: product.modelo,
      valorUnitario: product.valorUnitario,
      ncm: product.ncm,
      ipi: product.ipi,
      quantidade: 1, 
      desconto: 0,
      total: product.valorUnitario,
      totalCIPI: product.valorUnitario * (1 + (product.ipi / 100)),
      isPanelVisible: false,

      clienteForneceuDesenho: false,
      adicionarProjeto: false,
      adicionarArruela: false,
      adicionarTampao: false,
      valorUnitarioCIPI: product.valorUnitario * (1 + (product.ipi / 100)), 
      peso: 0, 
      categoria: product.produto, 
      espessura: 0,
      pesoTotal: 0,
      quantidadeConjuntos: 1,
    };
    this.items.push(newItem);
    this.updateTotals();
  }

  public setLoadedData(data: { items: BackendItemOrcamentoPayload[], descontoGlobal?: number, valorFrete?: number, valorDifal?: number}): void {
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

        valorUnitarioCIPI: backendItem.valorTotalItemCIPI && backendItem.quantidade ? backendItem.valorTotalItemCIPI / backendItem.quantidade : 0,
        total: backendItem.valorTotalItem || 0,
        totalCIPI: backendItem.valorTotalItemCIPI, 
        largura: backendItem.largura || undefined,
        comprimento: backendItem.comprimento || undefined,

        peso: 0, 
        categoria: '', 
        espessura: 0, 
        isPanelVisible: false,
        pesoTotal: backendItem.pesoItem || 0,
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

    if (item.produto !== 'Peça Usinada') {
      item.largura = undefined;
      item.comprimento = undefined;
    }
  }

  onModeloChange(item: OrcamentoItemNaTabela): void {
    if (!item.modelo || !item.produto) return;

    let selectedItemData = this.standardProductsGrouped[item.produto]?.find(p => p.modelo === item.modelo);

    if (selectedItemData) {
      item.ipi = selectedItemData.ipi ?? 0;
      item.ncm = selectedItemData.ncm || '';
      item.peso = selectedItemData.peso || 0;
      item.categoria = selectedItemData.categoria || '';
      item.espessura = selectedItemData.espessura || 0;
      if (this.shouldCalculateBackend(item)) {
        this.calculateItemValue(item);
      }
      return; 
    }

    const specialItemData = this.specialProductsGrouped[item.produto]?.find(p => p.modelo === item.modelo);
    
    if (specialItemData) {
      item.ipi = specialItemData.ipi ?? 0;
      item.ncm = specialItemData.ncm || '';
      item.valorUnitario = specialItemData.valorUnitario || 0;
      item.quantidade = item.quantidade > 0 ? item.quantidade : 1;
      this.updateTotalsForItem(item); 
    }
  }

  updateTotalsForItem(item: OrcamentoItemNaTabela): void {
    const ipiValue = item.ipi ?? 0;

    const ipiMultiplier = 1 + (ipiValue / 100);
    const discountMultiplier = 1 - ((item.desconto || 0) / 100);
    item.total = item.valorUnitario * item.quantidade * discountMultiplier;
    item.totalCIPI = item.total * ipiMultiplier;
    this.updateTotals(); 
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

        item.valorUnitarioOriginal = response.valorUnitario || 0;
        item.totalOriginal = response.total || 0;
        item.totalCIPIOriginal = response.totalCIPI || 0;

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
      estado: this.estadoDoCliente || 'SP', 
    };
  }

  getModelosForProduto(family: string): string[] {
    if (this.standardProductsGrouped[family]) {
      return this.standardProductsGrouped[family].map(item => item.modelo);
    }
    
    if (this.specialProductsGrouped[family]) {
      return this.specialProductsGrouped[family].map(item => item.modelo);
    }

    return []; 
  }

  removeItem(index: number): void {
    if (this.items.length > 0) {
      this.items.splice(index, 1);
      this.updateTotals();
    }
  }

  public updateTotals(): void {
    this.subtotal = this.items.reduce((acc, item) => acc + (item.total || 0), 0);
    this.subtotalCIPI = this.items.reduce((acc, item) => acc + (item.totalCIPI || 0), 0);
    this.pesoTotal = this.items.reduce((acc, item) => acc + (item.pesoTotal || 0), 0);

    let totalFinal = this.subtotalCIPI;

    if (this.descontoGlobal > 0 && this.descontoGlobal <= 100) {
      const fatorDesconto = 1 - (this.descontoGlobal / 100);
      totalFinal = totalFinal * fatorDesconto;
    }

    totalFinal += (this.valorFrete || 0);
    totalFinal += (this.valorDifal || 0);

    this.grandTotal = totalFinal;
  }

  private aplicarAjustesGlobaisNosItens(): void {
    this.items.forEach(item => {
      item.valorUnitario = item.valorUnitarioOriginal ?? item.valorUnitario;
      item.total = item.totalOriginal ?? item.total;
      item.totalCIPI = item.totalCIPIOriginal ?? item.totalCIPI;
    });
    
    const custoTotalAdicional = (this.valorFrete || 0) + (this.valorDifal || 0);
    const quantidadeTotal = this.items.reduce((acc, item) => acc + (item.quantidade || 0), 0);
    const descontoGlobalMultiplier = (this.descontoGlobal > 0 && this.descontoGlobal <= 100) 
        ? (1 - (this.descontoGlobal / 100)) 
        : 1;

    let custoPorUnidade = 0;
    if (custoTotalAdicional > 0 && quantidadeTotal > 0) {
      custoPorUnidade = custoTotalAdicional / quantidadeTotal;
    }

    this.items.forEach(item => {
      if (item.quantidade > 0 && item.valorUnitarioOriginal != null) {
        
        let valorUnitarioAjustado = item.valorUnitarioOriginal;

        valorUnitarioAjustado *= descontoGlobalMultiplier;

        valorUnitarioAjustado += custoPorUnidade;

        item.valorUnitario = valorUnitarioAjustado;

        const ipiMultiplier = item.ipi || 1;
        const itemDiscountMultiplier = 1 - ((item.desconto || 0) / 100);

        item.total = item.valorUnitario * item.quantidade * itemDiscountMultiplier;
        item.valorUnitarioCIPI = item.valorUnitario * ipiMultiplier;
        item.totalCIPI = item.valorUnitarioCIPI * item.quantidade * itemDiscountMultiplier;
      }
    });

    this.subtotal = this.items.reduce((total, item) => total + (item.total || 0), 0);
    this.subtotalCIPI = this.items.reduce((totalCIPI, item) => totalCIPI + (item.totalCIPI || 0), 0);
  }

  private distribuirCustosAdicionais(): void {
    this.items.forEach(item => {
      item.valorUnitario = item.valorUnitarioOriginal ?? item.valorUnitario;
      item.total = item.totalOriginal ?? item.total;
      item.totalCIPI = item.totalCIPIOriginal ?? item.totalCIPI;
    });
    
    const custoTotalAdicional = (this.valorFrete || 0) + (this.valorDifal || 0);
    const quantidadeTotal = this.items.reduce((acc, item) => acc + (item.quantidade || 0), 0);

    if (custoTotalAdicional > 0 && quantidadeTotal > 0) {
      const custoPorUnidade = custoTotalAdicional / quantidadeTotal;

      this.items.forEach(item => {
        if (item.quantidade > 0) {
          item.valorUnitario += custoPorUnidade;

          const ipiMultiplier = item.ipi || 1;
          const discountMultiplier = 1 - ((item.desconto || 0) / 100);

          item.total = item.valorUnitario * item.quantidade * discountMultiplier;
          
          item.valorUnitarioCIPI = item.valorUnitario * ipiMultiplier;
          item.totalCIPI = item.valorUnitarioCIPI * item.quantidade * discountMultiplier;
        }
      });
    }

    this.subtotal = this.items.reduce((total, item) => total + (item.total || 0), 0);
    this.subtotalCIPI = this.items.reduce((totalCIPI, item) => totalCIPI + (item.totalCIPI || 0), 0);
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
    if (item.desconto > 100) return true;
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