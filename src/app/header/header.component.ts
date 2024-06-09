import { Component, Input, OnInit } from '@angular/core';
import { SignUpComponent } from '../authorization/sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { LogInComponent } from '../authorization/log-in/log-in.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../authorization/shared/auth.service';
import { UserProfileSettings } from '../settings-menu/user-profile-settings.component';
import { CommunityDto } from '../dto/CommunityDto';
import { RedditSearchComponent } from '../reddit-search/reddit-search.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';
import { ScreenWidthToggleDirective } from '../directives/screen-width-toggle.directive';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ScreenWidthToggleDirective,LoadingIndicatorComponent,RedditSearchComponent,SignUpComponent,UserProfileSettings,CommonModule,DetectOutsideClickDirective,LogInComponent,RouterLink,RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  isLoggedIn!:boolean;
  userName!:string;
  communities:Array<CommunityDto>=[];
  community!:CommunityDto; 
  isToggleActive:boolean=false;
  toggleThreshold:number=1400;
  @Input() allowedCommunityToggleInCurrentPage:boolean=true;
  
  ngOnInit(): void {
    this.userService.isToggleActiveObserver.subscribe(isActive => {
      this.isToggleActive=isActive;
      this.userService.updateIsVisible(!isActive);
    });
    this.authService.loggedInStatus.subscribe(data => this.isLoggedIn=data);
    this.authService.userName.subscribe(data => this.userName=data);
  }
  
  constructor(private router:Router,private authService:AuthService,private userService:UserService){}
  
    navigateToHome() {
    this.router.navigateByUrl("/");
    }

    navigateToLogin() {
      this.router.navigateByUrl("/login");
    }
    
    navigateToSignup() {
      this.router.navigateByUrl("/signup");
    }
    
    navigateToCreate() {
      this.router.navigateByUrl('/submit');
    }

    logout() {
      this.authService.logOut();
      this.isLoggedIn=false;
      window.location.reload();
      this.router.navigateByUrl("/");
    }

    openProfile() {
      this.router.navigate(["/profile"],{queryParams:{id:this.authService.getUserId()}});
    }

    activateToggle(event: boolean): void {
      this.userService.updateIsToggleActive(event);
    }
  
    toggleVisibility(): void {
      this.userService.toggleVisibility();
    }
  }
  