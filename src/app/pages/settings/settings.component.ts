// src/app/pages/settings/settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // Formulário para informações do perfil
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required], // Email não pode ser alterado
    });

    // Formulário para alteração de senha
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Preenche o formulário com os dados do usuário logado
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Salvando informações do perfil:', this.profileForm.getRawValue());
      // Aqui você chamaria o seu serviço para enviar os dados para o backend
      alert('Informações do perfil salvas com sucesso! (simulação)');
    }
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      // Adicionar lógica de verificação se "nova senha" e "confirmar senha" são iguais
      if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
        alert('A nova senha e a confirmação não correspondem.');
        return;
      }
      console.log('Enviando para alterar a senha:', this.passwordForm.value);
      // Aqui você chamaria o serviço para alterar a senha no backend
      alert('Senha alterada com sucesso! (simulação)');
      this.passwordForm.reset();
    }
  }
}