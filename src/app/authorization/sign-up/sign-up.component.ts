import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DetectOutsideClickDirective } from '../../directives/detect-outside-click.directive';
import { SettingsMenuComponent } from '../../settings-menu/settings-menu.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpRequestPayload } from './sign-up-request-payload';
import { AuthService } from '../shared/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule,DetectOutsideClickDirective,ReactiveFormsModule,SettingsMenuComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  @Output() clickedOutside = new EventEmitter<void>();
  signUpForm!: FormGroup;
  signUpRequestPayload!: SignUpRequestPayload
  constructor (private authService:AuthService,private router: Router) {
    this.signUpRequestPayload = {
      userName: '',
      email: '',
      password: '',
    }
  }

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      userName: new FormControl('',Validators.required),
      email: new FormControl('',[Validators.required,Validators.email]),
      password: new FormControl('',Validators.required),
    });
  }

  clickedOutsideForm(){
    this.signUpForm.reset();
    this.signUpForm.markAsPristine();
    this.signUpForm.markAsUntouched();
    this.router.navigateByUrl("");
  }

  signUp() {
    this.signUpRequestPayload.email=this.signUpForm.get('email')?.value;
    this.signUpRequestPayload.userName=this.signUpForm.get('userName')?.value;
    this.signUpRequestPayload.password=this.signUpForm.get('password')?.value;
    
    this.authService.signUp(this.signUpRequestPayload)
      .subscribe(data => {
        console.log(data);
      })
  }

  navigateToLogin(){
    this.signUpForm.reset();
    this.signUpForm.markAsPristine();
    this.signUpForm.markAsUntouched();
    this.router.navigateByUrl("/login");
    console.log("checking");
  }

}
