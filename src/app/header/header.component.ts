import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Output() settingsMenuClicked = new EventEmitter<void>();
  @Output() loginClicked = new EventEmitter<void>();

  toggleSettingsMenu() {
    this.settingsMenuClicked.emit();
  }

  toggleLoginForm() {
    this.loginClicked.emit();
  }

}
