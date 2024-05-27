import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto } from '../dto/CommunityDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateCommunityRequestPayload } from '../dto/RequestPayload/create-community-request-payload';
import { CommunitySearchDto } from '../dto/communitySearchDto';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private communityData = new BehaviorSubject<any>(null);
  currentCommunityData = this.communityData.asObservable();

  private userCommunitiesSubject = new BehaviorSubject<Array<CommunityDto>>([]);
  currentUserCommunities = this.userCommunitiesSubject.asObservable();

  constructor(private httpClient:HttpClient) { }

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
    return this.httpClient.get<Array<CommunityDto>>('http://localhost:8080/reddit/community/getAllCommunities');
  }

  joinComunity(communityId:number):Observable<CommunityDto>{
    return this.httpClient.post<CommunityDto>('http://localhost:8080/reddit/community/join/'+communityId,null);
  }

  leaveCommunity(communityId:number):Observable<CommunityDto>{
    return this.httpClient.post<CommunityDto>('http://localhost:8080/reddit/community/leave/'+communityId,null);
  }

  getUserCommunities():Observable<Array<CommunityDto>>{
    return this.httpClient.get<Array<CommunityDto>>('http://localhost:8080/reddit/community/getUserCommunities');
  }

  createCommunity(createCommunityRequest: CreateCommunityRequestPayload):Observable<CommunityDto> {
    return this.httpClient.post<CommunityDto>('http://localhost:8080/reddit/community/create',createCommunityRequest);
  }

  getCommunity(communityId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>('http://localhost:8080/reddit/community/getCommunity/'+communityId);
  }

  getCommunityOfPost(postId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>('http://localhost:8080/reddit/community/getCommunityOfPost/'+postId);
  }

  getCommunityWithPosts(communityId:number):Observable<CommunityDto> {
    return this.httpClient.get<CommunityDto>('http://localhost:8080/reddit/community/getCommunityWithPosts/'+communityId);
  }

  communitySearch(searchQuery: string):Observable<Array<CommunitySearchDto>> {
    return this.httpClient.get<Array<CommunitySearchDto>>('http://localhost:8080/reddit/community/communitySearch/'+searchQuery);
  }

  
  searchCommunity(searchQuery:string){
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<CommunityDto>>('http://localhost:8080/reddit/search/communities',options);
  }
}
