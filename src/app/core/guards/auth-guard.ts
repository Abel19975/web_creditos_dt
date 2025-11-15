import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../auth/auth-store';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  if (auth.isAuth()) return true;
  return router.createUrlTree(['/auth/inicio-sesion']);
};
