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
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFound)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: '**', 
    loadComponent: () => import('./shared/components/not-found/not-found').then(m => m.NotFound) 
  }
];