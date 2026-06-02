import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  Target,
  Users,
  Trophy,
  ChartColumn,
  Settings2,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  MoonStar as MoonStarIcon,
  SunMedium as SunMediumIcon
} from 'lucide-angular';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class SidebarComponent implements OnInit {
  @HostBinding('class.is-open') @Input() isOpen = false;
  @Output() closeRequested = new EventEmitter<void>();

  private readonly themeStorageKey = 'allSportsTheme';
  isDarkMode = false;
  readonly chevronDownIcon = ChevronDownIcon;
  readonly chevronRightIcon = ChevronRightIcon;
  readonly moonStarIcon = MoonStarIcon;
  readonly sunMediumIcon = SunMediumIcon;

  menuItems: MenuItem[] = [
    {
      label: 'Darts',
      icon: Target,
      isOpen: true,
      children: [
        { label: 'Player Stats', icon: Users, route: '/players' },
        { label: 'Tournaments', icon: Trophy, route: '/tournaments' },
        { label: 'Rankings', icon: ChartColumn, route: '/rankings' }
      ]
    },
    {
      label: 'Settings',
      icon: Settings2,
      route: '/settings'
    }
  ];

  toggleSection(item: MenuItem): void {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  }

  onNavLinkClick(): void {
    this.closeRequested.emit();
  }

  ngOnInit(): void {
    this.initializeTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode ? 'dark' : 'light');
    localStorage.setItem(this.themeStorageKey, this.isDarkMode ? 'dark' : 'light');
  }

  get themeLabel(): string {
    return this.isDarkMode ? 'Dark Mode' : 'Light Mode';
  }

  private initializeTheme(): void {
    const storedTheme = localStorage.getItem(this.themeStorageKey);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      this.isDarkMode = storedTheme === 'dark';
      this.applyTheme(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.isDarkMode = prefersDark;
    this.applyTheme(prefersDark ? 'dark' : 'light');
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
