import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../shared/user.service';
import { PostDto } from '../dto/postDto';
import { CommonModule } from '@angular/common';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { PostService } from '../shared/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentTileComponent } from '../comment-tile/comment-tile.component';
import { AuthService } from '../authorization/shared/auth.service';
import { UserProfileDto } from '../dto/UserProfileDto';
import { TimeAgoPipe } from '../pipe/time-ago.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TimeAgoPipe,CommonModule,PostTileComponent,CommentTileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit,AfterViewInit {

  @ViewChild('comments') commentsButton!: ElementRef;
  @ViewChild('posts') postsButton!: ElementRef;

  userProfile: UserProfileDto = {
    userName: '',
    posts: [],
    comments: [],
    numberOfComments: 0,
    numberOfPosts: 0,
    joinDate: 0,
  };
  userId!: number;
  showingPosts: boolean = true;
  showingComments: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['id'] as number;
      this.getUserComments();
    });
  }

  ngAfterViewInit(): void {
    this.postsButton.nativeElement.style.backgroundColor = 'rgb(201, 216, 216)';
  }

  getUserComments() {
    if (!this.userId) {
      this.userId = this.authService.getUserId();
    }
    this.userService.getUserProfile(this.userId).subscribe(userProfile => {
      this.userProfile={
        userName:userProfile.userName,
        posts:userProfile.posts,
        comments:userProfile.comments,
        numberOfComments:userProfile.numberOfComments,
        numberOfPosts:userProfile.numberOfPosts,
        joinDate:userProfile.joinDate
      }
    });
  }

  updatePost(currentPost: PostDto) {
    this.postService.getPost(currentPost.postId).subscribe(post => {
      const index = this.userProfile.posts.findIndex(postItem => postItem.postId === currentPost.postId);
      if (index !== -1) {
        this.userProfile.posts[index] = post;
      }
    });
  }

  navigateToPost(postId:number,commentId: number | null,openedInEditMode:boolean) {
    this.router.navigate(['/post'],{queryParams:{postId:postId,commentId,openedInEditMode}});
  }
  
  showPosts() {
    this.showingPosts = true;
    this.showingComments = false;
    this.postsButton.nativeElement.style.backgroundColor = 'rgb(201, 216, 216)';
    this.commentsButton.nativeElement.style.backgroundColor = 'transparent';
  }

  showComments() {
    this.showingPosts = false;
    this.showingComments = true;
    this.commentsButton.nativeElement.style.backgroundColor = 'rgb(201, 216, 216)';
    this.postsButton.nativeElement.style.backgroundColor = 'transparent';
  }
}