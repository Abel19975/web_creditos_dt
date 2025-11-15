import { Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout';

export default [
  {
    path: '',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirectTo: 'principal',
        pathMatch: 'full',
      },
      {
        path: 'principal',
        loadComponent: () => import('./principal/principal'),
      },
      {
        path: 'empleados',
        loadComponent: () => import('./empleados/empleados'),
      },
      {
        path: 'creditos',
        loadComponent: () => import('./creditos/creditos'),
      },
      {
        path: 'caja',
        loadComponent: () => import('./caja/historial/historial'),
      },
    ],
  },
] as Routes;
