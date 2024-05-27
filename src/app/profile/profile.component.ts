import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { PostDto } from '../dto/postDto';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { PostService } from '../shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';
import { AuthService } from '../authorization/shared/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,PostTileComponent,CommentTileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userPosts:Array<PostDto> =[];
  userComments:Array<CommentDto> =[];
  userId!:number;
  constructor(private userService:UserService,private authService:AuthService,private postService: PostService,private router:Router,private activatedRoute:ActivatedRoute){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'] as number;
      this.getUserComments();
    })
  }

  getUserComments(){
    if(!this.userId){
      this.userId = this.authService.getUserId();
    }
    this.userService.getUserProfile(this.userId).subscribe(userProfile => {
      this.userPosts=userProfile.posts;
      this.userComments=userProfile.comments;
    });
  }

  updatePost(currentPost:PostDto){
    this.postService.getPost(currentPost.postId).subscribe(post=> {
      const index = this.userPosts.findIndex(postItem => postItem.postId === currentPost.postId);
       if (index !== -1) {
        this.userPosts[index] = post;
      }
    })
  }

  navigateToPost(postId:number,commentId:number|null) {
    this.router.navigate(['/post'],{queryParams:{postId,commentId}});
  }
}
