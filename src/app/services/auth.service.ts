/* auth.service.ts */
import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulando um usuário logado
  currentUser: User = {
    name: 'Usuário de Teste',
    email: 'usuario@exemplo.com'
  };

  constructor() {}

  logout(): void {
    // Lógica de logout aqui
    console.log('Usuário deslogado');
  }
}