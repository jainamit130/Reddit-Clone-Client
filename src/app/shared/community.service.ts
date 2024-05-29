import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto } from '../dto/CommunityDto';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { CreateCommunityRequestPayload } from '../dto/RequestPayload/create-community-request-payload';
import { CommunitySearchDto } from '../dto/communitySearchDto';
import { AuthService } from '../authorization/shared/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  isLoggedIn:boolean = false;

  private communityData = new BehaviorSubject<any>(null);
  currentCommunityData = this.communityData.asObservable();

  private userCommunitiesSubject = new BehaviorSubject<Array<CommunityDto>>([]);
  currentUserCommunities = this.userCommunitiesSubject.asObservable();

  constructor(private router:Router,private httpClient:HttpClient,private authService:AuthService) { 
    this.authService.loggedInStatus.subscribe(isLoggedIn=>{
      this.isLoggedIn=isLoggedIn;
    })
  }

  isJoined(communityId: number): boolean {
    const communities = this.userCommunitiesSubject.getValue();
    return communities.some(community => community.communityId === communityId);
  }

  addCommunity(newCommunity: CommunityDto) {
    const currentCommunities = this.userCommunitiesSubject.getValue();
    const updatedCommunities = [...currentCommunities, newCommunity];
    this.userCommunitiesSubject.next(updatedCommunities);
  }

  removeCommunity(communityId: number) {
    const currentCommunities = this.userCommunitiesSubject.getValue();
    const updatedCommunities = currentCommunities.filter(community => community.communityId !== communityId);
    this.userCommunitiesSubject.next(updatedCommunities);
  }

  updateCommunityData(data: string) {
    this.communityData.next(data);
  }

  updateUserCommunitiesData(data: CommunityDto[]) {
    this.userCommunitiesSubject.next(data);
  }

  getAllCommunities():Observable<Array<CommunityDto>>{
    return this.httpClient.get<Array<CommunityDto>>(environment.baseUrl+'/reddit/community/getAllCommunities');
  }

  joinCommunity(communityId: number): Observable<CommunityDto> {
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return of();
    }

    return this.httpClient.post<CommunityDto>(environment.baseUrl+'/reddit/community/join/' + communityId, null);
  }

  leaveCommunity(communityId: number): Observable<CommunityDto> {
    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return of();
    }

    return this.httpClient.post<CommunityDto>(environment.baseUrl+'/reddit/community/leave/' + communityId, null);
  }

  getUserCommunities():Observable<Array<CommunityDto>>{
    if (!this.isLoggedIn) {
      return of([]);
    }
    return this.httpClient.get<Array<CommunityDto>>(environment.baseUrl+'/reddit/community/getUserCommunities');
  }

  createCommunity(createCommunityRequest: CreateCommunityRequestPayload):Observable<CommunityDto> {
    return this.httpClient.post<CommunityDto>(environment.baseUrl+'/reddit/community/create',createCommunityRequest);
  }

  getCommunity(communityId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>(environment.baseUrl+'/reddit/community/getCommunity/'+communityId);
  }

  getCommunityOfPost(postId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>(environment.baseUrl+'/reddit/community/getCommunityOfPost/'+postId);
  }

  getCommunityWithPosts(communityId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>(environment.baseUrl+'/reddit/community/getCommunityWithPosts/'+communityId);
  }

  communitySearch(searchQuery: string):Observable<Array<CommunitySearchDto>> {
    return this.httpClient.get<Array<CommunitySearchDto>>(environment.baseUrl+'/reddit/community/communitySearch/'+searchQuery);
  }

  
  searchCommunity(searchQuery:string){
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<CommunityDto>>(environment.baseUrl+'/reddit/search/communities',options);
  }
}
