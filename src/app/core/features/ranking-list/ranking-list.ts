import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartColumn as ChartColumnIcon, LucideAngularModule, Search as SearchIcon } from 'lucide-angular';

interface Ranking {
  position: number;
  player: string;
  country: string;
  points: number;
  movement: string;
}

@Component({
  selector: 'app-ranking-list',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  standalone: true,
  templateUrl: './ranking-list.html',
  styleUrl: './ranking-list.scss',
})
export class RankingList {
  readonly chartColumnIcon = ChartColumnIcon;
  readonly searchIcon = SearchIcon;

  readonly rankings = signal<Ranking[]>([]);
  readonly searchTerm = signal('');
  readonly selectedMovement = signal('');

  readonly movements = ['Up', 'Down', 'Unchanged'];

  readonly filteredRankings = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedMovement = this.selectedMovement().toLowerCase();

    return this.rankings().filter(ranking => {
      const matchesSearch =
        term === '' ||
        ranking.player.toLowerCase().includes(term) ||
        ranking.country.toLowerCase().includes(term);

      const matchesMovement =
        selectedMovement === '' ||
        ranking.movement.toLowerCase() === selectedMovement;

      return matchesSearch && matchesMovement;
    });
  });
}
