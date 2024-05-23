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

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,VoteComponent,PostTileComponent,CommunitiesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    posts$: Array<PostDto> = [];
    openComments: number=1;
    constructor(private communityService: CommunityService,private authService:AuthService,private postService: PostService,private router:Router) {}

    ngOnInit(): void {
      this.postService.getAllPosts().subscribe(post => {
        this.posts$=post;
      });
      this.communityService.getUserCommunities().subscribe(communities => {
        this.communityService.updateUserCommunitiesData(communities);
      });
      this.communityService.updateCommunityData("");
    }

    isCommentsClicked(postId:number){
      this.router.navigate(['/post'],{queryParams:{postId:postId,openComments:1}});
    }

    navigateToPost(postId:number) {
      this.router.navigate(['/post'],{queryParams:{postId:postId}});
    }
}
