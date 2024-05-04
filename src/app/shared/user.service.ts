import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileDto } from './../dto/UserProfileDto';
 
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }

  getUserProfile():Observable<UserProfileDto>{
    return this.httpClient.get<UserProfileDto>('http://localhost:8080/reddit/user/')
  }
}
