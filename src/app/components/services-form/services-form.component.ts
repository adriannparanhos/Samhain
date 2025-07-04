import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { FetchBudgetsService } from '../../services/fetchs/fetch-budgets.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap, filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './services-form.component.html',
})
export class ServicesFormComponent implements OnInit, OnDestroy {
  servicesForm: FormGroup;
  private destroy$ = new Subject<void>(); 

  constructor(private fb: FormBuilder, private fetchBudgetsService: FetchBudgetsService, private router: Router) {
    this.servicesForm = this.fb.group({
      proposalNumber: ['', Validators.required],
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', Validators.required],
      metragem: ['', [Validators.required, Validators.min(1)]],
      installationEfficiency: ['1', Validators.required],
      workingHoursPerDay: ['8', Validators.required],
      numberOfTeams: ['1', Validators.required],
      serviceProvidedByBaron: [false],
      removeOldCoating: [false],
      withPlugs: [false],
      semiFinishedPlatesCoating: [false],
      temporaryLabor: [false],
      baronSafetyTechnician: [false],
      electricity: [true],
      compressedAir: [true],
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
      debounceTime(3000),
      distinctUntilChanged(),
      filter(proposalNumber => proposalNumber && proposalNumber.trim().length > 0),
      switchMap(proposalNumber => {
        return this.fetchBudgetsService.getBudgetByProposta(proposalNumber).pipe(
          catchError(error => {
            console.error('Erro ao buscar orçamento:', error);
            alert('Erro ao buscar orçamento. Verifique o número da proposta e tente novamente.');
            this.clearClientData(); 
            return of(null); 
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe(budget => {
      if (budget) {
        console.log('Orçamento encontrado:', budget);
        const metragemTotal = budget.itens?.reduce((soma, item) => soma + (Number(item.quantidade) || 0), 0) || 0;
        console.log('Metragem total calculada:', metragemTotal);

        this.servicesForm.patchValue({
          cnpj: budget.cnpj,
          razaoSocial: budget.razaoSocial,
          metragem: metragemTotal
        });
      } else {
        alert('Nenhum orçamento encontrado para o número da proposta informado.');
        this.clearClientData();
      }
    });
  }

  private clearClientData(): void {
    this.servicesForm.patchValue({
      cnpj: '',
      razaoSocial: '',
      metragem: ''
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.servicesForm.valid) {
      console.log('Formulário de Serviços Enviado:', this.servicesForm.value);
      alert('Dados do serviço enviados com sucesso! (simulação)');
      this.routeToBudgetData();
    } else {
      console.error('Formulário de Serviços Inválido');
    }
  }

  routeToBudgetData(): void {
    if (this.servicesForm.valid) {
      const formData = this.servicesForm.value;
      this.router.navigate(['/service-budget-data'], { state: { formData } });
    } else {
      alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
    }
    
  }
}