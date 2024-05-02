import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDto } from '../dto/postDto';
import { CommentComponent } from '../comment/comment.component';
import { VoteComponent } from '../vote/vote.component';
import { CommunitiesComponent } from '../communities/communities.component';
import { PostService } from '../shared/post.service';
import { CommunityService } from '../shared/community.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommunitiesComponent,CommentComponent,VoteComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit{
  post!:PostDto;
  sanitizedDescription!: SafeHtml;
  constructor(private sanitizer: DomSanitizer,private communityService:CommunityService,private postService:PostService,private activatedRoute: ActivatedRoute){}

  ngOnInit(): void {
    const postJson = this.activatedRoute.snapshot.queryParams['post'];
    this.post = JSON.parse(postJson);

    this.communityService.getCommunityOfPost(this.post.postId)
    .subscribe((community) => {this.communityService.updateCommunityData(community.communityName);});
    
    this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.post.description);
  }

  updatePost(){
    this.postService.getPost(this.post.postId).subscribe(updatedPost=> {
        this.post = updatedPost;
    })
  }
  
}
