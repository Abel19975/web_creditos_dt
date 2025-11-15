import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from '../../shared/services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const loaderSvc = inject(LoaderService);

  let activeRequest = 0;

  if (router.url !== '/auth/inicio-sesion') {
    loaderSvc.present();
  }
  activeRequest++;

  return next(req).pipe(
    finalize(() => {
      activeRequest--;
      if (activeRequest === 0) {
        loaderSvc.close();
      }
    }),
  );
};
