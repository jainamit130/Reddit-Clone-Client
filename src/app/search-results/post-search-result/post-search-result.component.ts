import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostTileComponent } from '../../post-tile/post-tile.component';
import { searchHighlightedPost } from '../../dto/searchHighlightedPost';
import { TruncateHtmlTextPipe } from '../../pipe/transform/truncate-html-text.pipe';
import { NoSearchResultComponent } from '../no-search-result/no-search-result.component';
import { LoadingService } from '../../configuration/loading.service';

@Component({
  selector: 'app-post-search-result',
  standalone: true,
  imports: [CommonModule,PostTileComponent,NoSearchResultComponent],
  templateUrl: './post-search-result.component.html',
  styleUrl: './post-search-result.component.css'
})

export class PostSearchResultComponent implements OnInit,AfterViewInit{
  
  searchHighlightedPosts: Array<searchHighlightedPost> = [];
  searchQuery:string=""; 

  atleast1ResultFound:boolean = true;
  
  constructor(private loadingService:LoadingService,private router:Router,private truncateHtmlPipe:TruncateHtmlTextPipe,private activatedRoute:ActivatedRoute,private postService:PostService) {}

  ngAfterViewInit(): void {
    this.loadingService.setLoadingComponent(false);
  }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.postService.searchPost(this.searchQuery).subscribe(posts => {
        this.searchHighlightedPosts = posts.map(post => ({
          post,
          searchHighlightedTitle: this.truncateHtmlPipe.highlightQueriedText(post.postName, this.searchQuery)
        }));
        if(this.searchHighlightedPosts.length===0)
          this.atleast1ResultFound=false;
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
