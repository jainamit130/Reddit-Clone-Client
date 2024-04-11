import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DetectOutsideClickDirective } from '../../directives/detect-outside-click.directive';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInRequestPayload } from './log-in-request-payload';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [DetectOutsideClickDirective,CommonModule,ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit{

  @Output() clickedOutside = new EventEmitter<void>();

  logIn: boolean=false;
  logInForm!: FormGroup;
  logInRequestPayload!: LogInRequestPayload;

  constructor(private authService: AuthService,private router:Router){
    this.logInRequestPayload={
      userName:'',
      password:''
    }
  }

  ngOnInit(): void {
    this.logInForm = new FormGroup({
      userName: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
    });
  }

  clickedOutsideForm(){
    this.logIn=false;
    this.logInForm.reset();
    this.logInForm.markAsPristine();
    this.logInForm.markAsUntouched();
  }

  toggleSignInForm() {
    this.logIn=!this.logIn;
  }

  login() {
    this.logInRequestPayload.userName=this.logInForm.get('userName')?.value;
    this.logInRequestPayload.password=this.logInForm.get('password')?.value;
    
    this.authService.logIn(this.logInRequestPayload)
      .subscribe(data => {
        console.log("Logged in Successfully!");
      })
  }
}
