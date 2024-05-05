import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { PostDto } from '../dto/postDto';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { PostService } from '../shared/post.service';
import { Router } from '@angular/router';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';

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
  constructor(private userService:UserService,private postService: PostService,private router:Router){}

  ngOnInit(): void {
    this.getUserComments();
  }

  getUserComments(){
    this.userService.getUserProfile().subscribe(userProfile => {
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

  navigateToPost(postId:number) {
    this.router.navigate(['/post'],{queryParams:{postId}});
  }
}
