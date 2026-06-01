import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Target as TargetIcon, Search as SearchIcon, Music2 as Music2Icon } from 'lucide-angular';
import { DartsService } from '../../services/darts.service';
import { PlayerProfile } from '../../models/player-profile.model';

@Component({
  selector: 'app-player-list',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  standalone: true,
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList implements OnInit {
  private dartsService = inject(DartsService);
  readonly targetIcon = TargetIcon;
  readonly searchIcon = SearchIcon;
  readonly music2Icon = Music2Icon;

  readonly allPlayers = signal<PlayerProfile[]>([]);

  readonly searchTerm = signal('');

  readonly selectedBrand = signal('');

  readonly brands: string[] = [
    'Winmau', 'Target', 'Red Dragon', 'Unicorn',
    'Harrows', 'Shot', 'Loxley', 'Mission', 'Bull'
  ];

  readonly filteredPlayers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedBrand = this.selectedBrand().toLowerCase();

    return this.allPlayers().filter(player => {
      const fullName = player.fullName?.toLowerCase() ?? '';
      const nickname = player.nickname?.toLowerCase() ?? '';
      const dartsUsed = player.dartsUsed?.toLowerCase() ?? '';

      const matchesSearch =
        term === '' ||
        fullName.includes(term) ||
        nickname.includes(term);

      const matchesBrand =
        selectedBrand === '' ||
        dartsUsed.includes(selectedBrand);

      return matchesSearch && matchesBrand;
    });
  });

  ngOnInit() {
    this.dartsService.getPlayers().subscribe({
      next: (data) => {
        this.allPlayers.set(Array.isArray(data) ? data : []);
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
