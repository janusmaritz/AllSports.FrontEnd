import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../models/menu-item.model';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent {
  
  menuItems: MenuItem[] = [
    {
      label: 'Darts',
      icon: '🎯',
      isOpen: true,
      children: [
        { label: 'Player Stats', icon: '👥', route: '/players' },
        { label: 'Tournaments', icon: '🏆', route: '/tournaments' },
        { label: 'Rankings', icon: '📊', route: '/rankings' }
      ]
    },
    { 
      label: 'Settings', 
      icon: '⚙️', 
      route: '/settings' 
    }
  ];

  toggleSection(item: MenuItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}