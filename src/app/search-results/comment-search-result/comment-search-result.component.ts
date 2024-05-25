import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommentService } from '../../shared/comment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TruncateHtmlTextPipe } from '../../pipe/transform/truncate-html-text.pipe';
import { searchHighlightedComment } from '../../dto/searchHighlightedComment';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comment-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-search-result.component.html',
  styleUrl: './comment-search-result.component.css'
})
export class CommentSearchResultComponent implements OnInit{

  @Output() inputFocused = new EventEmitter<void>();
  searchHighlightedComments: Array<searchHighlightedComment> = [];
  searchQuery:string=""; 

  constructor(private router:Router,private truncateHtmlPipe:TruncateHtmlTextPipe,private activatedRoute:ActivatedRoute,private commentService:CommentService,private postService:PostService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.commentService.searchComment(this.searchQuery).subscribe(comments => {
      comments.map(comment => {          
          this.searchHighlightedComments.push({comment,
          searchHighlightedComment: this.truncateHtmlPipe.highlightQueriedText(comment.comment, this.searchQuery)});
        });
      });
    });
  }

  navigateToCommunity(communityId: number|undefined) {
    if(communityId)
      this.router.navigate(['community'],{queryParams:{id:communityId}});
  }

  navigateToPost(postId:number) {
    this.router.navigate(['/post'],{queryParams:{postId}});
  }

  useInput(){
    this.inputFocused.emit();
  }
}
