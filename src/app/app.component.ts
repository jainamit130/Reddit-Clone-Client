import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { UserProfileSettings } from './settings-menu/user-profile-settings.component';
import { DetectOutsideClickDirective } from './directives/detect-outside-click.directive';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { CommunitiesComponent } from './communities/communities.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CommunitySearchComponent } from './community-search/community-search.component';
import { SearchResultNavigationComponent } from './search-results/search-result-navigation.ts/search-result-navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SearchResultNavigationComponent,CreatePostComponent,CommunitiesComponent,HomeComponent,RouterOutlet,RouterLink,HeaderComponent,CommonModule,SignUpComponent,DetectOutsideClickDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  settingsOn: boolean = false;

  toggleSettingsMenu() {
    this.settingsOn=!this.settingsOn;
  }

  closeSettings() {
    this.settingsOn=false;
  }

}
