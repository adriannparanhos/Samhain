import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  valorTotalOrcamentos: number = 0;
  quantidadeOrcamentos: number = 0;
  quantidadeOrcamentosAprovados: number = 0;
  quantidadeOrcamentosPendentes: number = 0;
  valorTotalAprovado: number = 0;
  quantidadeServicos: number = 0;

  stats = {
    orcamentos: 0,
    servicos: 0,
    produtos: 7,
    valorTotal: 0
  };

  desempenho = {
    aprovados: 0,
    pendentes: 0,
    valorAprovado: 0,
    percentualAprovados: 0,
    percentualPendentes: 0,
    percentualValorAprovado: 0, 
  };

  orcamentosRecentes = [
    {
      proposta: '',
      empresa: '',
      status: '',
      total: 0
    },
    {
      proposta: '',
      empresa: '',
      status: '',
      total: 0
    }
  ];

  constructor(private fetchBudgetsService: FetchBudgetsService, private router: Router) { }

  ngOnInit(): void {
    this.getBudgetsForCurrentMonth(); 
    this.getOrcamentosService();
  }

  private calcularPercentuaisDesempenho(): void {
    const totalOrcamentos = this.quantidadeOrcamentosAprovados + this.desempenho.pendentes;
    
    if (totalOrcamentos > 0) {
      this.desempenho.percentualAprovados = (this.desempenho.aprovados / totalOrcamentos) * 100;
      this.desempenho.percentualPendentes = (this.desempenho.pendentes / totalOrcamentos) * 100;
    }

    const metaValor = 16000000;
    if (metaValor > 0) {
      this.desempenho.percentualValorAprovado = (this.stats.valorTotal / metaValor) * 100;
    }
  }

 private getBudgetsForCurrentMonth(): void {
    this.fetchBudgetsService.getBudgetsForCurrentMonth().subscribe({
      next: (orcamentosDoMes: any[]) => { 
        console.log('Orçamentos do mês recebidos:', orcamentosDoMes);

        this.valorTotalOrcamentos = orcamentosDoMes.reduce((acc, orcamento) => acc + (orcamento.grandTotal || 0), 0);
        this.quantidadeOrcamentos = orcamentosDoMes.length;
        const orcamentosAprovados = orcamentosDoMes.filter(orc => orc.status === 'Aprovado');
        const orcamentosPendentes = orcamentosDoMes.filter(orc => orc.status === 'Pendente');
        this.quantidadeOrcamentosAprovados = orcamentosAprovados.length;
        this.quantidadeOrcamentosPendentes = orcamentosPendentes.length;
        this.valorTotalAprovado = orcamentosAprovados.reduce((acc, orcamento) => acc + (orcamento.grandTotal || 0), 0);
        this.stats.orcamentos = this.quantidadeOrcamentos;
        this.stats.valorTotal = this.valorTotalOrcamentos;
        this.desempenho.aprovados = this.quantidadeOrcamentosAprovados;
        this.desempenho.pendentes = this.quantidadeOrcamentosPendentes;
        this.desempenho.valorAprovado = this.valorTotalAprovado;

        const orcamentosOrdenados = [...orcamentosDoMes].sort((a, b) => {
          const numA = parseInt(a.proposta.split('-')[2], 10);
          const numB = parseInt(b.proposta.split('-')[2], 10);
          return numB - numA;
        });

        this.orcamentosRecentes = orcamentosOrdenados.slice(0, 2).map(orcamento => ({
          proposta: orcamento.proposta,
          empresa: orcamento.razaoSocial,
          status: orcamento.status,
          total: orcamento.grandTotal || 0
        }));


        this.calcularPercentuaisDesempenho();
      },
      error: (error) => {
        console.error('Erro ao buscar orçamentos do mês:', error);
      }
    });
  }

  getOrcamentosService() {
    this.fetchBudgetsService.getAllOrcamentoServicos().subscribe({
      next: (servicos: any[]) => {

        const servicosOrdenados = [...servicos].sort((a, b) => {
          const numA = parseInt(a.cotacao.split('-')[2], 10);
          const numB = parseInt(b.cotacao.split('-')[2], 10);
          return numB - numA; 
        });

        console.log('Todos os orçamentos de serviço recebidos:', servicos);
        this.quantidadeServicos = servicos.length;
        this.stats.servicos = this.quantidadeServicos;

      },
      error: (error) => {
        console.error('Erro ao buscar todos os orçamentos de serviço:', error);
      }
    });
  }

  goToBudgets() {
    this.router.navigate(['/budgets']);
  }
}
