import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { SearchComponent } from "../search/search.component";
import { TableInfoComponent } from '../table-info/table-info.component';

interface Product {
  id: number;
  name: string;
  type: string;
  unitValue: number;
  ncm: string;
  ipi: string;
}

@Component({
  selector: 'app-products',
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  openModal() {
    alert('Modal opened');
  }
}
