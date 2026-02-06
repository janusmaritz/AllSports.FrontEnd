import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DartsService } from '../../services/darts.service';
import { PlayerProfile } from '../../models/player-profile.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-list',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './player-list.html',
  styleUrl: './player-list.scss',
})
export class PlayerList implements OnInit {
  private dartsService = inject(DartsService);

  allPlayers: PlayerProfile[] = [];
  
  filteredPlayers: PlayerProfile[] = [];

  searchTerm: string = '';

  players: PlayerProfile[] = [];

  selectedBrand: string = '';

  brands: string[] = [
    'Winmau', 'Target', 'Red Dragon', 'Unicorn', 
    'Harrows', 'Shot', 'Loxley', 'Mission', 'Bull'
  ];

  ngOnInit() {
    this.dartsService.getPlayers().subscribe({
      next: (data) => {
        this.allPlayers = data;
        this.filteredPlayers = data;
      },
      error: (err) => console.error('Error:', err)
    });
  }

  filterPlayers() {
    const term = this.searchTerm.toLowerCase();
    
    this.filteredPlayers = this.allPlayers.filter(player => {
      const matchesSearch = 
        player.fullName.toLowerCase().includes(term) || 
        player.nickname.toLowerCase().includes(term);

      const matchesBrand = this.selectedBrand === '' || 
        player.dartsUsed.toLowerCase().includes(this.selectedBrand.toLowerCase());

      return matchesSearch && matchesBrand;
    });
  }

}
