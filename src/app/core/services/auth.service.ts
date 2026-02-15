import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // REEMPLAZA ESTO con tu Client ID de 6 caracteres del portal de Fitbit
  private readonly CLIENT_ID = '23V23C'; 
  private readonly REDIRECT_URI = 'http://localhost:4200/dashboard';

  private _currentUser = signal<User | null>(this.getUserFromStorage());

  public isLoggedIn = computed(() => !!this._currentUser());
  public isAdmin = computed(() => this._currentUser()?.role === 'admin');
  public currentUser = this._currentUser.asReadonly();

  loginFitbit(): void {
    const scope = encodeURIComponent('activity profile heartrate sleep');
    const url = `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${this.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=${scope}&expires_in=3600`;
    window.location.href = url;
  }

  // Compatibilidad con componentes de Login/Register
  login(credentials: any): Observable<boolean> {
    this.loginFitbit();
    return of(true);
  }

  register(user: User): Observable<boolean> {
    this.loginFitbit();
    return of(true);
  }

  handleAuthentication(): void {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      const userId = params.get('user_id');

      if (token) {
        // Guardamos como 'token' para el Check de JWT
        localStorage.setItem('token', token); 
        
        // Obtener el nombre guardado en el formulario (login o register)
        const savedUserName = localStorage.getItem('userName') || 'Usuario';
        const savedEmail = localStorage.getItem('userEmail') || 'user@fitbit.com';
        
        const user: User = { 
          email: savedEmail, 
          name: savedUserName, 
          role: 'user',
          id: userId || ''
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        this._currentUser.set(user);
        
        // Limpiamos el hash de la URL para que quede bonita
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }

  logout(): void {
    // Guardar los datos de registro y actividades antes de limpiar
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    const activities = localStorage.getItem('activities');
    
    localStorage.clear();
    
    // Restaurar los datos de registro
    if (userName) localStorage.setItem('userName', userName);
    if (userEmail) localStorage.setItem('userEmail', userEmail);
    if (userPassword) localStorage.setItem('userPassword', userPassword);
    if (activities) localStorage.setItem('activities', activities);
    localStorage.setItem('isRegistered', 'true');
    
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
}