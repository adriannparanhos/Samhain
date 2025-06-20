import { Component, OnInit } from '@angular/core';
import { ReturnArrowComponent } from "../return-arrow/return-arrow.component";
import { Router, ActivatedRoute } from '@angular/router';
import { AddNewFormComponent } from '../add-new-form/add-new-form.component';
import { ButtonFormComponent } from '../button-form/button-form.component';
import { LucideAngularModule } from 'lucide-angular';
import { FieldConfig } from '../add-new-form/add-new-form.component';
import { SendOrcamentoPayloadService } from '../../services/database/send-orcamento-payload.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/interfaces/produtos';
import { FetchProductsService } from '../../services/fetchs/fetch-products.service';
import { ListarProdutosDTOBackend } from '../../models/interfaces/dados-orcamento';

@Component({
  selector: 'app-add-new-product',
  standalone: true,
  imports: [ReturnArrowComponent, AddNewFormComponent, LucideAngularModule, ButtonFormComponent],
  templateUrl: './add-new-product.component.html',
  styleUrl: './add-new-product.component.css'
})
export class AddNewProductComponent implements OnInit {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sendOrcamentoPayloadService: SendOrcamentoPayloadService,
    private fb: FormBuilder,
    private fetchProductsService: FetchProductsService
  ) {}

  form!: FormGroup;
  isEditMode: boolean = false;
  editingProductId: number | null = null;
  pageTitle: string = 'Adicionar Novo Produto';
  isLoading: boolean = false;

  formFields: FieldConfig[] =[
    { name: 'nome do produto', label: 'Nome do Produto', type: 'text', placeholder: 'Produto Exemplo' },
    { name: 'Tipo de produto', label: 'Tipo de Produto', type: 'select', options: [{ label: 'Produto', value: 'produto' }]},
    { name: 'codigo', label: 'Código do Produto', type: 'text', placeholder: '123456' },
    { name: 'Valor unitario', label: 'Valor unitario', type: 'currency', placeholder: 'R$ 0,00' },
    { name: 'NCM', label: 'NCM', type: 'text', placeholder: '1234.56.78' },
    { name: 'IPI', label: 'IPI', type: 'number', placeholder: '6,5' },
    { name: 'descricao', label: 'Descrição', type: 'textarea', placeholder: 'Descrição do produto' }
  ]

  onFormReady(formGroup: FormGroup) {
    console.log("Formulario recebido do component filho")
    this.form = formGroup;

    if (this.isEditMode && this.editingProductId) {
      this.loadProductForEditing(this.editingProductId)
    }
  }

  loadProductForEditing(productId: number) {
    this.isLoading = true;
    this.fetchProductsService.getProducts().subscribe({
      next: (products: ListarProdutosDTOBackend[]) => {
        const productToEdit = products.find(product => product.id === productId);
        if (productToEdit) {
          this.form.patchValue({
            'nome do produto': productToEdit.nome,
            'Tipo de produto': productToEdit.tipo,
            'codigo': productToEdit.id,
            'Valor unitario': `R$ ${productToEdit.valorUnitario.toFixed(2).replace('.', ',')}`,
            'NCM': productToEdit.ncm,
            'IPI': productToEdit.ipi.toString(),
            'descricao': '' // Assuming description is not part of the Product interface
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar produto para edição:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.editingProductId = +id;
        this.pageTitle = 'Editar Produto';
      } else {
        this.isEditMode = false;
        this.editingProductId = null;
        this.pageTitle = 'Adicionar Novo Produto';
      }
    })
    this.form = this.fb.group({})
  }

  onFormSubmit(formData: any) {
    this.form = formData;
    
  }

  returnPage() {
    this.router.navigate(['/products']);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('Formulário inválido:', this.form.value);
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!this.form) {
      console.error('O formulário ainda não está pronto.');
      alert('O formulário não está pronto, por favor aguarde.');
      return;
    }

    const produtoPayload: any = {
      id: this.isEditMode ? this.editingProductId : undefined,
      nome: this.form.value['nome do produto'],
      tipo: this.form.value['Tipo de produto'],
      valorUnitario: parseFloat(this.form.value['Valor unitario'].replace('R$ ', '').replace(',', '.')),
      ncm: this.form.value['NCM'],
      ipi: parseFloat(this.form.value['IPI'])
    }

    const productData = this.form.value;
    console.log('Produto salvo com sucesso!', productData);

    this.fetchProductsService.payloadProducts(produtoPayload).subscribe({
      next: (response) => {
        alert(`Produto ${this.isEditMode ? 'atualizado' : 'salvo'} com sucesso!`);
        this.fetchProductsService.notifyProductSaved(); 
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Erro ao salvar produto:', error);
        alert('Erro ao salvar produto. Por favor, tente novamente.');
      }
    })

    this.router.navigate(['/products']);
  }


}
