import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

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

  /**
   * Maneja el retorno de Fitbit y asigna roles dinámicos (Check 10)
   */
  handleAuthentication(): void {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      const userId = params.get('user_id');

      if (token) {
        localStorage.setItem('token', token); 
        
        // Recuperamos lo que el usuario escribió en el Register
        const savedUserName = localStorage.getItem('userName') || 'Usuario';
        const savedEmail = localStorage.getItem('userEmail') || 'user@fitbit.com';
        
        // --- LÓGICA DE ROLES DINÁMICA ---
        // Si el email incluye la palabra 'admin', se le asigna rol admin.
        // Esto permite probar diferentes correos y obtener diferentes roles.
        const userRole = savedEmail.toLowerCase().includes('admin') ? 'admin' : 'user';

        const user: User = { 
          email: savedEmail, 
          name: savedUserName, 
          role: userRole,
          id: userId || ''
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        this._currentUser.set(user);
        
        // Limpiamos la URL y navegamos
        window.history.replaceState({}, document.title, window.location.pathname);
        this.router.navigate(['/dashboard']);
      }
    }
  }

  logout(): void {
    // Guardamos datos básicos para no romper el flujo local de la práctica
    const backup = {
      name: localStorage.getItem('userName'),
      email: localStorage.getItem('userEmail'),
      pass: localStorage.getItem('userPassword'),
      acts: localStorage.getItem('activities')
    };
    
    localStorage.clear();
    
    if (backup.name) localStorage.setItem('userName', backup.name);
    if (backup.email) localStorage.setItem('userEmail', backup.email);
    if (backup.pass) localStorage.setItem('userPassword', backup.pass);
    if (backup.acts) localStorage.setItem('activities', backup.acts);
    localStorage.setItem('isRegistered', 'true');
    
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    try { return user ? JSON.parse(user) : null; } 
    catch { return null; }
  }
}