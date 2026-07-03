import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RankingList } from './ranking-list';
import { DartsRanking } from '../../models/darts-ranking.model';
import { PagedResult } from '../../models/paged-result.model';
import { DartsService, RankingQuery } from '../../services/darts.service';

const rankings: DartsRanking[] = [
  {
    id: 1,
    rank: 1,
    playerName: 'Luke Humphries',
    moneyAmount: 1200000,
    sourceUrl: 'https://example.com/order-of-merit',
    scrapedAtUtc: '2026-06-01T10:00:00Z',
  },
  {
    id: 2,
    rank: 2,
    playerName: 'Michael van Gerwen',
    moneyAmount: 900000,
    sourceUrl: 'https://example.com/order-of-merit',
    scrapedAtUtc: '2026-06-01T10:00:00Z',
  },
];

const pagedResult: PagedResult<DartsRanking> = {
  items: rankings,
  page: 1,
  pageSize: 20,
  totalCount: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('RankingList', () => {
  let fixture: ComponentFixture<RankingList>;
  let component: RankingList;
  let lastQuery: RankingQuery | undefined;

  const flushQueries = async () => {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(320);
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    lastQuery = undefined;

    await TestBed.configureTestingModule({
      imports: [RankingList],
      providers: [
        {
          provide: DartsService,
          useValue: {
            getRankings: (query: RankingQuery) => {
              lastQuery = query;
              return of(pagedResult);
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingList);
    component = fixture.componentInstance;
    await flushQueries();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rankings on init', () => {
    expect(component.result().items).toEqual(rankings);
    expect(component.isLoading()).toBeFalsy();
    expect(component.hasLoadError()).toBeFalsy();
  });

  it('should pass player name filter to the API and reset the page', async () => {
    component.goToPage(2);
    await flushQueries();

    component.onSearch('michael');
    await flushQueries();

    expect(lastQuery?.playerName).toBe('michael');
    expect(lastQuery?.page).toBe(1);
  });
});
