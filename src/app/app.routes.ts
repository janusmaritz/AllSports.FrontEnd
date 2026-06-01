import { Routes } from '@angular/router';
import { PlayerList } from './core/features/player-list/player-list';
import { RankingList } from './core/features/ranking-list/ranking-list';
import { SettingsPage } from './core/features/settings-page/settings-page';
import { TournamentList } from './core/features/tournament-list/tournament-list';

export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'players', component: PlayerList },
  { path: 'tournaments', component: TournamentList },
  { path: 'rankings', component: RankingList },
  { path: 'settings', component: SettingsPage },
];
