import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search as SearchIcon, Trophy as TrophyIcon } from 'lucide-angular';
import { catchError, combineLatest, debounceTime, of, switchMap } from 'rxjs';
import { DartsTournament, TournamentStatus } from '../../models/darts-tournament.model';
import { PagedResult } from '../../models/paged-result.model';
import { DartsService, TournamentQuery } from '../../services/darts.service';

const EMPTY_RESULT: PagedResult<DartsTournament> = {
  items: [],
  page: 1,
  pageSize: 20,
  totalCount: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

@Component({
  selector: 'app-tournament-list',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  standalone: true,
  templateUrl: './tournament-list.html',
  styleUrl: './tournament-list.scss',
})
export class TournamentList {
  readonly #dartsService = inject(DartsService);
  readonly #destroyRef = inject(DestroyRef);

  readonly trophyIcon = TrophyIcon;
  readonly searchIcon = SearchIcon;

  readonly searchTerm = signal('');
  readonly selectedStatus = signal('Upcoming');
  readonly selectedOrganisation = signal('');
  readonly page = signal(1);
  readonly pageSize = signal(20);
  readonly sortBy = signal('');
  readonly sortDescending = signal(false);

  readonly statuses = ['Upcoming', 'Live', 'Completed'];
  readonly organisations = ['PDC', 'WDF'];

  readonly isLoading = signal(true);
  readonly hasLoadError = signal(false);
  readonly result = signal<PagedResult<DartsTournament>>(EMPTY_RESULT);

  constructor() {
    combineLatest([
      toObservable(this.searchTerm).pipe(debounceTime(300)),
      toObservable(this.selectedStatus),
      toObservable(this.selectedOrganisation),
      toObservable(this.page),
      toObservable(this.pageSize),
      toObservable(this.sortBy),
      toObservable(this.sortDescending),
    ])
      .pipe(
        debounceTime(10),
        switchMap(([searchTerm, status, organisation, page, pageSize, sortBy, sortDescending]) => {
          this.isLoading.set(true);
          const query: TournamentQuery = { page, pageSize };
          if (searchTerm.trim()) query.searchTerm = searchTerm.trim();
          if (status) query.status = status;
          if (organisation) query.organisation = organisation;
          if (sortBy) {
            query.sortBy = sortBy;
            query.sortDescending = sortDescending;
          }
          return this.#dartsService.getTournaments(query).pipe(
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

  statusOf(tournament: DartsTournament): TournamentStatus {
    const today = new Date().toISOString().slice(0, 10);
    if (tournament.startDate > today) return 'Upcoming';
    if (tournament.endDate < today) return 'Completed';
    return 'Live';
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    if (this.page() !== 1) this.page.set(1);
  }

  onStatusChange(status: string): void {
    this.selectedStatus.set(status);
    if (this.page() !== 1) this.page.set(1);
  }

  onOrganisationChange(organisation: string): void {
    this.selectedOrganisation.set(organisation);
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
