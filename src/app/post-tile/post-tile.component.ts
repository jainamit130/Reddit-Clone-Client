import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PostDto } from '../dto/postDto';
import { PostService } from '../shared/post.service';
import { VoteComponent } from '../vote/vote.component';
import { TruncateHtmlTextPipe } from '../transform/truncate-html-text.pipe';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-tile',
  standalone: true,
  imports: [VoteComponent,CommonModule],
  templateUrl: './post-tile.component.html',
  styleUrl: './post-tile.component.css'
})
export class PostTileComponent implements OnChanges {
  @Input() post!:PostDto;
  @Input() showCommunityName: boolean=true;
  trucatedDescription!:string;
  @Output() updatePost = new EventEmitter<PostDto>();
  
  constructor(private router:Router,private postService: PostService,private truncateHtmlPipe:TruncateHtmlTextPipe) {}
  
  ngOnChanges(): void {
    this.postService.getPost(this.post.postId).subscribe(post => {
      this.post=post;
      this.trucatedDescription=this.truncateHtmlPipe.transform(this.post.description,200);
    });    
  }
  
  update(post:PostDto){
    console.log("broooo");
    this.updatePost.emit(post);
  }
  
  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }
}
