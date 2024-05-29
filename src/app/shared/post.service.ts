import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostDto } from '../dto/postDto';
import { CreatePostRequestPayload } from '../dto/RequestPayload/create-post-request-payload';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
    
  constructor(private httpClient:HttpClient) { }
  
  getAllPosts():Observable<Array<PostDto>> {
    return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'/reddit/posts/');
  }

  getPost(postId:number):Observable<PostDto> {
    return this.httpClient.get<PostDto>(environment.baseUrl+'/reddit/posts/getPost/'+postId);
  }

  createPost(createPostPayload: CreatePostRequestPayload):Observable<PostDto>{
    return this.httpClient.post<PostDto>(environment.baseUrl+'/reddit/posts/create',createPostPayload);
  }

  searchPost(searchQuery:string){
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'/reddit/search/posts',options);
  }

}
