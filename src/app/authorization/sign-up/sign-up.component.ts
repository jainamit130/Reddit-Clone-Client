import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  login = true;

  loggingIn(){
    this.login=true;
  }

  signingUp(){
    this.login=false;
  }
}
