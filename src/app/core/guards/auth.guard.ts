import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que se utiliza en rutas que requieren autenticación.
 *
 * - Si la URL contiene un `access_token` lo procesa antes de comprobar el
 *   estado de login (caso retorno de OAuth).
 * - Comprueba `authService.isLoggedIn()` y permite o redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Si detectamos el token en la URL, lo procesamos ANTES de comprobar el login
  if (window.location.hash.includes('access_token')) {
    authService.handleAuthentication();
  }

  // 2. Si ahora estamos logueados, permitimos el paso
  if (authService.isLoggedIn()) {
    return true;
  }

  // 3. Si no, mandamos al login
  console.warn('Acceso denegado: Redirigiendo a Login');
  return router.createUrlTree(['/login']);
};