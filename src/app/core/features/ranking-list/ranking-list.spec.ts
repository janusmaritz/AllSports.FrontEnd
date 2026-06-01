import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RankingList } from './ranking-list';
import { DartsRanking } from '../../models/darts-ranking.model';
import { DartsService } from '../../services/darts.service';

describe('RankingList', () => {
  let component: RankingList;
  let fixture: ComponentFixture<RankingList>;
  const rankings: DartsRanking[] = [
    {
      id: 1,
      rank: 1,
      playerName: 'Luke Humphries',
      moneyAmount: 1200000,
      sourceUrl: 'https://example.com/order-of-merit',
      scrapedAtUtc: '2026-06-01T10:00:00Z'
    },
    {
      id: 2,
      rank: 2,
      playerName: 'Michael van Gerwen',
      moneyAmount: 900000,
      sourceUrl: 'https://example.com/order-of-merit',
      scrapedAtUtc: '2026-06-01T10:00:00Z'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingList],
      providers: [
        {
          provide: DartsService,
          useValue: {
            getRankings: () => of(rankings)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load rankings on init', () => {
    expect(component.filteredRankings()).toEqual(rankings);
    expect(component.isLoading()).toBeFalsy();
    expect(component.hasLoadError()).toBeFalsy();
  });

  it('should filter rankings by player name', () => {
    component.searchTerm.set('michael');

    expect(component.filteredRankings()).toEqual([rankings[1]]);
  });
});
