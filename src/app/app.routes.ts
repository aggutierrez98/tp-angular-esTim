import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuygameComponent } from './modules/shop/pages/buygame/buygame.component';
import { GameComponent } from './modules/games/pages/game/game.component';
import { GamesComponent } from './modules/games/pages/games/games.component';

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
    path: 'shop/:id', component: BuygameComponent
},
{
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
},
];
