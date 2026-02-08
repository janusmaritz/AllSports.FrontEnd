import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlayerProfile } from '../models/player-profile.model';
import { environment } from '../../../environments/environment.production';

@Injectable({ providedIn: 'root' })
export class DartsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/darts`;

  getPlayers() {
    return this.http.get<PlayerProfile[]>(`${this.apiUrl}/players`);
  }
}