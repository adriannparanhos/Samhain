import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User = {
    name: 'Usuário de Teste',
    email: 'usuario@exemplo.com'
  };

  constructor() {}

  logout(): void {
    console.log('Usuário deslogado');
  }
}