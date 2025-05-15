import { Component } from '@angular/core';
import { ReturnArrowComponent } from "../return-arrow/return-arrow.component";
import { Router } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { FieldConfig } from '../add-new-form/add-new-form.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-add-new-enterprise',
  standalone: true,
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule],
  templateUrl: './add-new-enterprise.component.html',
  styleUrl: './add-new-enterprise.component.css'
})
export class AddNewEnterpriseComponent {
  constructor(private router: Router) {}

  formFields: FieldConfig[] = [
    { name: 'razaoSocial', label: 'Razão Social', type: 'text', placeholder: 'Nome da Empresa Ltda' },
    { name: 'CNPJ', label: 'CNPJ', type: 'text', placeholder: '00.000.000/000-00' },
    { name: 'Telefone', label: 'Telefone', type: 'text', placeholder: '(00) 0000-0000' },
    { name: 'Email', label: 'Email', type: 'email', placeholder: 'empresa@exemplo.com' }
  ]

  formFieldsEndereco: FieldConfig[] = [
    { name: 'Rua', label: 'Rua', type: 'text', placeholder: 'Rua Exemplo' },
    { name: 'numero', label: 'Número', type: 'text', placeholder: '123' },
    { name: 'complemento', label: 'Complemento', type: 'text', placeholder: 'Apto 456' },
    { name: 'cep', label: 'CEP', type: 'text', placeholder: '00000-000' },
    { name: 'estado', label: 'Estado', type: 'text', placeholder: 'SP' },
    { name: 'cidade', label: 'Cidade', type: 'text', placeholder: 'São Paulo' },
    { name: 'bairro', label: 'Bairro', type: 'text', placeholder: 'Centro' }
  ]

  onFormSubmit(formData: any) {
    console.log('Form Data:', formData);
  }

  returnPage() {
    this.router.navigate(['enterprises']);
  }

}
