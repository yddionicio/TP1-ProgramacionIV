import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'peliculas' },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES) },
  { path: 'peliculas', loadChildren: () => import('./features/movies/movies.routes').then(m => m.MOVIES_ROUTES) },
  { path: '**', redirectTo: 'peliculas' },
];