import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostDto } from '../dto/postDto';
import { CreatePostRequestPayload } from '../dto/RequestPayload/create-post-request-payload';

@Injectable({
  providedIn: 'root'
})
export class PostService {
    
  constructor(private httpClient:HttpClient) { }
  
  getAllPosts():Observable<Array<PostDto>> {
    return this.httpClient.get<Array<PostDto>>('http://localhost:8080/reddit/posts/');
  }

  getPost(postId:number):Observable<PostDto> {
    return this.httpClient.get<PostDto>('http://localhost:8080/reddit/posts/getPost/'+postId);
  }

  createPost(createPostPayload: CreatePostRequestPayload){
    return this.httpClient.post('http://localhost:8080/reddit/posts/create',createPostPayload);
  }

}