import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SettingsMenuComponent } from './settings-menu/settings-menu.component';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponent,SettingsMenuComponent,SignUpComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'reddit-angular';

  showSettingsMenu = false;
  showSignUp = false;

  toggleSettingsMenu() {
    this.showSettingsMenu = !this.showSettingsMenu;
  }

  toggleSignUp() {
    this.showSettingsMenu=false;
    this.showSignUp = !this.showSignUp;
  }

  closeSignUp() {
    if (this.showSignUp) {
      this.showSignUp=false;
    }
  }

  toggleLogin() {
    this.showSignUp = true;
  }
}
