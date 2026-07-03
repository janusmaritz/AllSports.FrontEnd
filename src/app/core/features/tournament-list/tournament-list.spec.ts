import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { TournamentList } from './tournament-list';
import { DartsTournament } from '../../models/darts-tournament.model';
import { PagedResult } from '../../models/paged-result.model';
import { DartsService, TournamentQuery } from '../../services/darts.service';

const isoDate = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
};

const makeTournament = (overrides: Partial<DartsTournament>): DartsTournament => ({
  id: 1,
  name: 'PDC World Darts Championship',
  location: 'London, ENG',
  organisation: 'PDC',
  startDate: isoDate(10),
  endDate: isoDate(15),
  detailUrl: 'https://mastercaller.com/tournaments/pdc-world-darts-championship/2027',
  sourceUrl: 'https://mastercaller.com/calendar',
  scrapedAtUtc: '2026-07-01T10:00:00Z',
  ...overrides,
});

const tournaments: DartsTournament[] = [
  makeTournament({ id: 1 }),
  makeTournament({ id: 2, name: 'WDF World Championship', organisation: 'WDF' }),
];

const pagedResult: PagedResult<DartsTournament> = {
  items: tournaments,
  page: 1,
  pageSize: 20,
  totalCount: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('TournamentList', () => {
  let fixture: ComponentFixture<TournamentList>;
  let component: TournamentList;
  let lastQuery: TournamentQuery | undefined;

  const flushQueries = async () => {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(320);
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    lastQuery = undefined;

    await TestBed.configureTestingModule({
      imports: [TournamentList],
      providers: [
        {
          provide: DartsService,
          useValue: {
            getTournaments: (query: TournamentQuery) => {
              lastQuery = query;
              return of(pagedResult);
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TournamentList);
    component = fixture.componentInstance;
    await flushQueries();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tournaments with the default Upcoming status filter', () => {
    expect(lastQuery?.status).toBe('Upcoming');
    expect(component.result().items).toEqual(tournaments);
    expect(component.isLoading()).toBeFalsy();
    expect(component.hasLoadError()).toBeFalsy();
  });

  it('should pass search term to the API and reset the page', async () => {
    component.goToPage(2);
    await flushQueries();

    component.onSearch('world');
    await flushQueries();

    expect(lastQuery?.searchTerm).toBe('world');
    expect(lastQuery?.page).toBe(1);
  });

  it('should pass organisation filter to the API', async () => {
    component.onOrganisationChange('WDF');
    await flushQueries();

    expect(lastQuery?.organisation).toBe('WDF');
  });

  it('should toggle sort direction when sorting the same column twice', async () => {
    component.sort('name');
    await flushQueries();
    expect(lastQuery?.sortBy).toBe('name');
    expect(lastQuery?.sortDescending).toBe(false);

    component.sort('name');
    await flushQueries();
    expect(lastQuery?.sortDescending).toBe(true);
  });

  it('should derive tournament status from its dates', () => {
    expect(component.statusOf(makeTournament({ startDate: isoDate(1), endDate: isoDate(3) }))).toBe('Upcoming');
    expect(component.statusOf(makeTournament({ startDate: isoDate(-1), endDate: isoDate(1) }))).toBe('Live');
    expect(component.statusOf(makeTournament({ startDate: isoDate(0), endDate: isoDate(0) }))).toBe('Live');
    expect(component.statusOf(makeTournament({ startDate: isoDate(-3), endDate: isoDate(-1) }))).toBe('Completed');
  });
});
