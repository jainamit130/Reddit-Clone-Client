import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { AuthService } from './shared/auth.service';
import { Subscription } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  let isAuthenticated = false; 
  
  const subscription: Subscription = authService.loggedInStatus.subscribe(isLogin => {
    isAuthenticated = isLogin; 
  });

  console.log(isAuthenticated); 
  
  if (isAuthenticated) {
    subscription.unsubscribe(); 
    return true;
  } else {
    subscription.unsubscribe(); 
    router.navigateByUrl('/login');
    return false; 
  }
};
