import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { Theme } from './theme';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { errorHandlerInterceptor } from './core/interceptors/manejo-errores.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loaderInterceptor, errorHandlerInterceptor, tokenInterceptor]),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Theme,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    ConfirmationService,
    MessageService,
  ],
};
