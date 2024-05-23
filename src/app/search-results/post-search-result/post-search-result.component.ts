import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/post.service';
import { CommonModule } from '@angular/common';
import { PostDto } from '../../dto/postDto';
import { ActivatedRoute } from '@angular/router';
import { PostTileComponent } from '../../post-tile/post-tile.component';

@Component({
  selector: 'app-post-search-result',
  standalone: true,
  imports: [CommonModule,PostTileComponent],
  templateUrl: './post-search-result.component.html',
  styleUrl: './post-search-result.component.css'
})
export class PostSearchResultComponent implements OnInit{
  
  searchQuery:string=""; 
  searchedPosts: Array<PostDto> = []
  
  constructor(private activatedRoute:ActivatedRoute,private postService:PostService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery=params['q'];
    });
    this.postService.searchPost(this.searchQuery).subscribe(posts => {
      this.searchedPosts=posts;
    });
  }
  
}
