import { AfterContentChecked, Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
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
import { ScreenWidthToggleDirective } from '../directives/screen-width-toggle.directive';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { SwipeDirective } from '../directives/swipe.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SwipeDirective,DetectOutsideClickDirective,ScreenWidthToggleDirective,CommonModule,VoteComponent,PostTileComponent,CommunitiesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,AfterContentChecked{
  
    posts$: Array<PostDto> = [];
    recentPosts$: Array<PostDto> = [];
    openComments: number=1;
    isLoggedIn:boolean=false;
    recentPostsVisible:boolean=false;
    isToggleActive:boolean=false;
    isCommunityToggle:boolean=false;
    isVisible:boolean=false;
    isCommunitiesVisible:boolean=false;

    constructor(private userService:UserService,private communityService: CommunityService,private authService:AuthService,private postService: PostService,private router:Router) {}

    ngAfterContentChecked(): void {
      if(this.isLoggedIn && this.recentPosts$.length > 0){
        this.recentPostsVisible=true;
      } else {
        this.recentPostsVisible=false;
      }
    }

    activateToggle(event: boolean): void {
      this.userService.updateRecentPostsToggle(event);
    }

    ngOnInit(): void {
      this.userService.isRecentPostsToggleObserver.subscribe(isActive => {
        this.isToggleActive=isActive;
        this.isVisible=!isActive;
        });

        this.userService.isToggleActiveObserver.subscribe(isActive => {
          if(isActive){
            this.isCommunityToggle=true;
            this.userService.isVisibleObserver.subscribe(isVisible => {
              if(isVisible){
                this.isCommunitiesVisible=true;
              } else {
                this.isCommunitiesVisible=false;
              }
            })
          } else {
            this.isCommunityToggle=false;
            this.isCommunitiesVisible=false;
          }
        });
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
      if (!((this.isVisible && this.isToggleActive) || (this.isCommunitiesVisible && this.isCommunityToggle))) {
      this.router.navigate(['/post'],{queryParams:{postId:postId,openedInEditMode}});
      }
    }

    navigateToCommunity(communityId: number) {
      this.router.navigate(['community'],{queryParams:{id:communityId}})
    }

    clearHistory() {
      this.userService.clearHistory().subscribe(()=>{
        this.recentPosts$=[];
      });
    }

    toggleVisibility(): void {
      this.isVisible=!this.isVisible;
    }

    closeVisibility(event: any): void {
      if (this.isToggleActive) {
          this.isVisible=false;
        } else {
          event.stopPropagation();
        }
    }
  }
