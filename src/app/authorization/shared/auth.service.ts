import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequestPayload } from '../sign-up/sign-up-request-payload';
import { LogInRequestPayload } from '../log-in/log-in-request-payload';
import { map } from 'rxjs';
import { LogInResponse } from '../log-in/log-in-response';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient,private localStorage: LocalStorageService) { }

  signUp(signUpRequestPayload: SignUpRequestPayload){
    return this.httpClient.post('http://localhost:8080/reddit/auth/signup',signUpRequestPayload, {responseType : 'text'});
  }

  logIn(logInRequestPayload: LogInRequestPayload) {
    return this.httpClient.post<LogInResponse>('http://localhost:8080/reddit/auth/login',logInRequestPayload)
    .pipe(map(data => {
      this.localStorage.store('AuthenticationToken',data.authenticationToken);
      this.localStorage.store('RefreshToken',data.refreshToken),
      this.localStorage.store('ExpiresAt',data.expiresAt),
      this.localStorage.store('Username',data.userName)

      return true;
    }));
  }
}
