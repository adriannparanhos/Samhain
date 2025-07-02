import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthLoginService } from '../services/auth-login.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthLoginService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false; 
  }

  return true;
};