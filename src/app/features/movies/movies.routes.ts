import { Routes } from '@angular/router';

export const MOVIES_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
 // { path: ':id', loadComponent: () => import('./movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
];