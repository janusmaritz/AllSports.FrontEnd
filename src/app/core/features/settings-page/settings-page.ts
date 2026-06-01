import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule, Settings2 as SettingsIcon } from 'lucide-angular';

@Component({
  selector: 'app-settings-page',
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  standalone: true,
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  readonly settingsIcon = SettingsIcon;
}
