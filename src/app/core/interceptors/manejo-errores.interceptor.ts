import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../auth/auth-service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const authSvc = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const userMessage = extractErrorMessage(error);

      if (error.status !== 401) {
        messageService.add({
          severity: 'error',
          summary: 'Ocurrió un error',
          detail: userMessage,
          life: 5000,
        });
      }

      if (error.status === 401 && !req.url.includes('logout')) {
        authSvc.logout();
      }

      return throwError(() => userMessage);
    }),
  );
};
function extractErrorMessage(error: HttpErrorResponse): string {
  const defaultMessage = 'Ocurrió un error inesperado. Por favor, contacta a soporte.';

  if (error.error) {
    if (typeof error.error === 'object') {
      if (
        error.error.errors &&
        Array.isArray(error.error.errors) &&
        error.error.errors.length > 0
      ) {
        return error.error.errors.map((e: any) => e.msg || e.message).join(', ');
      }
      return error.error.message || error.error.mensaje || error.error.error || defaultMessage;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
  }
  return defaultMessage;
}
