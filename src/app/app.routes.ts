import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard'; 
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard], // Check 10: Solo admin entra aquí
    data: { role: 'admin' },
    loadComponent: () => import('./features/admin/admin-panel/admin-panel').then(m => m.AdminPanel) // O una ruta de gestión
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: '404', 
    loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFound) 
  },
  { 
    path: '**', // Check 11 & 28: Cualquier ruta inexistente
    redirectTo: '404'
  }
];