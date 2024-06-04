import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { PostService } from '../shared/post.service';
import { PostDto } from '../dto/postDto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VoteComponent } from '../vote/vote.component';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { AuthService } from '../authorization/shared/auth.service';
import { CommunitiesComponent } from '../communities/communities.component';
import { CommunityService } from '../shared/community.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,VoteComponent,PostTileComponent,CommunitiesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
    posts$: Array<PostDto> = [];
    recentPosts$: Array<PostDto> = [];
    openComments: number=1;
    isLoggedIn:boolean=false;
    constructor(private userService:UserService,private communityService: CommunityService,private authService:AuthService,private postService: PostService,private router:Router) {}

    ngOnInit(): void {
      this.postService.getUserPosts().subscribe(userPosts => {
        this.postService.updateUserPosts(userPosts);
        this.postService.getAllPosts().subscribe(posts => {
          posts.map(post => {
            if(userPosts.some(userPost => userPost.postId === post.postId)){
              post.isUserPost=true;
            }
          });
          this.posts$=posts;
        });
      })
      this.authService.loggedInStatus.subscribe(isLogin => {
        this.isLoggedIn=isLogin;
        if(this.isLoggedIn){
          this.userService.getRecentPosts().subscribe(recentPosts => {
            this.recentPosts$=recentPosts.reverse();
          })
        }
      })
      this.communityService.getUserCommunities().subscribe(communities => {
        this.communityService.updateUserCommunitiesData(communities);
      });
      this.communityService.updateCommunityData("");
    }

    isCommunityJoined(communityId:number){
      return this.communityService.isJoined(communityId);
    }

    joinCommunity(communityId:number) {
      this.communityService.joinCommunity(communityId).
      subscribe(community => {
        this.communityService.addCommunity(community);
      });
    } 
  
    leaveCommunity(communityId:number) {
      this.communityService.leaveCommunity(communityId).
      subscribe(community => {
        this.communityService.removeCommunity(community.communityId);
      });
    }

    isCommentsClicked(postId:number){
      this.router.navigate(['/post'],{queryParams:{postId:postId,openComments:1}});
    }

    navigateToPost(postId:number,openedInEditMode:boolean) {
      this.router.navigate(['/post'],{queryParams:{postId:postId,openedInEditMode}});
    }

    navigateToCommunity(communityId: number) {
      this.router.navigate(['community'],{queryParams:{id:communityId}})
    }

    clearHistory() {
      this.userService.clearHistory().subscribe(()=>{
        this.recentPosts$=[];
      });
    }
  }
