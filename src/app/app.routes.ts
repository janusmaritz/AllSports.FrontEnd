import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginPage } from './core/features/login-page/login-page';
import { PlayerList } from './core/features/player-list/player-list';
import { RankingList } from './core/features/ranking-list/ranking-list';
import { SettingsPage } from './core/features/settings-page/settings-page';
import { TournamentList } from './core/features/tournament-list/tournament-list';

export const routes: Routes = [
  { path: '', redirectTo: 'players', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'players', component: PlayerList, canActivate: [authGuard] },
  { path: 'tournaments', component: TournamentList, canActivate: [authGuard] },
  { path: 'rankings', component: RankingList, canActivate: [authGuard] },
  { path: 'settings', component: SettingsPage, canActivate: [authGuard] },
];
