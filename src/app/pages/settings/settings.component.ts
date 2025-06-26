import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../services/auth-login.service'; 
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs'; 
import { EnvironmentVariablesService } from '../../services/fetchs/environment-variables.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  lastVariable: any | null = null;
  lastUpdate: Date = new Date(); 
  
  isAdmin = false;
  allUsers: any[] = []; 

  constructor(
    private fb: FormBuilder, 
    private authService: AuthLoginService,
    private environmentVariablesService: EnvironmentVariablesService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('SettingsComponent: Verificando se é admin...');
    this.isAdmin = this.authService.isAdmin();
    
    console.log('Resultado da verificação isAdmin():', this.isAdmin);
    
    if (this.isAdmin) {
      console.log('É admin! Carregando a lista de usuários...');
      this.loadAllUsers();
      this.loadLastVariable();
    } else {
      console.log('Não é admin. A tabela de gerenciamento não será exibida.');
    }
  }

  loadAllUsers(): void {
    const mockUsers = [
      { id: 1, name: 'Admin Principal', email: 'admin@exemplo.com', role: 'ADMIN' },
      { id: 2, name: 'Usuário Comum 1', email: 'user1@exemplo.com', role: 'USER' },
      { id: 3, name: 'Usuário Comum 2', email: 'user2@exemplo.com', role: 'USER' },
    ];
    of(mockUsers).subscribe(users => {
      this.allUsers = users;
    });
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Salvando novo nome:', this.profileForm.value.name);
      alert('Nome alterado com sucesso! (simulação)');
    }
  }

  onPasswordSubmit(): void {
  }
  
  editUser(userId: number): void {
    console.log(`Admin quer editar o usuário com ID: ${userId}`);
    alert(`Simulação de edição do usuário ${userId}`);
  }

  deleteUser(userId: number): void {
    if (confirm(`Tem certeza que deseja excluir o usuário com ID ${userId}?`)) {
      console.log(`Admin quer DELETAR o usuário com ID: ${userId}`);
      alert(`Simulação de exclusão do usuário ${userId}`);
      this.allUsers = this.allUsers.filter(u => u.id !== userId);
    }
  }

  loadLastVariable(): void {
    console.log("Buscando variáveis do sistema do backend...");
    
    this.environmentVariablesService.getVariables().subscribe({
      next: (data) => {
        this.lastVariable = data; 
        console.log("Variáveis carregadas com sucesso:", this.lastVariable);
      },
      error: (err) => {
        console.error("Erro ao carregar as variáveis do sistema", err);
        alert("Não foi possível carregar as variáveis do sistema.");
      }
    });
  }

  editVariables(): void {
    console.log("Admin quer editar as variáveis do sistema.");
    alert('Simulação de edição das variáveis.');
  }
}