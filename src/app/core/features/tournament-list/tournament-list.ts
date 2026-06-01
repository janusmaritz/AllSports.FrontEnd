import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search as SearchIcon, Trophy as TrophyIcon } from 'lucide-angular';

interface Tournament {
  name: string;
  location: string;
  format: string;
  status: string;
  champion: string;
}

@Component({
  selector: 'app-tournament-list',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  standalone: true,
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.scss',
})
export class TournamentList {
  readonly trophyIcon = TrophyIcon;
  readonly searchIcon = SearchIcon;

  readonly tournaments = signal<Tournament[]>([]);
  readonly searchTerm = signal('');
  readonly selectedStatus = signal('');

  readonly statuses = ['Upcoming', 'Live', 'Completed'];

  readonly filteredTournaments = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedStatus = this.selectedStatus().toLowerCase();

    return this.tournaments().filter(tournament => {
      const matchesSearch =
        term === '' ||
        tournament.name.toLowerCase().includes(term) ||
        tournament.location.toLowerCase().includes(term);

      const matchesStatus =
        selectedStatus === '' ||
        tournament.status.toLowerCase() === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  });
}
