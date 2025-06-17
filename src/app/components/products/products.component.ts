import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { SearchComponent } from "../search/search.component";
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { Product } from '../../models/interfaces/produtos';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  constructor(
    private router: Router,
    private fetchProductsService: FetchProductsService
  ) {}

  products: Product[] = [];
  isLoading: boolean = false;
  isDeleting: boolean = false;

  columns: TableColumn<Product>[] = [
    { header: 'Nome', field: 'name' },
    { header: 'Tipo', field: 'type' },
    { header: 'Valor Unitário', field: 'unitValue', type: 'currency',
      currencyCode: 'BRL',
      currencyDisplay: 'symbol',
      currencyDigitsInfo: '1.2-2',
      currencyLocale: 'pt-BR' },
    { header: 'NCM', field: 'ncm' },
    { header: 'IPI', field: 'ipi' }
  ];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.fetchProductsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
        console.log('Produtos carregados:', this.products);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.isLoading = false;
        alert('Erro ao carregar produtos. Por favor, tente novamente mais tarde.');
      }
    })
  }

  onEdit(product: Product) {
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

  openAddProduct() {
    this.router.navigate(['products/add']);
  }
}