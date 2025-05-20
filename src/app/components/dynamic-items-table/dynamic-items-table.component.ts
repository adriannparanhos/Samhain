import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';

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
  familyDescription: string;
  code: string;
  description: string;
  textClass?: string;

  adicionalDesenho?: boolean;
  adicionalProjeto?: boolean;
  adicionalArruela?: boolean;
  adicionalTampao?: boolean;
  
  valorDesenho?: number;
  valorProjeto?: number;
  valorArruela?: number;
  valorTampao?: number;
}

@Component({
  selector: 'app-dynamic-items-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './dynamic-items-table.component.html',
})
export class DynamicItemsTableComponent implements OnInit {
  produtos: string[] = [];
  modelosMap: Record<string, string[]> = {};
  ipiMap: Record<string, number> = {};
  valoresPadrao: Record<string, number> = {};
  items: OrcamentoItem[] = [];
  form!: FormGroup;
  isSidebarOpen: boolean = false;
  selectedItem: any = null;
  groupedItems: Record<string, OrcamentoItem[]> = {};

  descontoGlobal: number = 0;
  valorFrete: number = 0;
  valorDifal: number = 0;
  subtotal = 0;
  grandTotal = 0;

  formValidated: boolean = false;
  formErrors: string[] = [];

  constructor(private fb: FormBuilder, private fetchProductsService: FetchProductsService) {}

  ngOnInit() {
    this.form = this.fb.group({
      globalDiscount: [0, [Validators.min(0), Validators.max(100)]],
      shipping: [0, [Validators.min(0)]],
      difal: [0, [Validators.min(0)]],
    });

    this.form.valueChanges.subscribe(() => this.calculateAll());
    this.addItem();
    this.getAllProducts();
  }

  private extractType(description: string): string {
    if (description.includes('BLACK')) return 'BLACK';
    if (description.includes('NATURAL')) return 'NATURAL';
    if (description.includes('ULTRA')) return 'ULTRA';
    return '';
  }

  private extractThickness(description: string): number {
    const match = description.match(/#(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  getAllProducts() {
    this.fetchProductsService.getProducts().subscribe((data: any[]) => {
      const filteredItems = data
        .filter(item => item.model.toUpperCase().includes('DURAMAXX'))
        .map(item => {
          let familyDescription = item.familyDescription || 'Outros';
          
          if (item.description.includes('HASTE')) {
            familyDescription = 'Extratores';
          } else if (item.description.includes('PATOLÃO')) {
            familyDescription = 'Patolão';
          }
          
          return {
            produto: familyDescription,
            modelo: item.description,
            quantidade: 1,
            valorUnitario: 0,
            desconto: 0,
            familyDescription,
            code: item.code,
            description: item.description,
          };
        });

      this.groupedItems = filteredItems.reduce((acc, item) => {
        const family = item.familyDescription || 'Outros';
        if (!acc[family]) {
          acc[family] = [];
        }
        acc[family].push(item);
        return acc;
      }, {} as Record<string, OrcamentoItem[]>);

      for (const family in this.groupedItems) {
        this.groupedItems[family].sort((a, b) => {
          const typeA = this.extractType(a.description);
          const typeB = this.extractType(b.description);
          const thicknessA = this.extractThickness(a.description);
          const thicknessB = this.extractThickness(b.description);

          const typeOrder = ['BLACK', 'NATURAL', 'ULTRA'];
          const typeIndexA = typeOrder.indexOf(typeA);
          const typeIndexB = typeOrder.indexOf(typeB);
          if (typeIndexA !== typeIndexB) {
            return typeIndexA - typeIndexB;
          }

          return thicknessA - thicknessB;
        });
      }

      const chapas = this.groupedItems['Chapas semiacabadas'] || [];
      const chapas1220 = chapas.filter(i => i.description.includes('1220 x 3050'));
      const chapas1000 = chapas.filter(i => i.description.includes('1000 x 3000'));
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
        acc[family] = this.groupedItems[family].map(item => item.description);
        return acc;
      }, {} as Record<string, string[]>);

      this.valoresPadrao = filteredItems.reduce((acc, item) => {
        acc[item.description] = item.valorUnitario || 0;
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
      familyDescription: '',
      code: '',
      description: ''
    });
    this.formValidated = false;
  }

  onProdutoChange(item: OrcamentoItem): void {
    item.modelo = '';
    if (item.produto === 'Peças Usinadas') {
      item.familyDescription = 'Chapas semiacabadas';
    } else {
      item.familyDescription = item.produto;
    }
    item.ipi = this.ipiMap[item.modelo] || 0;

    if (this.valoresPadrao[item.modelo]) {
      item.valorUnitario = this.valoresPadrao[item.modelo];
    }

    if (item.produto !== 'Peça usinada') {
      item.largura = undefined;
      item.comprimento = undefined;
    }
  }

  getModelosForProduto(produto: string): string[] {
    if (produto === 'Peças Usinadas') {
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

  calculateTotal(item: OrcamentoItem): number {
    if (!item.produto || !item.valorUnitario || !item.quantidade) {
      return 0;
    }
    let total = item.valorUnitario * item.quantidade;
    if (item.desconto > 0) {
      total = total * (1 - (item.desconto / 100));
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
    }
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

  openSidebar(item: OrcamentoItem) {
    this.selectedItem = item;
    this.isSidebarOpen = true;
  }
}