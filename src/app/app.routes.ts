import { Routes } from '@angular/router';
import { noAuthGuard } from './no-auth.guard';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [{
    path: '',
    loadComponent: () => import('./modules/home/home.component').then(m => m.HomeComponent),
},
{
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
},
{
    path: 'auth/register',
    loadComponent: () => import('./modules/auth/pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [noAuthGuard]
},
{
    path: 'games',
    loadComponent: () => import('./modules/games/pages/games/games.component').then(m => m.GamesComponent),
    canActivate: [AuthGuard],
},
{
    path: 'games/:id',
    loadComponent: () => import('./modules/games/pages/game/game.component').then(m => m.GameComponent),
    canActivate: [AuthGuard],
},
{
    path: 'genres',
    loadComponent: () => import('./modules/genres/pages/genres/genres.component').then(m => m.GenresComponent),
    canActivate: [AuthGuard],
},
{
    path: 'genres/:id',
    loadComponent: () => import('./modules/genres/pages/genre/genre.component').then(m => m.GenreComponent),
    canActivate: [AuthGuard],
},
{
    path: 'shop/:id',
    loadComponent: () => import('./modules/shop/pages/buygame/buygame.component').then(m => m.BuygameComponent),
    canActivate: [AuthGuard],
},
{
    path: 'shop/checkout/:id',
    loadComponent: () => import('./modules/shop/pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [AuthGuard],
},
{
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
},
];
