import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/components/sidebar/sidebar';
import { AuthService } from './core/services/auth.service';
import { LucideAngularModule, Menu } from 'lucide-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly auth = inject(AuthService);
  readonly menuIcon = Menu;
  isSidebarOpen = signal(false);

  toggleSidebar(): void {
    this.isSidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
