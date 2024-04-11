import { Component, EventEmitter, Output } from '@angular/core';
import { SignUpComponent } from '../authorization/sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { LogInComponent } from '../authorization/log-in/log-in.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SignUpComponent,CommonModule,DetectOutsideClickDirective,LogInComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
}
