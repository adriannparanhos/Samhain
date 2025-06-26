import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthLoginService } from '../../services/auth-login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthLoginService, 
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      login: ['adriannpostigo', [Validators.required]], 
      password: ['123456', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Comunicação com o backend bem-sucedida!');
        console.log('Token recebido:', response.token); 

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro na comunicação com o backend:', err);
        this.errorMessage = 'Login ou senha inválidos, ou erro no servidor.';
      }
    })

   
  }
}