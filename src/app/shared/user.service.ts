import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserProfileDto } from './../dto/UserProfileDto';
import { userSearch } from '../dto/userSearch';
import { environment } from '../../environment';
import { PostDto } from '../dto/postDto';
 
@Injectable({
  providedIn: 'root'
})
export class UserService {
  inputFocused = new EventEmitter<any>();
  emitInputFocusEvent() {
    this.inputFocused.emit();
  }

  private searchQuery = new BehaviorSubject<string>("");
  searchQueryObserver = this.searchQuery.asObservable();

  updateSearchQuery(query:string) {
    this.searchQuery.next(query);
  }

  private isRecentPostsToggleActive = new BehaviorSubject<boolean>(false);
  isRecentPostsToggleObserver = this.isRecentPostsToggleActive.asObservable();

  private isVisible = new BehaviorSubject<boolean>(true);
  isVisibleObserver = this.isVisible.asObservable();

  private isToggleActive = new BehaviorSubject<boolean>(false);
  isToggleActiveObserver = this.isToggleActive.asObservable();
  
  private activatedSearch = new BehaviorSubject<boolean>(false);
  activatedSearchStatus = this.activatedSearch.asObservable();
  
  updateIsVisible(event:boolean){
    this.isVisible.next(event);
  }

  updateIsToggleActive(event: boolean){
    this.isToggleActive.next(event);
    this.isVisible.next(!event);
  }

  toggleVisibility(){
    this.isVisible.next(!this.isVisible.getValue());
  }

  updateRecentPostsToggle(event: boolean){
    this.isRecentPostsToggleActive.next(event);
  }
  
  updateActivatedStatus(isActivated:boolean){
    this.activatedSearch.next(isActivated);
  }
  
  constructor(private httpClient:HttpClient) {}
  
  getRecentPosts(){
    return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'user/getUserHistory');
  }
  
  getUserProfile(userId:number):Observable<UserProfileDto>{
    return this.httpClient.get<UserProfileDto>(environment.baseUrl+'user/'+userId)
  }
  
  searchPeople(searchQuery: string) {
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<userSearch>>(environment.baseUrl+'search/people',options);
  }

  clearHistory() {
    return this.httpClient.get(environment.baseUrl+'user/clearHistory');
  }
  
}
