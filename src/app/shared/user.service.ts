import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserProfileDto } from './../dto/UserProfileDto';
 
@Injectable({
  providedIn: 'root'
})
export class UserService {

  inputFocused = new EventEmitter<any>();
  emitInputFocusEvent() {
    this.inputFocused.emit();
  }

  private activatedSearch = new BehaviorSubject<boolean>(false);
  activatedSearchStatus = this.activatedSearch.asObservable();

  private currentRoute = new BehaviorSubject<string>("");
  routeStatus = this.currentRoute.asObservable();

  updateActivatedStatus(isActivated:boolean){
    this.activatedSearch.next(isActivated);
  }

  updateRoute(newRoute:string){
    this.currentRoute.next(newRoute);
  }

  constructor(private httpClient:HttpClient) {}

  getUserProfile():Observable<UserProfileDto>{
    return this.httpClient.get<UserProfileDto>('http://localhost:8080/reddit/user/')
  }
}
