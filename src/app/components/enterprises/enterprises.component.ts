import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';

interface Enterprise {
  id: number;
  razaoSocial: string;
  CNPJ: string;
  CidadeUF: string;
}

@Component({
  selector: 'app-enterprises',
  standalone: true,
  imports: [ButtonComponent, SearchComponent, TableInfoComponent],
  templateUrl: './enterprises.component.html',
  styleUrl: './enterprises.component.css'
})
export class EnterprisesComponent {

  constructor(private router: Router) {}

  enterprises: Enterprise[] = [];
  isDeleting: boolean = false;

  columns: TableColumn<Enterprise>[] = [
    { header: 'Razão Social', field: 'razaoSocial' },
    { header: 'CNPJ', field: 'CNPJ' },
    { header: 'Cidade/UF', field: 'CidadeUF' }
  ];

  ngOnInit() {
    this.enterprises = [
      { id: 1, razaoSocial: 'Empresa A', CNPJ: '12.345.678/0001-90', CidadeUF: 'São Paulo/SP' },
      { id: 2, razaoSocial: 'Empresa B', CNPJ: '98.765.432/0001-01', CidadeUF: 'Rio de Janeiro/RJ' },
      { id: 3, razaoSocial: 'Empresa C', CNPJ: '11.222.333/0001-02', CidadeUF: 'Belo Horizonte/MG' }
    ];
  }

  onEdit(enterprise: Enterprise) {
    console.log('editar', enterprise);
  }

  onDelete(enterprise: Enterprise) {
    if (!confirm(`Excluir ${enterprise.razaoSocial}?`)) return;
    this.isDeleting = true;
    setTimeout(() => {
      this.enterprises = this.enterprises.filter(e => e.id !== enterprise.id);
      this.isDeleting = false;
    }, 500);
  }

  openAddEnterprise() {
    this.router.navigate(['enterprises/add']);
  }
}
