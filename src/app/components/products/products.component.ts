import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { SearchComponent } from "../search/search.component";
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';

interface Product {
  id: number;
  name: string;
  type: string;
  unitValue: number;
  ncm: string;
  ipi: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isDeleting: boolean = false;

  columns: TableColumn<Product>[] = [
    { header: 'Nome', field: 'name' },
    { header: 'Tipo', field: 'type' },
    { header: 'Valor Unitário', field: 'unitValue', type: 'currency' },
    { header: 'NCM', field: 'ncm' },
    { header: 'IPI', field: 'ipi' }
  ];

  ngOnInit() {
    // simula fetch
    this.products = [
      { id: 1, name: 'Parafuso', type: 'A', unitValue: 2.50, ncm: '1234.56.78', ipi: 5 },
      { id: 2, name: 'Porca', type: 'B', unitValue: 1.25, ncm: '4321.65.87', ipi: 3 },
      { id: 3, name: 'Arruela', type: 'A', unitValue: 0.75, ncm: '9876.54.32', ipi: 2 }
    ];
  }

  onEdit(product: Product) {
    // redirecionar, abrir modal etc.
    console.log('editar', product);
  }

  onDelete(product: Product) {
    if (!confirm(`Excluir ${product.name}?`)) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.products = this.products.filter(p => p.id !== product.id);
      this.isDeleting = false;
    }, 500);
  }

  openModal() {
    alert('Modal opened');
  }
}