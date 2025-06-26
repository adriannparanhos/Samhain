import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  private apiUrl = 'http://localhost:8080/login';
  
  private currentUserSubject: BehaviorSubject<any>;

  constructor(private router: Router, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getUserFromToken());
  }

  public get currentUser$(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(credentials: { login: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            this.currentUserSubject.next(this.getUserFromToken());
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
  }

  public isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  public getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private getUserFromToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { name: payload.sub, email: payload.sub }; 
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      return null;
    }
  }
}