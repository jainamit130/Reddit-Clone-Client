import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { PostService } from '../shared/post.service';
import { PostDto } from '../dto/postDto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VoteComponent } from '../vote/vote.component';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { AuthService } from '../authorization/shared/auth.service';
import { CommunitiesComponent } from '../communities/communities.component';
import { CommunityDto } from '../dto/CommunityDto';
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

    constructor(private communityService: CommunityService,private authService:AuthService,private postService: PostService,private router:Router){
      // this.postService.getAllPosts().subscribe(post => {
      //   this.posts$=post;
      // });
    }

    ngOnInit(): void {
      this.postService.getAllPosts().subscribe(post => {
        this.posts$=post;
      });
      this.communityService.getUserCommunities().subscribe(communities => {
        this.communityService.updateUserCommunitiesData(communities);
      });
      this.communityService.updateCommunityData("");
    }

    updatePost(currentPost:PostDto){
      this.postService.getPost(currentPost.postId).subscribe(post=> {
        const index = this.posts$.findIndex(postItem => postItem.postId === currentPost.postId);
         if (index !== -1) {
          this.posts$[index] = post;
        }
      })
    }

    navigateToPost(currentPost:PostDto) {
      const postJson = JSON.stringify(currentPost);
      this.router.navigate(['/post'],{queryParams:{post:postJson}});
    }
}
