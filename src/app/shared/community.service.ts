import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityDto } from '../dto/CommunityDto';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateCommunityRequestPayload } from '../dto/RequestPayload/create-community-request-payload';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  private communityData = new BehaviorSubject<any>(null);
  currentCommunityData = this.communityData.asObservable();

  constructor(private httpClient:HttpClient) { }

  updateCommunityData(data: any) {
    this.communityData.next(data);
  }

  getAllCommunities():Observable<Array<CommunityDto>>{
    return this.httpClient.get<Array<CommunityDto>>('http://localhost:8080/reddit/community/getAllCommunities');
  }

  joinComunity(communityDto:CommunityDto):Observable<CommunityDto>{
    return this.httpClient.post<CommunityDto>('http://localhost:8080/reddit/community/join',communityDto);
  }

  leaveCommunity(communityDto:CommunityDto):Observable<CommunityDto>{
    return this.httpClient.post<CommunityDto>('http://localhost:8080/reddit/community/leave',communityDto);
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
}
