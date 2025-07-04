import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { LucideAngularModule } from 'lucide-angular'; // ✅ Importado

// Definição da interface para um item de serviço, para clareza
export interface ServiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Definição da interface para os dados do orçamento
export interface ServiceBudgetData {
  proposalNumber: string;
  cnpj: string;
  corporateName: string;
  contato: string;
  phone: string;
  email: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  services: ServiceItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentConditions: string;
  proposalValidity: string;
  observations: string[];
}


@Component({
  selector: 'app-service-budget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    LucideAngularModule
  ],
  templateUrl: './service-budget-data.component.html',
  styleUrl: './service-budget-data.component.css'
})
export class ServiceBudgetComponent implements OnInit {

  // Recebe todos os dados do orçamento de um componente pai
  @Input() formData!: ServiceBudgetData;

  pdfForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.pdfForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Exemplo de como você poderia preencher o formulário se necessário,
    // embora para exibição os inputs não sejam estritamente necessários.
    if (this.formData) {
      // Lógica para popular campos de formulário se houver
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  generatePDF(): void {
    // Sua lógica existente para gerar o PDF usando a div #pdfElements
    console.log('Gerando PDF para o Orçamento de Serviço...');
    window.print();
  }
}