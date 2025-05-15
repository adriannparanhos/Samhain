import { Component } from '@angular/core';
import { ReturnArrowComponent } from "../return-arrow/return-arrow.component";
import { Router } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { ButtonFormComponent } from '../button-form/button-form.component';
import { LucideAngularModule } from 'lucide-angular';
import { FieldConfig } from '../add-new-form/add-new-form.component';


@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule, ButtonFormComponent],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.css'
})
export class AddNewProductComponent {
  constructor(private router: Router) {}

  formFields: FieldConfig[] =[
    { name: 'nome do produto', label: 'Nome do Produto', type: 'text', placeholder: 'Produto Exemplo' },
    { name: 'Tipo de produto', label: 'Tipo de Produto', type: 'select', options: [{ label: 'Produto', value: 'produto' }]},
    { name: 'codigo', label: 'Código do Produto', type: 'text', placeholder: '123456' },
    { name: 'Valor unitario', label: 'Valor unitario', type: 'currency', placeholder: 'R$ 0,00' },
    { name: 'NCM', label: 'NCM', type: 'text', placeholder: '1234.56.78' },
    { name: 'IPI', label: 'IPI', type: 'number', placeholder: '6,5' },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do produto' }
  ]

  onFormSubmit(formData: any) {
    console.log('Form Data:', formData); 
  }

  returnPage() {
    this.router.navigate(['enterprises']);
  }


}
