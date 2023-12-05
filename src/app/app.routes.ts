import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuygameComponent } from './modules/shop/pages/buygame/buygame.component';
import { GameComponent } from './modules/games/pages/game/game.component';
import { GamesComponent } from './modules/games/pages/games/games.component';
import { GenresComponent } from './modules/genres/pages/genres/genres.component';
import { GenreComponent } from './modules/genres/pages/genre/genre.component';

export const routes: Routes = [{
    path: '', component: HomeComponent
},
{
    path: 'games', component: GamesComponent
},
{
    path: 'games/:id', component: GameComponent
},
{
    path: 'genres', component: GenresComponent
},
{
    path: 'genres/:id', component: GenreComponent
},
{
    path: 'shop/:id', component: BuygameComponent
},
{
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
},
];
