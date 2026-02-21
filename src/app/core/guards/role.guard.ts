import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para rutas que solo pueden acceder administradores.
 * Verifica que el usuario esté logueado y que `isAdmin()` sea true.
 * Si no cumple, redirige al dashboard con consola de advertencia.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ¡OJO! Usamos paréntesis () porque son Signals computadas
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  console.warn('Acceso denegado: Se requiere admin');
  router.navigate(['/dashboard']);
  return false;
};