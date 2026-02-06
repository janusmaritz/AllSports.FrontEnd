import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlayerList } from "./core/features/player-list/player-list";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PlayerList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AllSportsUI');
}
