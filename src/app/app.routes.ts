import { Routes } from '@angular/router';
import { LogInComponent } from './authorization/log-in/log-in.component';
import { SignUpComponent } from './authorization/sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'login', component: LogInComponent },
  { path: 'signup', component: SignUpComponent },
];
