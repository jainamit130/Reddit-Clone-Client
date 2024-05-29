import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommentDto } from '../dto/commentDto';
import { CommentRequestDto } from '../dto/RequestPayload/commentRequestDto';
import { AuthService } from '../authorization/shared/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  isLoggedIn:boolean=false;

  constructor(private router:Router,private httpClient:HttpClient,private authService:AuthService) { 
    this.authService.loggedInStatus.subscribe(isLogin=>{
      this.isLoggedIn=isLogin;
    })
  }

  getAllComments(postId:number,repliesCount:number):Observable<Array<CommentDto>> {
    return this.httpClient.get<Array<CommentDto>>(environment.baseUrl+'/reddit/comments/getPostComments/'+postId+'?repliesCount='+repliesCount);
  }

  comment(commentRequest: CommentRequestDto):Observable<CommentDto> {
    if(!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      return of();
    } 
    return this.httpClient.post<CommentDto>(environment.baseUrl+'/reddit/comments/create',commentRequest)
  }

  getUserCommentsOnPost(postId:number) :Observable<Array<CommentDto>> {
    if(!this.isLoggedIn) {
      return of([]);
    }
    else{
      return this.httpClient.get<Array<CommentDto>>(environment.baseUrl+'/reddit/comments/getUserCommentOnPost/'+postId);
    }
  }

  deleteComment(commentId: number, postId: number) {
    if(!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      throw new Error("You need to login first");
    } else {
      const options = { 
        params: new HttpParams().set('postId', postId) 
      };
      return this.httpClient.post(environment.baseUrl+'/reddit/comments/deleteComment/'+commentId,null,options);
    }

  }

  getComment(commentId:number, postId:number):Observable<CommentDto>{
    const options = { 
      params: new HttpParams().set('postId', postId) 
    };
    return this.httpClient.get<CommentDto>(environment.baseUrl+'/reddit/comments/getComment/'+commentId,options);
  }

  editComment(editedComment: CommentDto):Observable<CommentDto> {
    if(!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      throw new Error("You need to login first");
    } else {
      return this.httpClient.put<CommentDto>(environment.baseUrl+'/reddit/comments/edit',editedComment)
    }
  }

  showMoreReplies(commentId: number,postId:number) {
    const options = { 
      params: new HttpParams().set('postId', postId) 
    };
    return this.httpClient.get<Array<CommentDto>>(environment.baseUrl+'/reddit/comments/getMoreReplies/'+commentId,options);
  } 

  searchComment(searchQuery:string){
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<CommentDto>>(environment.baseUrl+'/reddit/search/comments',options);
  }

  getSingleThread(postId: number, singleThreadCommentId: number) {
    const options = { 
      params: new HttpParams().set('postId', postId)
                              .set('commentId',singleThreadCommentId), 
    };
    return this.httpClient.get<CommentDto>(environment.baseUrl+'/reddit/comments/singleThread',options);
  } 
}
