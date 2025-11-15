import { Routes } from '@angular/router';

export default [
  {
    path: 'inicio-sesion',
    loadComponent: () => import('./inicio-sesion/inicio-sesion'),
  },
] as Routes;
