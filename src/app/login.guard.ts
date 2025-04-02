import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from './service/usuario-service.service';


export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(UsuarioService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']);
    return false;
  }
};
