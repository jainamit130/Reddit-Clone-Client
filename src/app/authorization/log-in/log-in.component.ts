import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { DetectOutsideClickDirective } from '../../directives/detect-outside-click.directive';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInRequestPayload } from '../../dto/RequestPayload/log-in-request-payload';
import { AuthService } from '../shared/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [DetectOutsideClickDirective,CommonModule,ReactiveFormsModule,RouterLink,RouterOutlet],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit,OnDestroy{

  @Output() clickedOutside = new EventEmitter<void>();

  logInForm!: FormGroup;
  logInRequestPayload: LogInRequestPayload;
  registerationSuccessMessage: string= '';
  loginError: boolean=false;

  constructor(private authService: AuthService,private activatedRoute:ActivatedRoute,private router:Router, private toast: ToastrService){
    this.logInRequestPayload={
      userName:'',
      password:''
    }
  }

  ngOnInit(): void {
    this.authService.loginError.subscribe((data: boolean) => this.loginError = data);
    this.logInForm = new FormGroup({
      userName: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
    });

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['registered'] !== undefined && params['registered'] === 'true') {
          this.toast.success('Signup Successful');
          this.registerationSuccessMessage = 'Please Check your inbox for acount activation email!';
        }
      });
  }

  ngOnDestroy(): void {
    this.logInForm.reset();
    this.logInForm.markAsPristine();
    this.logInForm.markAsUntouched();
    this.registerationSuccessMessage="";
  }

  navigateToSignup(){
    this.router.navigateByUrl("/signup");
  }

  login() {
    this.logInRequestPayload.userName=this.logInForm.get('userName')?.value;
    this.logInRequestPayload.password=this.logInForm.get('password')?.value;
    
    this.authService.logIn(this.logInRequestPayload)
      .subscribe(data => {
        if(data){
          this.loginError=false;
          this.router.navigateByUrl('');
          this.toast.success("Login Successful");
        } else {
          this.loginError=true;
        }
      });
  }
}
