import { Component, ViewChild } from '@angular/core'; 
import { Router } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { FieldConfig } from '../add-new-form/add-new-form.component';
import { FetchEnterpriseService } from '../../services/fetchs/fetch-enterprise.service';
import { ReturnArrowComponent } from "../return-arrow/return-arrow.component";
import { LucideAngularModule } from 'lucide-angular';
import { ButtonFormComponent } from "../button-form/button-form.component";

@Component({
  selector: 'app-add-new-enterprise',
  standalone: true,
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule, ButtonFormComponent],
  templateUrl: './add-new-enterprise.component.html',
  styleUrl: './add-new-enterprise.component.css'
})
export class AddNewEnterpriseComponent {
  @ViewChild('enterpriseForm') enterpriseFormComponent!: AddNewFormComponent;
  @ViewChild('addressForm') addressFormComponent!: AddNewFormComponent;

  constructor(private router: Router, private fetchEnterpriseService: FetchEnterpriseService) {}

  formFields: FieldConfig[] = [
    { name: 'razaoSocial', label: 'Razão Social', type: 'text', placeholder: 'Nome da Empresa Ltda' },
    { name: 'cnpj', label: 'CNPJ', type: 'text', placeholder: '00.000.000/000-00' }, 
    { name: 'telefone', label: 'Telefone', type: 'text', placeholder: '(00) 0000-0000' }, 
    { name: 'email', label: 'Email', type: 'email', placeholder: 'empresa@exemplo.com' } 
  ];

  formFieldsEndereco: FieldConfig[] = [
    { name: 'rua', label: 'Rua', type: 'text', placeholder: 'Rua Exemplo' }, 
    { name: 'numero', label: 'Número', type: 'text', placeholder: '123' },
    { name: 'complemento', label: 'Complemento', type: 'text', placeholder: 'Apto 456' },
    { name: 'cep', label: 'CEP', type: 'text', placeholder: '00000-000' },
    { name: 'estado', label: 'Estado', type: 'text', placeholder: 'SP' },
    { name: 'cidade', label: 'Cidade', type: 'text', placeholder: 'São Paulo' },
    { name: 'bairro', label: 'Bairro', type: 'text', placeholder: 'Centro' }
  ];

  onSave() {
    const enterpriseData = this.enterpriseFormComponent.getFormValue();
    const addressData = this.addressFormComponent.getFormValue();

    if (!enterpriseData || !addressData) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const payload = {
      corporateName: enterpriseData.razaoSocial, 
      cnpj: enterpriseData.cnpj,
      phone: enterpriseData.telefone,            
      email: enterpriseData.email,
      stateRegistration: '', 
      address: {
        endereco: addressData.rua,            
        endereco_numero: addressData.numero,         
        bairro: addressData.bairro,   
        cep: addressData.cep,
        estado: addressData.estado,          
        cidade: addressData.cidade        
      }
    };

    console.log('Enviando payload corrigido para o backend:', payload);

    this.fetchEnterpriseService.addEnterprise(payload).subscribe({
      next: (res) => {
        console.log('Empresa cadastrada com sucesso:', res);
        alert('Empresa cadastrada com sucesso!');
        this.router.navigate(['enterprises']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar empresa:', err);
        alert('Ocorreu um erro ao cadastrar a empresa. Verifique o console.');
      }
    });
  }

  returnPage() {
    this.router.navigate(['enterprises']);
  }
}