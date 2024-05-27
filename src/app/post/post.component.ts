import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDto } from '../dto/postDto';
import { CommentComponent } from '../comment/comment.component';
import { VoteComponent } from '../vote/vote.component';
import { CommunitiesComponent } from '../communities/communities.component';
import { PostService } from '../shared/post.service';
import { CommunityService } from '../shared/community.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from '../pipe/time-ago.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [TimeAgoPipe,CommonModule,CommunitiesComponent,CommentComponent,VoteComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent {
  singleThreadCommentId:number|null=null;
  post!:PostDto;
  postId!:number;
  sanitizedDescription!: SafeHtml;
  openComments:boolean=false;

  @ViewChild('comments') myElementRef!: ElementRef;

  constructor(private router: Router,private sanitizer: DomSanitizer,private communityService:CommunityService,private postService:PostService,private activatedRoute:ActivatedRoute){
    this.activatedRoute.queryParams.subscribe(params => {
      this.postId=params['postId'];
      this.singleThreadCommentId=params['commentId'];
      this.postService.getPost(this.postId).subscribe(post => {
        this.post=post;
        this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.post.description);
      });
      if(params['openComments'])
        this.openComments=true;
      this.communityService.getCommunityOfPost(this.postId)
      .subscribe((community) => {this.communityService.updateCommunityData(community.communityName);});      
    }
    );
  }

  checkScrollToComments(){
      if (this.openComments && this.myElementRef) {
        this.scrollToComments(this.myElementRef.nativeElement);
      }
  }

  updatePost(isForComment:boolean){
    if(!isForComment){
      this.postService.getPost(this.post.postId).subscribe(updatedPost=> {
          this.post = updatedPost;
      });
    }
  }
  
  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

  scrollToComments(el: HTMLElement) {
    el.scrollIntoView();
  }

  openProfile(userId:number) {
    this.router.navigate(["/profile"],{queryParams:{id:userId}});
  }
}
