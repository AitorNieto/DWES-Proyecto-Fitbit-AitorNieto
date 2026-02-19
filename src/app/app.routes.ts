import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; 
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home').then(m => m.Home) 
  }, // Check 22: Home Pública (Portada)
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login) 
  }, // Check 23: Login (¡Faltaba esta ruta!)
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  }, // Check 24: Registro
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  }, // Check 25: Dashboard Privado
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(m => m.AdminPanel)
  },
  { 
    path: '404', 
    loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFound) 
  },
  { 
    path: '**', 
    redirectTo: '404'
  } // Check 11 & 28: Comodín
];