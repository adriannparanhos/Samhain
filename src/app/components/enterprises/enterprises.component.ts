import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchEnterpriseService } from '../../services/fetchs/fetch-enterprise.service';
import { CommonModule } from '@angular/common';
import { CpfCnpjMaskDirective } from '../../directive/cpf-cnpj-mask.directive';

interface Enterprise {
  id: number;
  razaoSocial: string;
  CNPJ: string;
  CidadeUF: string;
}

@Component({
  selector: 'app-enterprises',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent, CommonModule, CpfCnpjMaskDirective],
  templateUrl: './enterprises.component.html',
  styleUrls: ['./enterprises.component.css']
})
export class EnterprisesComponent implements OnInit {
  isDeleting: boolean = false;
  enterprises: Enterprise[] = [];
  pagedEnterprises: Enterprise[] = [];

  columns: TableColumn<Enterprise>[] = [
    { header: 'Razão Social', field: 'razaoSocial' },
    { header: 'CNPJ',         field: 'CNPJ' },
    { header: 'Cidade/UF',    field: 'CidadeUF' }
  ];

  searchTerm: string = '';
  currentPage = 0; 
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private fetchEnterpriseService: FetchEnterpriseService
  ) {}

  ngOnInit() {
    this.loadEnterprises();
  }

   private loadEnterprises() {
    this.isLoading = true; 
    
    this.fetchEnterpriseService.getEnterprises(
      this.currentPage,
      this.pageSize,
      this.searchTerm
    ).subscribe({
      next: (page) => {
        
        this.pagedEnterprises = page.content.map(e => {
          
          const razaoSocial = e?.corporateName || 'Razão social inválida';
          const cnpj = e?.cnpj || 'CNPJ inválido';
          const cidadeUF = e?.address ? `${e.address.cidade}/${e.address.estado}` : 'Localidade inválida';

          return {
            id: e?.cnpj ? +e.cnpj.replace(/\D/g, '') : 0,
            
            razaoSocial: razaoSocial,
            CNPJ: cnpj,
            CidadeUF: cidadeUF
          };
        });

        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar empresas:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.currentPage = 0;
    this.loadEnterprises();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadEnterprises();
  }

  onEdit(ent: Enterprise) { this.router.navigate(['enterprises', ent.id, 'edit']); }

  onDelete(ent: Enterprise) {
    if (!confirm(`Excluir ${ent.razaoSocial}?`)) return;
  }

  openAddEnterprise() { this.router.navigate(['enterprises/add']); }
}
