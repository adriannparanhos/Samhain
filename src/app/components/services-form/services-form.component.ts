import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, filter, catchError } from 'rxjs/operators';
import { DadosNovoServicoService } from '../../services/datas/dados-novo-servico.service';
import { ServiceBudgetData } from '../../models/interfaces/dados-orcamento';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './services-form.component.html',
})
export class ServicesFormComponent implements OnInit, OnDestroy {
  servicesForm: FormGroup;
  private destroy$ = new Subject<void>();
  private originalBudget: any = null; 

  constructor(
    private fb: FormBuilder,
    private fetchBudgetsService: FetchBudgetsService,
    private router: Router,
    private dadosNovoServicoService: DadosNovoServicoService
  ) {
    this.servicesForm = this.fb.group({
      proposalNumber: ['', Validators.required],
      cnpj: [{ value: '', disabled: false }, Validators.required],
      razaoSocial: [{ value: '', disabled: false }, Validators.required],
      contato: [''],
      telefone: [''], 
      email: [''],    
      metragem: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
      endereco: [''],
      enderecoNumero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      installationEfficiency: ['1', Validators.required],
      workingHoursPerDay: ['8', Validators.required],
      numberOfTeams: ['1', Validators.required],
      serviceProvidedByBaron: [false],
      removeOldCoating: [false],
      withPlugs: [false],
      semiFinishedPlatesCoating: [false],
      temporaryLabor: [false],
      baronSafetyTechnician: [false],
      electricity: [false],
      compressedAir: [false],
      weldingWire: [false],
      maintenanceShutdown: [false],
      installationLocation: ['', Validators.required],
      coatedArea: ['', Validators.required],
      integrationDays: ['', Validators.required],
      equipmentDescription: ['']
    });
  }

  ngOnInit(): void {
    this.setupProposalNumberSearch();
  }

  private setupProposalNumberSearch(): void {
    this.servicesForm.get('proposalNumber')?.valueChanges.pipe(
      debounceTime(1500),
      distinctUntilChanged(),
      filter(proposalNumber => !!proposalNumber),
      switchMap(proposalNumber =>
        this.fetchBudgetsService.getBudgetByProposta(proposalNumber).pipe(
          catchError(error => {
            console.error('Erro ao buscar orçamento:', error);
            this.clearClientData();
            return of(null);
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(budget => {
      if (budget) {
        this.originalBudget = budget; 
        const metragemTotal = budget.itens?.reduce((soma, item) => soma + (Number(item.quantidade) || 0), 0) || 0;
        
        this.servicesForm.patchValue({
          cnpj: budget.cnpj,
          razaoSocial: budget.razaoSocial,
          contato: budget.nomeContato,
          telefone: budget.telefoneContato, 
          email: budget.emailContato,       
          metragem: metragemTotal,
          endereco: budget.endereco,
          enderecoNumero: budget.enderecoNumero,
          bairro: budget.bairro,
          cidade: budget.cidade,
          estado: budget.estado,
          cep: budget.cep
        });
      } else {
        this.clearClientData();
      }
    });
  }

  private clearClientData(): void {
    this.originalBudget = null; 
    this.servicesForm.patchValue({
      cnpj: '',
      razaoSocial: '',
      contato: '',
      telefone: '',
      email: '',
      metragem: ''
    });
  }


onSubmit(): void {
  if (this.servicesForm.invalid) {
    this.servicesForm.markAllAsTouched();
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const formValue = this.servicesForm.getRawValue();
  const efficiencyMap: { [key: string]: string } = { '1': 'rapido', '2': 'medio', '3': 'lento' };

  const finalPayload = {
    cotacao: `${crypto.randomUUID()} - ${formValue.proposalNumber || 'TESTE'}`,
    numeroProposta: formValue.proposalNumber,
    cnpj: formValue.cnpj,
    razaoSocial: formValue.razaoSocial,
    metragem: Number(formValue.metragem),
    eficienciaInstalacao: efficiencyMap[formValue.installationEfficiency] || 'medio',
    horasTrabalhadasPorDia: parseInt(formValue.workingHoursPerDay, 10),
    numeroDeTimes: parseInt(formValue.numberOfTeams, 10),
    servicoRealizadoNaBaron: formValue.serviceProvidedByBaron,
    remocaoRevestimentoAntigo: formValue.removeOldCoating,
    comTampoes: formValue.withPlugs,
    comChapasSemiAcabadas: formValue.semiFinishedPlatesCoating,
    maoDeObraTemporaria: formValue.temporaryLabor,
    tecnicoSegurancaBaron: formValue.baronSafetyTechnician,
    eletricidadeFornecida: formValue.electricity,
    arComprimidoFornecido: formValue.compressedAir,
    starGoldFornecido: formValue.weldingWire, 
    paradaParaManutencaoGeral: formValue.maintenanceShutdown,
    areaRevestida: Number(formValue.coatedArea),
    diasIntegracao: Number(formValue.integrationDays),
    descricaoEquipamento: formValue.equipmentDescription,
    distanciaEmKm: Number(formValue.installationLocation)
  };

  this.fetchBudgetsService.gerarOrcamentoDeServico(finalPayload).pipe(
    takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        alert('Orçamento de serviço gerado com sucesso!');

        const servicoCompleto: ServiceBudgetData = {
          proposalNumber: formValue.proposalNumber,
          cnpj: formValue.cnpj,
          razaoSocial: formValue.razaoSocial,
          equipmentDescription: formValue.equipmentDescription,
          coatedArea: Number(formValue.coatedArea),
          serviceProvidedByBaron: formValue.serviceProvidedByBaron,
          removeOldCoating: formValue.removeOldCoating,
          withPlugs: formValue.withPlugs,
          semiFinishedPlatesCoating: formValue.semiFinishedPlatesCoating,
          temporaryLabor: formValue.temporaryLabor,
          baronSafetyTechnician: formValue.baronSafetyTechnician,
          electricity: formValue.electricity,
          compressedAir: formValue.compressedAir,
          starGoldFornecido: formValue.weldingWire,
          maintenanceShutdown: formValue.maintenanceShutdown,

          nomeContato: formValue.contato,
          telefoneContato: formValue.telefone,
          email: formValue.email,
          endereco: formValue.endereco,
          enderecoNumero: formValue.enderecoNumero,
          cidade: formValue.cidade,
          bairro: formValue.bairro,
          estado: formValue.estado,
          cep: formValue.cep,
        
          vendedorResponsavel: this.originalBudget?.vendedorResponsavel || 'Vendas Internas',
          paymentConditions: this.originalBudget?.condicaoPagamento || 'A combinar',
          proposalValidity: this.originalBudget?.validadeProposta || '30 dias',

          totalAPagar: response.totalAPagar,
          diasPrevistoParaTermino: response.diasPrevistoParaTermino,
          resultadoRendimentoInstalacao: response.resultadoRendimentoInstalacao
        };

        this.dadosNovoServicoService.setServico(servicoCompleto);
        this.router.navigate(['/service-budget-data']);
      },
      error: (error) => {
        console.error('Erro ao gerar o orçamento de serviço:', error);
        alert('Ocorreu um erro ao gerar o orçamento. Tente novamente.');
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
