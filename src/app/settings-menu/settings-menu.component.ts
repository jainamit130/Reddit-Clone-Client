import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-settings-menu',
  standalone: true,
  imports: [],
  templateUrl: './settings-menu.component.html',
  styleUrl: './settings-menu.component.css'
})
export class SettingsMenuComponent {
  @Output() signUpClicked = new EventEmitter<void>();

  toggleSignUp(){
    this.signUpClicked.emit();
  }

}
