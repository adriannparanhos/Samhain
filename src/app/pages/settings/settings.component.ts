import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthLoginService } from '../../services/auth-login.service'; 
import { LucideAngularModule } from 'lucide-angular';
import { EnvironmentVariablesService } from '../../services/fetchs/environment-variables.service';
import { FormatKeyPipe } from '../../pipes/format-key.pipe';
import { FieldConfig } from '../../components/add-new-form/add-new-form.component';
import { AddNewFormComponent } from '../../components/add-new-form/add-new-form.component';
import { ReturnArrowComponent } from '../../components/return-arrow/return-arrow.component';
import { Router } from '@angular/router';
import { RoleNamePipe } from '../../pipes/role-name.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormatKeyPipe, AddNewFormComponent, ReturnArrowComponent, RoleNamePipe],
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
  isAddingUser = false;
  isEditingUser = false;
  newUserForm!: FormGroup
  
  newUserFormFields: FieldConfig[] = [
    { name: 'nome', label: 'Nome', type: 'text', placeholder: 'ex: Joao Mendes', validators: [Validators.required] },
    { name: 'login', label: 'Login (Nome de Usuário)', type: 'text', placeholder: 'ex: novousuario', validators: [Validators.required] },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'usuario@exemplo.com', validators: [Validators.required, Validators.email] },
    { name: 'password', label: 'Senha Provisória', type: 'password', placeholder: '********', validators: [Validators.required, Validators.minLength(6)] },
    { name: 'role', label: 'Permissão', type: 'select', 
      options: [
        { label: 'Usuário Padrão', value: 'ROLE_USER' },
        { label: 'Administrador', value: 'ROLE_ADMIN' }
      ], 
      validators: [Validators.required] 
    }
  ];

  editingUser: any = null;       
  editUserForm!: FormGroup;
  editUserFormFields: FieldConfig[] = [
    { name: 'email', label: 'Email', type: 'email', validators: [Validators.required, Validators.email] },
    { name: 'role', label: 'Permissão', type: 'select', 
      options: [
        { label: 'Usuário Padrão', value: 'ROLE_USER' },
        { label: 'Administrador', value: 'ROLE_ADMIN' }
      ], 
      validators: [Validators.required] 
    },
    { name: 'novaSenha', label: 'Nova Senha (opcional)', type: 'password', placeholder: '********', validators: [Validators.minLength(6)] }
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
      resin_value: [null, Validators.required],
      rapido: [null, Validators.required],
      medio: [null, Validators.required],
      lento: [null, Validators.required],
      custo_km_caminhao: [null, Validators.required],
      custo_km_carro_proprio: [null, Validators.required],
      custo_diaria_carro_alugado: [null, Validators.required],
      mark_up_transporte: [null, Validators.required],
      mark_up_remocao_revestimento: [null, Validators.required],
      ar_comprimido: [null, Validators.required],
      energia_eletrica: [null, Validators.required],
      arame_de_solda: [null, Validators.required],
      gas_de_solda: [null, Validators.required],
      mark_up_ferramental: [null, Validators.required],
      mark_up_chapa_semiacabadas: [null, Validators.required],
      mark_up_with_tampoes: [null, Validators.required],
    });

    this.editUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
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

  openEditUserForm(userId: number): void {
    this.isEditingUser = true;
  }
  
  cancelAddUser(): void {
    this.isAddingUser = false;
    this.newUserForm.reset(); 
  }

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

    this.authService.createUser(newUserData).subscribe({
      next: (response) => {
        alert(`Usuário '${response.login}' criado com sucesso!`);
        this.isAddingUser = false;
        this.loadAllUsers(); 
      },
      error: (err) => {
        console.error("Erro ao criar usuário", err);
        alert(`Erro: ${err.error.message || 'Não foi possível criar o usuário.'}`);
      }
    });
  }

  onEditUserFormReady(formGroup: FormGroup): void {
    this.editUserForm = formGroup; 

    if (this.editingUser) {
      this.editUserForm.patchValue({
        email: this.editingUser.email,
        role: this.editingUser.role
      });
    }
  }

  editUser(user: any): void {
    this.isAddingUser = false;
    this.isEditingUser = true;
    this.editingUser = user;

  }

  cancelEditUser(): void {
    this.isEditingUser = false; 
    this.editingUser = null;   
    this.editUserForm.reset();  
  }


onUpdateUser(): void {
  if (!this.editingUser || this.editUserForm.invalid) {
    alert('Por favor, preencha os campos corretamente.');
    return;
  }

  const userId = this.editingUser.id;

  const payload = {
    email: this.editUserForm.value.email,
    role: this.editUserForm.value.role,
    senha: this.editUserForm.value.novaSenha || null
  };

  console.log(`Enviando dados atualizados para o usuário ID ${userId}:`, payload);

  this.authService.updateUser(userId, payload).subscribe({
    next: (response) => {
      console.log('Usuário atualizado com sucesso:', response);
      alert(`Usuário atualizado com sucesso!`);
      
      this.cancelEditUser(); 
      this.loadAllUsers();   
    },
    error: (err) => {
      console.error("Erro ao atualizar usuário", err);
      alert(`Erro: ${err.error?.message || 'Não foi possível atualizar o usuário.'}`);
    }
  });
}

  loadAllUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        if (Array.isArray(users) && users.length > 0) {
          this.allUsers = users;
          console.log("Lista de usuários carregada com sucesso:", this.allUsers);
        } else {
          console.warn("Nenhum usuário encontrado ou o formato está incorreto.");
          this.allUsers = [];
        }
      },
      error: (err) => {
        console.error("Erro ao carregar a lista de usuários", err);
        alert("Não foi possível carregar a lista de usuários.");
        this.allUsers = [];
      }
    });
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Salvando novo nome:', this.profileForm.value.name);
      alert('Nome alterado com sucesso! (simulação)');
    }
  }
  
  deleteUser(userId: number): void {
    console.log(`Admin quer deletar o usuário com ID: ${userId}`);
    if (confirm(`Tem certeza que deseja deletar o usuário com ID ${userId}?`)) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          alert('Usuário deletado com sucesso!');
          this.loadAllUsers(); 
        },
        error: (err) => {
          console.error("Erro ao deletar usuário", err);
          alert("Não foi possível deletar o usuário.");
        }
      });
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