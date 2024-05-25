import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';
import { PostDto } from '../../dto/postDto';
import { ActivatedRoute, Router } from '@angular/router';
import { PostTileComponent } from '../../post-tile/post-tile.component';
import { searchHighlightedPost } from '../../dto/searchHighlightedPost';
import { TruncateHtmlTextPipe } from '../../pipe/transform/truncate-html-text.pipe';

@Component({
  selector: 'app-post-search-result',
  standalone: true,
  imports: [CommonModule,PostTileComponent],
  templateUrl: './post-search-result.component.html',
  styleUrl: './post-search-result.component.css'
})

export class PostSearchResultComponent implements OnInit{
  
  searchHighlightedPosts: Array<searchHighlightedPost> = [];
  searchQuery:string=""; 
  
  constructor(private router:Router,private truncateHtmlPipe:TruncateHtmlTextPipe,private activatedRoute:ActivatedRoute,private postService:PostService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.postService.searchPost(this.searchQuery).subscribe(posts => {
        this.searchHighlightedPosts = posts.map(post => ({
          post,
          searchHighlightedTitle: this.truncateHtmlPipe.highlightQueriedText(post.postName, this.searchQuery)
        }));
      });
    });
  }

  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

  navigateToPost(postId:number) {
    this.router.navigate(['/post'],{queryParams:{postId}});
  }
}
