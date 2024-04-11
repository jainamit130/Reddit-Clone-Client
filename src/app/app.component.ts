import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';
import { DetectOutsideClickDirective } from './directives/detect-outside-click.directive';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,RouterLink,HeaderComponent,CommonModule,SignUpComponent,DetectOutsideClickDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  settingsOn: boolean = false;

  toggleSettingsMenu() {
    this.settingsOn=!this.settingsOn;
  }

  closeSettings() {
    this.settingsOn=false;
  }

}
