import { HttpClient } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDto } from '../dto/commentDto';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  
  constructor(private httpClient:HttpClient) { }

  getAllComments(postId:number):Observable<Array<CommentDto>> {
    return this.httpClient.get<Array<CommentDto>>('http://localhost:8080/reddit/comments/getPostComments?postId='+postId);
  }

  comment(commentRequest: CommentDto) {
    return this.httpClient.post('http://localhost:8080/reddit/comments/create',commentRequest)
  }

  getUserCommentsOnPost(postId:number) :Observable<Array<CommentDto>> {
    return this.httpClient.get<Array<CommentDto>>('http://localhost:8080/reddit/comments/getUserCommentOnPost/'+postId);
  }
}
