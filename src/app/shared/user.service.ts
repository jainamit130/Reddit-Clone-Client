import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserProfileDto } from './../dto/UserProfileDto';
import { userSearch } from '../dto/userSearch';
 
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

  getUserProfile(userId:number):Observable<UserProfileDto>{
    return this.httpClient.get<UserProfileDto>('http://localhost:8080/reddit/user/'+userId)
  }

  searchPeople(searchQuery: string) {
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<userSearch>>('http://localhost:8080/reddit/search/people',options);
  }
}
