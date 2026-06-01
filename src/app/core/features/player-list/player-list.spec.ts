import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PlayerList } from './player-list';
import { DartsService } from '../../services/darts.service';
import { PlayerProfile } from '../../models/player-profile.model';

describe('PlayerList', () => {
  let component: PlayerList;
  let fixture: ComponentFixture<PlayerList>;
  const players: PlayerProfile[] = [
    {
      id: 1,
      fullName: 'Luke Littler',
      nickname: 'The Nuke',
      age: 18,
      dartsUsed: 'Target',
      walkOnSong: 'Greenlight'
    },
    {
      id: 2,
      fullName: 'Michael van Gerwen',
      nickname: 'Mighty Mike',
      age: 37,
      dartsUsed: 'Winmau',
      walkOnSong: 'Seven Nation Army'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerList],
      providers: [
        {
          provide: DartsService,
          useValue: {
            getPlayers: () => of(players)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load players on init', () => {
    expect(component.filteredPlayers()).toEqual(players);
  });

  it('should filter loaded players by search term and brand', () => {
    component.searchTerm.set('mike');
    component.selectedBrand.set('Winmau');

    expect(component.filteredPlayers()).toEqual([players[1]]);
  });
});
