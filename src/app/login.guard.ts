import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from './service/usuario-service.service';


export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(UsuarioService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    console.log(222);
    
    return true; // Permite acesso à rota
  } else {
    router.navigate(['/login']); // Redireciona para login
    return false;
  }
};
