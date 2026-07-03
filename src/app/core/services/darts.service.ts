import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DartsRanking } from '../models/darts-ranking.model';
import { DartsTournament } from '../models/darts-tournament.model';
import { PagedResult } from '../models/paged-result.model';
import { PlayerProfile } from '../models/player-profile.model';

export interface PlayerQuery {
  searchTerm?: string;
  dartBrand?: string;
  dartWeight?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface RankingQuery {
  playerName?: string;
  minRank?: number;
  maxRank?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface TournamentQuery {
  searchTerm?: string;
  organisation?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DartsService {
  readonly #http = inject(HttpClient);
  readonly #apiUrl = `${environment.apiUrl}/darts`;

  getPlayers(query: PlayerQuery = {}): Observable<PagedResult<PlayerProfile>> {
    return this.#http.get<PagedResult<PlayerProfile>>(`${this.#apiUrl}/players`, {
      params: this.#toParams(query),
    });
  }

  getRankings(query: RankingQuery = {}): Observable<PagedResult<DartsRanking>> {
    return this.#http.get<PagedResult<DartsRanking>>(`${this.#apiUrl}/rankings`, {
      params: this.#toParams(query),
    });
  }

  getTournaments(query: TournamentQuery = {}): Observable<PagedResult<DartsTournament>> {
    return this.#http.get<PagedResult<DartsTournament>>(`${this.#apiUrl}/tournaments`, {
      params: this.#toParams(query),
    });
  }

  #toParams<T extends object>(query: T): HttpParams {
    return Object.entries(query).reduce((params, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        return params.set(key, String(value));
      }
      return params;
    }, new HttpParams());
  }
}
