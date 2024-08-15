import { Routes } from '@angular/router';
import { LogInComponent } from './authorization/log-in/log-in.component';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { authGuard } from './authorization/auth.guard';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { PostSearchResultComponent } from './search-results/post-search-result/post-search-result.component';
import { CommentSearchResultComponent } from './search-results/comment-search-result/comment-search-result.component';
import { PeopleSearchResultComponent } from './search-results/people-search-result/people-search-result.component';
import { CommunitySearchResultComponent } from './search-results/community-search-result/community-search-result.component';
import { SearchResultNavigationComponent } from './search-results/search-result-navigation.ts/search-result-navigation.component';
import { CommunityService } from './shared/community.service';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent},
  { path: 'post', component: PostComponent},
  { path: 'submit', component: CreatePostComponent,canActivate:[authGuard]},
  { path: 'create-community', component: CreateCommunityComponent,canActivate:[authGuard]},
  { path: 'community', component: CommunityComponent},
  { path: 'profile', component: ProfileComponent},
  {
    path: 'search', component: SearchResultNavigationComponent, children: [
      { path: 'posts', component: PostSearchResultComponent },
      { path: 'comments', component: CommentSearchResultComponent },
      { path: 'communities', component: CommunitySearchResultComponent },
      { path: 'people', component: PeopleSearchResultComponent }
    ]
  },
];
