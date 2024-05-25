import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserProfileDto } from './../dto/UserProfileDto';
 
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private inputFocused: Subject<void> = new Subject<void>();
  inputFocusListner = this.inputFocused.asObservable();

  emitInputFocusEvent() {
    this.inputFocused.next();
  }

  private currentRoute = new BehaviorSubject<string>("");
  routeStatus = this.currentRoute.asObservable();

  updateRoute(newRoute:string){
    this.currentRoute.next(newRoute);
  }

  constructor(private httpClient:HttpClient) { }

  getUserProfile():Observable<UserProfileDto>{
    return this.httpClient.get<UserProfileDto>('http://localhost:8080/reddit/user/')
  }
}
