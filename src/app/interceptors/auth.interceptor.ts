import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthLoginService } from '../services/auth-login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthLoginService);
  const authToken = authService.getToken();

  let authReq = req;

  if (authToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 || error.status === 403) {
          console.warn('Sessão expirada ou inválida. Fazendo logout automático.');
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};