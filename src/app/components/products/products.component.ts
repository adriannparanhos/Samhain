import { Component, OnInit, OnDestroy } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { SearchComponent } from "../search/search.component";
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { Product } from '../../models/interfaces/produtos';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';
import { ListarProdutosDTOBackend } from '../../models/interfaces/dados-orcamento';
import { Subscription } from 'rxjs'; 

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private fetchProductsService: FetchProductsService
  ) {}

  products: Product[] = [];
  isLoading: boolean = false;
  isDeleting: boolean = false;
  private productSavedSubscription!: Subscription;


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
    this.productSavedSubscription = this.fetchProductsService.productSaved$.subscribe(() => {
      console.log('Notificação recebida! Recarregando lista de produtos...');
      this.loadProducts();
    });
  }

  ngOnDestroy() {
    if (this.productSavedSubscription) {
      this.productSavedSubscription.unsubscribe();
    }
  }

  loadProducts() {
    this.isLoading = true;
    this.fetchProductsService.getProducts().subscribe({
      next: (data: ListarProdutosDTOBackend[]) => {
        this.products = data.map(listarProdutosDTOBackend => {
          return {
            id: listarProdutosDTOBackend.id,
            name: listarProdutosDTOBackend.modelo,         
            type: listarProdutosDTOBackend.produto,         
            unitValue: listarProdutosDTOBackend.valorUnitario, 
            ncm: listarProdutosDTOBackend.ncm,
            ipi: listarProdutosDTOBackend.ipi
          };
        });
        this.isLoading = false;
        console.log('Produtos carregados e mapeados:', this.products);
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
    this.router.navigate(['products/edit', product.id]);
  }

  onDelete(product: Product) {
    if (!confirm(`Excluir ${product.name}?`)) return;
    this.isDeleting = true;
    
    this.fetchProductsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.loadProducts(); 
        alert(`Produto ${product.name} excluído com sucesso.`);
      },
      error: (err) => {
        console.error('Erro ao excluir produto:', err);
        this.isDeleting = false;
        alert('Erro ao excluir produto. Por favor, tente novamente mais tarde.');
      }
    })
  }

  openAddProduct() {
    this.router.navigate(['products/add']);
  }
}