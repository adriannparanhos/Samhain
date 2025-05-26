import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CalculateValueStandartService } from '../../services/calculations/calculate-value-standart.service';
import { Subject, combineLatest } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';


interface OrcamentoItem {
  id?: string;
  produto: string;
  modelo: string;
  quantidade: number;
  largura?: number;
  comprimento?: number;
  valorUnitario: number;
  desconto: number;
  ipi?: number;
  ncm: string;
  peso: number;
  categoria: string;

  textClass?: string;
  clienteForneceuDesenho?: boolean;
  adicionarProjeto?: boolean;
  adicionarArruela?: boolean;
  adicionarTampao?: boolean;
  valorDesenho?: number;
  valorProjeto?: number;
  valorArruela?: number;
  valorTampao?: number;
  isPanelVisible?: boolean;
}

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
export class DynamicItemsTableComponent implements OnInit {
  private itemsChanged$ = new Subject<OrcamentoItem[]>();

  // valores globais (descontoGlobal, frete, …) também podem entrar aqui
  private globalsChanged$ = new Subject<{ desconto: number; frete: number; difal: number }>();

  produtos: string[] = [];
  modelosMap: Record<string, string[]> = {};
  ipiMap: Record<string, number> = {};
  valoresPadrao: Record<string, number> = {};
  items: OrcamentoItem[] = [];
  form!: FormGroup;
  descontoGlobal: number = 0;
  valorFrete: number = 0;
  valorDifal: number = 0;
  subtotal = 0;
  grandTotal = 0;
  formValidated: boolean = false;
  formErrors: string[] = [];
  groupedItems: Record<string, OrcamentoItem[]> = {};

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

    this.form.valueChanges.subscribe(() => this.calculateAll());
    this.addItem();
    this.getAllProducts();

    combineLatest([
      this.itemsChanged$.pipe(debounceTime(500)),
      this.globalsChanged$.pipe(debounceTime(500))
    ])
    .pipe(
      switchMap(([items, globals]) => {
        const payload = { itens: items, ...globals };
        return this.calculateValueStandartService.postCalculateValueStandart(payload);
      })
    )
    .subscribe(result => {
      // result deve trazer subtotal, grandTotal e, se quiser,
      // totais individuais por item
      this.subtotal = result.subtotal;
      this.grandTotal = result.grandTotal;
      // …etc.
    });
  }

  private extractType(modelo: string): string {
    if (modelo.includes('BLACK')) return 'BLACK';
    if (modelo.includes('NATURAL')) return 'NATURAL';
    if (modelo.includes('ULTRA')) return 'ULTRA';
    return '';
  }

  private extractThickness(modelo: string): number {
    const match = modelo.match(/#(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getAllProducts() {
    this.fetchProductsService.getProducts().subscribe((data: any[]) => {
      const filteredItems = data
        .map(item => {
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
            valorUnitario: item.valorUnitario,
            desconto: 0,
            categoria: item.categoria,
            espessura: item.espessura,
            peso: item.peso,
            ipi: item.ipi || 1,
            ncm: item.ncm,
          };
        });

      this.groupedItems = filteredItems.reduce((acc, item) => {
        const family = item.produto || 'Outros';
        if (!acc[family]) {
          acc[family] = [];
        }
        acc[family].push(item);
        return acc;
      }, {} as Record<string, OrcamentoItem[]>);

      // for (const family in this.groupedItems) {
      //   this.groupedItems[family].sort((a, b) => {
      //     const typeA = this.extractType(a.categoria);
      //     const typeB = this.extractType(b.categoria);
      //     const thicknessA = this.extractThickness(a.categoria);
      //     const thicknessB = this.extractThickness(b.categoria);
      //     const typeOrder = ['BLACK', 'NATURAL', 'ULTRA'];
      //     const typeIndexA = typeOrder.indexOf(typeA);
      //     const typeIndexB = typeOrder.indexOf(typeB);
      //     if (typeIndexA !== typeIndexB) {
      //       return typeIndexA - typeIndexB;
      //     }
      //     return thicknessA - thicknessB;
      //   });
      // }

      const chapas = this.groupedItems['Chapas semiacabadas'] || [];
      const chapas1220 = chapas.filter(i => i.modelo.includes('1220 x 3050'));
      const chapas1000 = chapas.filter(i => i.modelo.includes('1000 x 3000'));
      this.groupedItems['Chapas semiacabadas'] = [...chapas1220, ...chapas1000];

      if (this.groupedItems['Chapas semiacabadas']) {
        const revestimentos = this.groupedItems['Chapas semiacabadas'].map(item => {
          return {
            ...item,
            familyDescription: 'Revestimento',
            produto: 'Revestimento'
          };
        });
        this.groupedItems['Revestimento'] = revestimentos;
      }

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
      quantidade: 1,
      valorUnitario: 0,
      desconto: 0,
      ncm: '',
      peso: 0,
      categoria: '',
      clienteForneceuDesenho: false,
      adicionarProjeto: false,
      adicionarArruela: false,
      adicionarTampao: false,
      isPanelVisible: false 
    });
    this.formValidated = false;
  }

  togglePanel(index: number): void {
    this.items[index].isPanelVisible = !this.items[index].isPanelVisible;
  }

  onProdutoChange(item: OrcamentoItem): void {
    item.modelo = '';
    item.valorUnitario = 0;

    if (item.produto === 'Peça usinada') {
      item.produto = 'Chapas semiacabadas';
    } else {
      item.produto = item.produto;
    }

    if (item.produto !== 'Peça usinada') {
      item.largura = undefined;
      item.comprimento = undefined;
    }    
  }

  onModeloChange(item: OrcamentoItem): void {
  if (!item.modelo) {
    item.valorUnitario = 0;
    return;
  }

  const produto = item.produto === 'Peça usinada' ? 'Chapas semiacabadas' : item.produto;
  const itemSelecionado = this.groupedItems[produto]?.find(apiItem => apiItem.modelo === item.modelo);
  
  if (itemSelecionado) {
    item.valorUnitario = itemSelecionado.valorUnitario || 0;
    item.ipi = itemSelecionado.ipi || 0;
    item.ncm = itemSelecionado.ncm || '';
    item.peso = itemSelecionado.peso || 0;
    item.categoria = itemSelecionado.categoria || '';
  } else {
    item.valorUnitario = 0;
    item.ipi = 0;
  }
  
  this.onFieldChange();
}

  getModelosForProduto(produto: string): string[] {
    if (produto === 'Peça usinada') {
      return this.modelosMap['Chapas semiacabadas'] || [];
    }
    return this.modelosMap[produto] || [];
  }

  get totalIPI(): number {
    return this.items.reduce((acc, item) => {
      const ipi = this.getIPI(item);
      if (!ipi) return acc;
      const itemTotal = this.calculateTotal(item);
      return acc + (itemTotal * (ipi / 100));
    }, 0);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
      this.onFieldChange();
    }
  }

  getIPI(item: OrcamentoItem): number {
    return item.ipi || this.ipiMap[item.modelo] || 0;
  }

  calculateStandart(payload: any) {
    this.calculateValueStandartService.postCalculateValueStandart(payload).subscribe({
      next: (data) => {
        console.log("data", data)
      },
      error: (err) => {
        alert(err);
      }
    })
  }

  calculateTotal(item: OrcamentoItem): number {
    if (!item.modelo || !item.valorUnitario || !item.quantidade) {
      return 0;
    }
    let total = item.valorUnitario * item.quantidade;
    // if (item.desconto > 0) {
    //   total = total * (1 - (item.desconto / 100));
    // }
    if (item.produto === 'Extratores') {
      // this.calculateStandart()
    }
    return total;
  }

  calculateSubtotal(): number {
    return this.items.reduce((total, item) => {
      return total + this.calculateTotal(item);
    }, 0);
  }

  calculateGrandTotal(): number {
    const subtotal = this.calculateSubtotal();
    let total = subtotal;
    if (this.descontoGlobal > 0) {
      total = total * (1 - (this.descontoGlobal / 100));
    }
    total += this.totalIPI;
    total += this.valorFrete + this.valorDifal;
    return total;
  }

  isItemInvalid(item: OrcamentoItem): boolean {
    if (!this.formValidated) return false;
    if (!item.produto || !item.quantidade || item.quantidade <= 0 ||
      !item.valorUnitario || item.valorUnitario <= 0) {
      return true;
    }
    if (!item.modelo) return true;
    if (item.produto === 'Peça usinada' &&
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

  onFieldChange(): void {
    if (this.formValidated) {
      this.validateForm();
      this.itemsChanged$.next(this.items);
      this.globalsChanged$.next({
        desconto: this.descontoGlobal,
        frete: this.valorFrete,
        difal: this.valorDifal
      });
    }
  }
  
  public getItemsForPayload(): OrcamentoItem[] {
    return this.salvarItens();
  }

  salvarItens(): OrcamentoItem[] {
    if (this.validateForm()) {
      return [...this.items];
    }
    return [];
  }

  calculateAll() {
    this.subtotal = this.calculateSubtotal();
    this.grandTotal = this.calculateGrandTotal();
  }

}