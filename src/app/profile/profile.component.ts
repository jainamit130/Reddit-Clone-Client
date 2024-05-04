import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { PostDto } from '../dto/postDto';
import { CommentDto } from '../dto/commentDto';
import { CommonModule } from '@angular/common';
import { PostTileComponent } from '../post-tile/post-tile.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,PostTileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  userPosts:Array<PostDto> =[];
  userComments:Array<CommentDto> =[];
  constructor(private userService:UserService){}

  ngOnInit(): void {
    this.getUserComments();
  }

  getUserComments(){
    this.userService.getUserProfile().subscribe(userProfile => {
      this.userPosts=userProfile.posts;
      this.userComments=userProfile.comments;
    });
  }
}
