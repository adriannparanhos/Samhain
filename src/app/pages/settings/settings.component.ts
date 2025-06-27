import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../services/auth-login.service'; 
import { LucideAngularModule } from 'lucide-angular';
import { of } from 'rxjs'; 
import { EnvironmentVariablesService } from '../../services/fetchs/environment-variables.service';
import { FormatKeyPipe } from '../../pipes/format-key.pipe';
import { FieldConfig } from '../../components/add-new-form/add-new-form.component';
import { AddNewFormComponent } from '../../components/add-new-form/add-new-form.component';
import { ReturnArrowComponent } from '../../components/return-arrow/return-arrow.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormatKeyPipe, AddNewFormComponent, ReturnArrowComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  variablesForm!: FormGroup;

  lastVariable: any | null = null;
  lastUpdate: Date = new Date(); 
  
  isAdmin = false;
  allUsers: any[] = []; 
  isEditingVariables: boolean = false;
  isVisualize: boolean = true;

  isAddingUser = false; // Controla a visibilidade do formulário
  newUserForm!: FormGroup

  newUserFormFields: FieldConfig[] = [
    { name: 'login', label: 'Login (Nome de Usuário)', type: 'text', placeholder: 'ex: adriann', validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'usuario@exemplo.com', validators: [Validators.required, Validators.email] },
    { name: 'senha', label: 'Senha Provisória', type: 'password', placeholder: '********', validators: [Validators.required, Validators.minLength(6)] },
    { name: 'role', label: 'Permissão', type: 'select', 
      options: [
        { label: 'Usuário Padrão', value: 'ROLE_USER' },
        { label: 'Administrador', value: 'ROLE_ADMIN' }
      ], 
      validators: [Validators.required] 
    }
  ];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthLoginService,
    private environmentVariablesService: EnvironmentVariablesService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.variablesForm = this.fb.group({
      valorHoraUsinagem: [null, Validators.required],
      rebarbacao: [null, Validators.required],
      valorUnitarioDesenho: [null, Validators.required],
      markUpRevestimento: [null, Validators.required],
      descontoUm: [null, Validators.required],
      descontoDois: [null, Validators.required],
      descontoTres: [null, Validators.required],
      descontoQuatro: [null, Validators.required],
      mark_up_frete: [null, Validators.required],
      mark_up_black: [null, Validators.required],
      mark_up_natural: [null, Validators.required],
      mark_up_ultra: [null, Validators.required],
      resinValue: [null, Validators.required]
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

  openAddUserForm(): void {
    this.isAddingUser = true;
  }
  
  cancelAddUser(): void {
    this.isAddingUser = false;
    this.newUserForm.reset(); // Limpa o formulário ao cancelar
  }

  // Recebe o FormGroup do componente filho <app-add-new-form>
  onNewUserFormReady(formGroup: FormGroup): void {
    this.newUserForm = formGroup;
  }

  onSaveNewUser(): void {
    if (this.newUserForm.invalid) {
      alert('Por favor, preencha todos os campos para criar o novo usuário.');
      return;
    }

    const newUserData = this.newUserForm.value;
    console.log("Enviando novo usuário para o backend:", newUserData);

    // SIMULAÇÃO: No futuro, você chamaria seu serviço aqui
    // this.userService.createUser(newUserData).subscribe({ ... });

    alert(`Usuário '${newUserData.login}' criado com sucesso! (simulação)`);
    
    // Após o sucesso, esconde o formulário e recarrega a lista de usuários
    this.isAddingUser = false;
    this.loadAllUsers(); // Recarrega a tabela de usuários
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
    if (confirm(`Tem certeza que deseja excluir o usuário ${userId}?`)) {
      console.log(`Admin quer DELETAR o usuário com ID: ${userId}`);
      alert(`Simulação de exclusão do usuário ${userId}`);
      this.allUsers = this.allUsers.filter(u => u.id !== userId);
    }
  }

  loadLastVariable(): void {
    console.log("Buscando variáveis do sistema do backend...");
    
    this.environmentVariablesService.getVariables().subscribe({
      next: (data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          this.lastVariable = data[data.length - 1]; 
          console.log("Variáveis carregadas com sucesso:", this.lastVariable);
        } else {
          console.warn("Nenhum dado de variável foi retornado pelo backend ou o formato está incorreto.");
          this.lastVariable = null;
        }
      },
      error: (err) => {
        console.error("Erro ao carregar as variáveis do sistema", err);
        alert("Não foi possível carregar as variáveis do sistema.");
      }
    });
    this.isVisualize = true;
  }

  editVariables(): void {
    if (!this.lastVariable) return;

    this.variablesForm.patchValue(this.lastVariable);
    this.isEditingVariables = true;
    this.isVisualize = false;
  }

  cancelEditVariables(): void {
    this.isEditingVariables = false;
    this.isVisualize = true
  }

  onSaveVariables(): void {
    if (this.variablesForm.invalid) {
      alert('Por favor, preencha todos os campos de variáveis obrigatórios.');
      return;
    }

    const updatedVariables = this.variablesForm.value;
    console.log("Enviando novas variáveis para o backend:", updatedVariables);

    this.environmentVariablesService.sendVariables(updatedVariables).subscribe({
      next: (savedData) => {
        this.lastVariable = savedData;
        alert('Variáveis salvas com sucesso!');
        this.isEditingVariables = false;
        this.loadLastVariable();
      },
      error: (err) => {
        console.error("Erro ao salvar as variáveis", err);
        alert("Ocorreu um erro ao salvar as variáveis.");
      }
    });
  }

  get variableKeys(): string[] {
    return Object.keys(this.variablesForm.controls);
  }

  returnPage() {
    this.router.navigate(['budgets']);
  }

}