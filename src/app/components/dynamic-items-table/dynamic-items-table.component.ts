import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
}

@Component({
  selector: 'app-dynamic-items-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-items-table.component.html',
})
export class DynamicItemsTableComponent {
  produtos: string[] = ['Peça usinada', 'Perfil de alumínio', 'Acessório', 'Kit montagem'];
  modelosMap: Record<string, string[]> = {
    'Peça usinada': ['Suporte', 'Base', 'Fixador', 'Personalizado'],
    'Perfil de alumínio': ['30x30', '40x40', '45x45', '20x40', '20x20'],
    'Acessório': ['Parafuso', 'Porca', 'Cantoneira', 'Tampão'],
    'Kit montagem': ['Básico', 'Premium', 'Completo']
  };
  
  ipiMap: Record<string, number> = {
    'Peça usinada': 5,
    'Perfil de alumínio': 10,
    'Acessório': 8,
    'Kit montagem': 12
  };
  
  valoresPadrao: Record<string, number> = {
    'Perfil de alumínio': 45.99,
    'Acessório': 12.50,
    'Kit montagem': 89.90
  };
  
  items: OrcamentoItem[] = [];
  
  descontoGlobal: number = 0;
  valorFrete: number = 0;
  valorDifal: number = 0;
  
  formValidated: boolean = false;
  formErrors: string[] = [];
  
  get totalIPI(): number {
    return this.items.reduce((acc, item) => {
      const ipi = this.getIPI(item);
      if (!ipi) return acc;
      
      const itemTotal = this.calculateTotal(item);
      return acc + (itemTotal * (ipi / 100));
    }, 0);
  }
  
  constructor() { }

  ngOnInit(): void {
    this.addItem();
  }
  
  addItem(): void {
    this.items.push({
      produto: '',
      modelo: '',
      quantidade: 1,
      valorUnitario: 0,
      desconto: 0
    });
    this.formValidated = false;
  }
  
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
      this.onFieldChange();
    }
  }
  
  getModelosForProduto(produto: string): string[] {
    return this.modelosMap[produto] || [];
  }
  
  onProdutoChange(item: OrcamentoItem): void {
    item.modelo = '';
    item.ipi = this.ipiMap[item.produto] || 0;
    
    if (this.valoresPadrao[item.produto]) {
      item.valorUnitario = this.valoresPadrao[item.produto];
    }
    
    if (item.produto !== 'Peça usinada') {
      item.largura = undefined;
      item.comprimento = undefined;
    }
  }
  
  getIPI(item: OrcamentoItem): number {
    return item.ipi || this.ipiMap[item.produto] || 0;
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
}