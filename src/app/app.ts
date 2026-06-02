import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/components/sidebar/sidebar';
import { LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('AllSportsUI');
  readonly menuIcon = Menu;
  isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
