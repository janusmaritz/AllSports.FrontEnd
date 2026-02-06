import { Routes } from '@angular/router';
import { PlayerList } from './core/features/player-list/player-list';

export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayerList },
];