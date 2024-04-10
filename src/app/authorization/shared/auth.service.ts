import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignUpRequestPayload } from '../sign-up/sign-up-request-payload';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient:HttpClient) { }

  signUp(signUpRequestPayload: SignUpRequestPayload){
    return this.httpClient.post('http://localhost:8080/reddit/auth/signup',signUpRequestPayload, {responseType : 'text'});
  }
}
