import { Routes } from '@angular/router';

export const COMPRA_ROUTES: Routes = [
  {
    path: ':peliculaId/funciones',
    loadComponent: () => import('./seleccion-funcion/seleccion-funcion.component').then(m => m.SeleccionFuncionComponent),
  },
  {
    path: ':funcionId/butacas',
    loadComponent: () => import('./mapa-butacas/mapa-butacas.component').then(m => m.MapaButacasComponent),
  },
  {
    path: ':funcionId/candy',
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent),
  },
  {
    path: 'confirmacion/:compraId',
    loadComponent: () => import('./confirmacion/confirmacion.component').then(m => m.ConfirmacionComponent),
  },
];