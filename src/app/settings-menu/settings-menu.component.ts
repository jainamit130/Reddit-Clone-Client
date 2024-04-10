import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [CommonModule,DetectOutsideClickDirective],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.css'
})
export class SettingsMenuComponent {
  @Output() logInSignUpClicked = new EventEmitter<Event>();
  settingsOn: boolean = false;

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
