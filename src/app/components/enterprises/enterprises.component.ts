import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { SearchComponent } from '../search/search.component';
import { TableColumn, TableInfoComponent } from '../table-info/table-info.component';
import { Router } from '@angular/router';
import { FetchEnterpriseService } from '../../services/fetchs/fetch-enterprise.service';

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

  pageSize = 10;
  currentPage = 1;
  totalPages = 1;

  constructor(
    private router: Router,
    private fetchEnterpriseService: FetchEnterpriseService
  ) {}

  ngOnInit() {
    this.loadEnterprises();
  }

  private loadEnterprises() {
    this.fetchEnterpriseService.getEnterprises().subscribe(
      data => {
        this.enterprises = data.map(e => ({
          id: +e.cnpj.replace(/\D/g,''),  
          razaoSocial: e.corporateName,
          CNPJ: e.cnpj,
          CidadeUF: `${e.address.cidade}/${e.address.estado}`
        }));
        this.setupPagination();
      },
      err => console.error(err)
    );
  }

  private setupPagination() {
    this.totalPages = Math.ceil(this.enterprises.length / this.pageSize);
    this.currentPage = 1;
    this.updatePaged();
  }

  private updatePaged() {
    const start = (this.currentPage) * this.pageSize;
    this.pagedEnterprises = this.enterprises.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePaged();
  }

  onEdit(ent: Enterprise) { this.router.navigate(['enterprises', ent.id, 'edit']); }

  onDelete(ent: Enterprise) {
    if (!confirm(`Excluir ${ent.razaoSocial}?`)) return;
  }

  openAddEnterprise() { this.router.navigate(['enterprises/add']); }
}
