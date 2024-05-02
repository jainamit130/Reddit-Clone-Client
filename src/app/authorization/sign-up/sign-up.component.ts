import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DetectOutsideClickDirective } from '../../directives/detect-outside-click.directive';
import { UserProfileSettings } from '../../settings-menu/user-profile-settings.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignUpRequestPayload } from '../../dto/RequestPayload/sign-up-request-payload';
import { AuthService } from '../shared/auth.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [RouterLink,RouterOutlet,CommonModule,ReactiveFormsModule,UserProfileSettings],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  @Output() clickedOutside = new EventEmitter<void>();
  signUpForm!: FormGroup;
  signUpRequestPayload!: SignUpRequestPayload
  constructor (private authService:AuthService,private router: Router,private toast:ToastrService) {
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

  signUp() {
    this.signUpRequestPayload.email=this.signUpForm.get('email')?.value;
    this.signUpRequestPayload.userName=this.signUpForm.get('userName')?.value;
    this.signUpRequestPayload.password=this.signUpForm.get('password')?.value;
    
    this.authService.signUp(this.signUpRequestPayload)
      .subscribe(data => {
        this.router.navigate(['/login'],{queryParams: { registered:'true'}});
      }, () => {
        this.toast.error('User Registeration failed! Please try again');
      });
  }

  navigateToLogin(){
    this.signUpForm.reset();
    this.signUpForm.markAsPristine();
    this.signUpForm.markAsUntouched();
    this.router.navigateByUrl("/login");
  }

}
