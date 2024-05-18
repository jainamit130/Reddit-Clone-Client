import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDto } from '../dto/postDto';
import { CommentComponent } from '../comment/comment.component';
import { VoteComponent } from '../vote/vote.component';
import { CommunitiesComponent } from '../communities/communities.component';
import { PostService } from '../shared/post.service';
import { CommunityService } from '../shared/community.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule,CommunitiesComponent,CommentComponent,VoteComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  post!:PostDto;
  postId!:number;
  sanitizedDescription!: SafeHtml;
  constructor(private router: Router,private sanitizer: DomSanitizer,private communityService:CommunityService,private postService:PostService,private activatedRoute:ActivatedRoute){
    this.activatedRoute.queryParams.subscribe(params => {
      this.postId=params['postId'];
      
      this.postService.getPost(this.postId).subscribe(post => {
        this.post=post;
        this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.post.description);
      });
      this.communityService.getCommunityOfPost(this.postId)
      .subscribe((community) => {this.communityService.updateCommunityData(community.communityName);});      
    }
    );
  }

  updatePost(){
    this.postService.getPost(this.post.postId).subscribe(updatedPost=> {
        this.post = updatedPost;
    })
  }
  
  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

}
