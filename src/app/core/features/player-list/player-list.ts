import { CommonModule } from '@angular/common';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Filter, LucideAngularModule, Music2, Search, Target, X } from 'lucide-angular';
import { catchError, combineLatest, debounceTime, of, switchMap } from 'rxjs';
import { PagedResult } from '../../models/paged-result.model';
import { PlayerProfile } from '../../models/player-profile.model';
import { DartsService, PlayerQuery } from '../../services/darts.service';

const EMPTY_RESULT: PagedResult<PlayerProfile> = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

@Component({
  selector: 'app-player-list',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  standalone: true,
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList {
  readonly #dartsService = inject(DartsService);
  readonly #destroyRef = inject(DestroyRef);

  readonly targetIcon = Target;
  readonly searchIcon = Search;
  readonly music2Icon = Music2;
  readonly filterIcon = Filter;
  readonly clearIcon = X;

  readonly searchTerm = signal('');
  readonly dartBrand = signal('');
  readonly dartWeight = signal('');
  readonly showFilters = signal(false);
  readonly page = signal(1);
  readonly pageSize = signal(20);
  readonly sortBy = signal('');
  readonly sortDescending = signal(false);

  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly result = signal<PagedResult<PlayerProfile>>(EMPTY_RESULT);

  readonly activeFilterCount = computed(() =>
    (this.dartBrand() ? 1 : 0) + (this.dartWeight() ? 1 : 0),
  );

  readonly brands = [
    'Target', 'Red Dragon', 'Unicorn', 'Winmau', 'Harrows',
    'Shot', 'Loxley', 'Mission', "Bull's", 'Cosmo', 'One80',
  ];

  readonly weights = [
    '16g', '18g', '19g', '20g', '21g', '22g',
    '23g', '24g', '25g', '26g', '28g', '30g',
  ];

  constructor() {
    combineLatest([
      toObservable(this.searchTerm).pipe(debounceTime(300)),
      toObservable(this.dartBrand),
      toObservable(this.dartWeight),
      toObservable(this.page),
      toObservable(this.pageSize),
      toObservable(this.sortBy),
      toObservable(this.sortDescending),
    ])
      .pipe(
        debounceTime(10),
        switchMap(([searchTerm, dartBrand, dartWeight, page, pageSize, sortBy, sortDescending]) => {
          this.isLoading.set(true);
          const query: PlayerQuery = { page, pageSize };
          if (searchTerm.trim()) query.searchTerm = searchTerm.trim();
          if (dartBrand) query.dartBrand = dartBrand;
          if (dartWeight) query.dartWeight = dartWeight;
          if (sortBy) {
            query.sortBy = sortBy;
            query.sortDescending = sortDescending;
          }
          return this.#dartsService.getPlayers(query).pipe(
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

  setDartBrand(brand: string): void {
    this.dartBrand.set(brand);
    if (this.page() !== 1) this.page.set(1);
  }

  setDartWeight(weight: string): void {
    this.dartWeight.set(weight);
    if (this.page() !== 1) this.page.set(1);
  }

  clearFilters(): void {
    this.dartBrand.set('');
    this.dartWeight.set('');
    this.page.set(1);
  }

  toggleFilters(): void {
    this.showFilters.update(v => !v);
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
