import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy, OnInit, Output } from '@angular/core';
import { SignUpRequestPayload } from '../../dto/RequestPayload/sign-up-request-payload';
import { LogInRequestPayload } from '../../dto/RequestPayload/log-in-request-payload';
import { BehaviorSubject, catchError, map, of, tap, throwError } from 'rxjs';
import { LogInResponse } from '../../dto/ResponsePayload/log-in-response';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  
  private login = new BehaviorSubject<boolean>(false);
  loggedInStatus = this.login.asObservable();

  constructor(private httpClient:HttpClient,private localStorage: LocalStorageService) {
    this.checkAuthenticationStatus();
  }

  ngOnDestroy(): void {
    this.localStorage.clear('AuthenticationToken');
    this.localStorage.clear('Username');
    this.localStorage.clear('RefreshToken');
    this.localStorage.clear('ExpiresAt');
    this.login.next(false);
  }

  private checkAuthenticationStatus() {
    const authToken = this.localStorage.retrieve('AuthenticationToken');
    if (authToken) {
      this.login.next(true);
    }
  }

  @Output() userName = new EventEmitter<string>();
  @Output() loginError = new EventEmitter<boolean>();

  refreshTokenPayload = {
    refreshToken:this.getRefreshToken(),
    username: this.getUserName()
  }

  getLatestRefreshTokenPayload(){
    this.refreshTokenPayload = {
      refreshToken:this.getRefreshToken(),
      username: this.getUserName()
    }
    return this.refreshTokenPayload;
  }

  
  
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
      this.login.next(true);
      this.userName.emit(data.userName);
      return true;
    }),
    catchError(error => {
      if (error.status === 403) {
        this.loginError.emit();
        return of(false);
      }
      return throwError(error);
    })
  );
}

refreshToken() {
  return this.httpClient.post<LogInResponse>('http://localhost:8080/reddit/auth/refreshToken',this.refreshTokenPayload)
  .pipe(tap(response => {
    this.localStorage.store('AuthenticationToken',response.authenticationToken);
    this.localStorage.store('ExpiresAt',response.expiresAt);
  }));
}

  getJwtToken() {
    return this.localStorage.retrieve('AuthenticationToken');
  }

  getRefreshToken(): string {
    return this.localStorage.retrieve("RefreshToken");
  }

  getUserName(): string {
    return this.localStorage.retrieve("Username");
  }

  logOut() {
    this.httpClient.post('http://localhost:8080/reddit/auth/logout',this.getLatestRefreshTokenPayload(),{ responseType: 'text' })
    .subscribe(data => {
      console.log(data);
    }, error => {
      throwError(error);
    });
    this.login.next(false);
    this.localStorage.clear('AuthenticationToken');
    this.localStorage.clear('Username');
    this.localStorage.clear('RefreshToken');
    this.localStorage.clear('ExpiresAt');
  }
}
