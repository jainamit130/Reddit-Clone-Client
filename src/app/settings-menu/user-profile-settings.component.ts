import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { AuthService } from '../authorization/shared/auth.service';

@Component({
  selector: 'user-profile-settings-menu',
  standalone: true,
  imports: [CommonModule,DetectOutsideClickDirective],
  templateUrl: './user-profile-settings.component.html',
  styleUrl: './user-profile-settings.component.css'
})
export class UserProfileSettings {
  @Output() loggedOut = new EventEmitter<void>();
  @Output() openedProfile = new EventEmitter<void>();
  @Output() logInSignUpClicked = new EventEmitter<Event>();
  settingsOn: boolean = false;
  
  constructor(private authService :AuthService){}

  openSignUpForm(event: Event) {
    this.toggleSettingsMenu();
    this.logInSignUpClicked.emit(event);
  }
  
  toggleSettingsMenu() {
    this.settingsOn=!this.settingsOn;
  }
  
  closeSettings() {
    this.settingsOn=false;
  }

}
