import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartColumn as ChartColumnIcon, LucideAngularModule, Search as SearchIcon } from 'lucide-angular';
import { DartsRanking } from '../../models/darts-ranking.model';
import { DartsService } from '../../services/darts.service';

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
export class RankingList implements OnInit {
  private dartsService = inject(DartsService);

  readonly chartColumnIcon = ChartColumnIcon;
  readonly searchIcon = SearchIcon;

  readonly rankings = signal<DartsRanking[]>([]);
  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly searchTerm = signal('');
  readonly selectedSourceUrl = signal('');

  readonly sourceUrls = computed(() => {
    return Array.from(
      new Set(this.rankings().map(ranking => ranking.sourceUrl).filter(Boolean))
    );
  });

  readonly filteredRankings = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const selectedSourceUrl = this.selectedSourceUrl();

    return this.rankings().filter(ranking => {
      const rank = ranking.rank.toString();
      const playerName = ranking.playerName?.toLowerCase() ?? '';
      const sourceUrl = ranking.sourceUrl ?? '';
      const moneyAmount = ranking.moneyAmount.toString();

      const matchesSearch =
        term === '' ||
        rank.includes(term) ||
        playerName.includes(term) ||
        moneyAmount.includes(term);

      const matchesSource =
        selectedSourceUrl === '' ||
        sourceUrl === selectedSourceUrl;

      return matchesSearch && matchesSource;
    });
  });

  ngOnInit(): void {
    this.dartsService.getRankings().subscribe({
      next: (data) => {
        this.rankings.set(Array.isArray(data) ? data : []);
        this.hasLoadError.set(false);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading rankings:', err);
        this.rankings.set([]);
        this.hasLoadError.set(true);
        this.isLoading.set(false);
      }
    });
  }
}
