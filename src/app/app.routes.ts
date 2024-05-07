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

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent},
  { path: 'post', component: PostComponent,canActivate:[authGuard]},
  { path: 'submit', component: CreatePostComponent,canActivate:[authGuard]},
  { path: 'create-community', component: CreateCommunityComponent,canActivate:[authGuard]},
  { path: 'community', component: CommunityComponent,canActivate:[authGuard]},
  { path: 'profile', component: ProfileComponent,canActivate:[authGuard]},
];
