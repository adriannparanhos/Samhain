import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-services-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './services-form.component.html',
})
export class ServicesFormComponent implements OnInit {
  servicesForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.servicesForm = this.fb.group({
      proposalNumber: ['', Validators.required],
      cnpj: ['', [Validators.required]],
      razaoSocial: ['', Validators.required],
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

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.servicesForm.valid) {
      console.log('Formulário de Serviços Enviado:', this.servicesForm.value);
      alert('Dados do serviço enviados com sucesso! (simulação)');
    } else {
      console.error('Formulário de Serviços Inválido');
    }
  }
}