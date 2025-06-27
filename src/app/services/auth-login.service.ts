import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  private apiUrl = 'http://localhost:8080/login';
  private url = 'http://localhost:8080/user';
  
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

  public isAdmin(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles && Array.isArray(payload.roles) && payload.roles.includes('ROLE_ADMIN');
      
    } catch (e) {
      console.error('Erro ao verificar permissão de admin no token:', e);
      return false;
    }
  }

  private getUserFromToken(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      let photoUrl = 'assets/images/profiles/bianca.png'

      if (payload.sub === 'adriannpostigo') {
        photoUrl = 'assets/images/profiles/adriann.jpeg'
      } else if (payload.sub === 'bianca') {
        photoUrl = 'assets/images/profiles/bianca.png'
      } 

      return { name: payload.name || payload.sub, email: payload.sub, photoUrl: photoUrl }; 
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      return null;
    }
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.url}/register`, userData);
  }
}