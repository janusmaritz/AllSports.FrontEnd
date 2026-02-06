import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerList } from "./core/features/player-list/player-list";
import { SidebarComponent } from './core/components/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerList, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AllSportsUI');
}
