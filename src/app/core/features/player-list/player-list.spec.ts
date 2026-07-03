import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PlayerList } from './player-list';
import { PagedResult } from '../../models/paged-result.model';
import { PlayerProfile } from '../../models/player-profile.model';
import { DartsService, PlayerQuery } from '../../services/darts.service';

const players: PlayerProfile[] = [
  {
    id: 1,
    fullName: 'Luke Littler',
    nickname: 'The Nuke',
    age: 18,
    dartsUsed: 'Target',
    walkOnSong: 'Greenlight',
    dartBrand: 'Target',
    dartWeight: '23g',
  },
  {
    id: 2,
    fullName: 'Michael van Gerwen',
    nickname: 'Mighty Mike',
    age: 37,
    dartsUsed: 'Winmau',
    walkOnSong: 'Seven Nation Army',
    dartBrand: 'Winmau',
    dartWeight: '23g',
  },
];

const pagedResult: PagedResult<PlayerProfile> = {
  items: players,
  page: 1,
  pageSize: 20,
  totalCount: 2,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

describe('PlayerList', () => {
  let fixture: ComponentFixture<PlayerList>;
  let component: PlayerList;
  let lastQuery: PlayerQuery | undefined;

  const flushQueries = async () => {
    fixture.detectChanges();
    await vi.advanceTimersByTimeAsync(320);
  };

  beforeEach(async () => {
    vi.useFakeTimers();
    lastQuery = undefined;

    await TestBed.configureTestingModule({
      imports: [PlayerList],
      providers: [
        {
          provide: DartsService,
          useValue: {
            getPlayers: (query: PlayerQuery) => {
              lastQuery = query;
              return of(pagedResult);
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerList);
    component = fixture.componentInstance;
    await flushQueries();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load players on init', () => {
    expect(component.result().items).toEqual(players);
    expect(component.isLoading()).toBeFalsy();
    expect(component.hasLoadError()).toBeFalsy();
  });

  it('should pass search term and brand filter to the API and reset the page', async () => {
    component.goToPage(2);
    await flushQueries();

    component.onSearch('mike');
    component.setDartBrand('Winmau');
    await flushQueries();

    expect(lastQuery?.searchTerm).toBe('mike');
    expect(lastQuery?.dartBrand).toBe('Winmau');
    expect(lastQuery?.page).toBe(1);
  });
});
