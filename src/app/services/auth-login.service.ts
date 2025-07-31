import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginService {
  private apiLoginUrl = `${environment.apiUrl}/login`;
  private apiUserUrl = `${environment.apiUrl}/user`;
  
  private apiUrl = 'https://v2.calculadora.backend.baron.dev.br/login';
  private url = 'https://v2.calculadora.backend.baron.dev.br/user';

  // private apiUrl = 'http://localhost:8080/login';
  // private url = 'http://localhost:8080/user';


  private currentUserSubject: BehaviorSubject<any>;

  constructor(
    private router: Router, 
    private http: HttpClient,
    private zone: NgZone
  ) {
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
    
    this.zone.run(() => {
      this.router.navigate(['/login']);
    });
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
      let photoUrl = ''

      if (payload.sub === 'adriannpostigo') {
        photoUrl = 'assets/images/profiles/adriann.jpeg'
      } else if (payload.sub === 'bianca') {
        photoUrl = 'assets/images/profiles/bianca.png'
      } else if (payload.sub === 'celia') {
        photoUrl = 'assets/images/profiles/celia.jpeg'
      } else if (payload.sub === 'allan') {
        photoUrl = 'assets/images/profiles/alan.jpeg'
      } else if (payload.sub === 'alex') {
        photoUrl = 'assets/images/profiles/alex.jpeg'
      } else if (payload.sub === 'lucas') {
        photoUrl = 'assets/images/profiles/lucas.jpeg'
      } else if (payload.sub === 'sergio') {
        photoUrl = 'assets/images/profiles/sergio.jpeg'
      } else if (payload.sub === 'ana') {
        photoUrl = 'assets/images/profiles/ana.jpeg'
      }

      return { 
        name: payload.name,  
        email: payload.email, 
        photoUrl: photoUrl 
      }; 
    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      return null;
    }
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.url}/register`, userData);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}`);
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put(`${this.url}/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.url}?id=${userId}`);
  }
}