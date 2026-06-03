import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ChartColumn, LucideAngularModule, Search } from 'lucide-angular';
import { catchError, combineLatest, debounceTime, of, switchMap } from 'rxjs';
import { DartsRanking } from '../../models/darts-ranking.model';
import { PagedResult } from '../../models/paged-result.model';
import { DartsService, RankingQuery } from '../../services/darts.service';

const EMPTY_RESULT: PagedResult<DartsRanking> = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

@Component({
  selector: 'app-ranking-list',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  standalone: true,
  templateUrl: './ranking-list.html',
  styleUrl: './ranking-list.scss',
})
export class RankingList {
  readonly #dartsService = inject(DartsService);
  readonly #destroyRef = inject(DestroyRef);

  readonly chartColumnIcon = ChartColumn;
  readonly searchIcon = Search;

  readonly searchTerm = signal('');
  readonly minRank = signal<number | null>(null);
  readonly maxRank = signal<number | null>(null);
  readonly page = signal(1);
  readonly pageSize = signal(20);
  readonly sortBy = signal('');
  readonly sortDescending = signal(false);

  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly result = signal<PagedResult<DartsRanking>>(EMPTY_RESULT);

  constructor() {
    combineLatest([
      toObservable(this.searchTerm).pipe(debounceTime(300)),
      toObservable(this.minRank).pipe(debounceTime(300)),
      toObservable(this.maxRank).pipe(debounceTime(300)),
      toObservable(this.page),
      toObservable(this.pageSize),
      toObservable(this.sortBy),
      toObservable(this.sortDescending),
    ])
      .pipe(
        debounceTime(10),
        switchMap(([playerName, minRank, maxRank, page, pageSize, sortBy, sortDescending]) => {
          this.isLoading.set(true);
          const query: RankingQuery = { page, pageSize };
          if (playerName.trim()) query.playerName = playerName.trim();
          if (minRank !== null) query.minRank = minRank;
          if (maxRank !== null) query.maxRank = maxRank;
          if (sortBy) {
            query.sortBy = sortBy;
            query.sortDescending = sortDescending;
          }
          return this.#dartsService.getRankings(query).pipe(
            catchError(() => {
              this.hasLoadError.set(true);
              this.isLoading.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(result => {
        if (result) {
          this.result.set(result);
          this.hasLoadError.set(false);
        }
        this.isLoading.set(false);
      });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    if (this.page() !== 1) this.page.set(1);
  }

  onMinRankChange(value: number | null): void {
    this.minRank.set(value);
    if (this.page() !== 1) this.page.set(1);
  }

  onMaxRankChange(value: number | null): void {
    this.maxRank.set(value);
    if (this.page() !== 1) this.page.set(1);
  }

  sort(column: string): void {
    if (this.sortBy() === column) {
      this.sortDescending.update(d => !d);
    } else {
      this.sortBy.set(column);
      this.sortDescending.set(false);
    }
    this.page.set(1);
  }

  goToPage(p: number): void {
    this.page.set(p);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }
}
