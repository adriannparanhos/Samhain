import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { SearchComponent } from "../search/search.component";

@Component({
  selector: 'app-products',
  imports: [ButtonComponent, SearchComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  openModal() {
    alert('Modal opened');
  }
}
