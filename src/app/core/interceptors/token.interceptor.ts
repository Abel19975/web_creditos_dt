import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../auth/auth-store';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthStore).token();
  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  const clonedRequest = req.clone({
    headers: headers,
  });
  return next(clonedRequest);
};
