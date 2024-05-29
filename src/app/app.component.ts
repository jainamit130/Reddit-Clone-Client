import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { DetectOutsideClickDirective } from './directives/detect-outside-click.directive';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { CommunitiesComponent } from './communities/communities.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { SearchResultNavigationComponent } from './search-results/search-result-navigation.ts/search-result-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,SearchResultNavigationComponent,CreatePostComponent,CommunitiesComponent,HomeComponent,RouterOutlet,RouterLink,HeaderComponent,CommonModule,SignUpComponent,DetectOutsideClickDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  isLoginPage:boolean=false;
  settingsOn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === '/login' || this.router.url === '/signup';
      }
    });
  }
  toggleSettingsMenu() {
    this.settingsOn=!this.settingsOn;
  }

  closeSettings() {
    this.settingsOn=false;
  }

}
