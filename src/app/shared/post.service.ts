import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, filter, of, switchMap } from 'rxjs';
import { PostDto } from '../dto/postDto';
import { CreatePostRequestPayload } from '../dto/RequestPayload/create-post-request-payload';
import { environment } from '../../environment';
import { Router } from '@angular/router';
import { AuthService } from '../authorization/shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {   
  
  private userPosts = new BehaviorSubject<Array<PostDto>|null>(null);
  userPostsListener = this.userPosts.asObservable();

  isLoggedIn:boolean=false;
  constructor(private router:Router,private httpClient:HttpClient,private authService:AuthService) { 
    this.authService.loggedInStatus.subscribe(isLogin=>{
      this.isLoggedIn=isLogin;
    })
  }

  updateUserPosts(postsOfUser: Array<PostDto>){
    this.userPosts.next(postsOfUser);
  }
  
  getAllPosts():Observable<Array<PostDto>> {
    return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'posts/');
  }

  getPost(postId:number):Observable<PostDto> {
    return this.httpClient.get<PostDto>(environment.baseUrl+'posts/getPost/'+postId);
  }

  createPost(createPostPayload: CreatePostRequestPayload):Observable<PostDto>{
    return this.httpClient.post<PostDto>(environment.baseUrl+'posts/create',createPostPayload);
  }

  searchPost(searchQuery:string){
    const options = {
      params: new HttpParams().set('q', searchQuery) 
    }
    return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'search/posts',options);
  }


  editPost(post: any) {
    if(!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      throw new Error("You need to login first");
    } else {
      return this.httpClient.put<PostDto>(environment.baseUrl+'posts/edit',post)
    }
  }

  deletePost(postId: number) {
    if(!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
      throw new Error("You need to login first");
    } else {
      return this.httpClient.post(environment.baseUrl+'posts/deletePost/'+postId,null);
    }
  }

  getUserPosts(){
    if(!this.isLoggedIn) {
      return of([]);
    }
    else{
      return this.httpClient.get<Array<PostDto>>(environment.baseUrl+'posts/getUserPosts');
    }
  }

  loadUserPosts() {
    return this.userPostsListener.pipe(
      filter(posts => posts === null), 
      switchMap(() => this.getUserPosts()), 
      catchError(error => {
        console.error('Error loading user posts:', error);
        return of([]); 
      }),
      switchMap(posts => {
        this.userPosts.next(posts);
        return of(posts);
      })
    );
  }
}
