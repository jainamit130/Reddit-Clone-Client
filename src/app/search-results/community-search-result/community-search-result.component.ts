import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { searchHighlightedCommunity } from '../../dto/searchHighlightedCommunity';
import { TruncateHtmlTextPipe } from '../../pipe/transform/truncate-html-text.pipe';
import { CommunityService } from '../../shared/community.service';
import { CommonModule } from '@angular/common';
import { NoSearchResultComponent } from '../no-search-result/no-search-result.component';

@Component({
  selector: 'app-community-search-result',
  standalone: true,
  imports: [CommonModule,NoSearchResultComponent],
  templateUrl: './community-search-result.component.html',
  styleUrl: './community-search-result.component.css'
})
export class CommunitySearchResultComponent implements OnInit{

  searchHighlightedCommunities: Array<searchHighlightedCommunity> = [];
  searchQuery:string=""; 

  atleast1ResultFound:boolean = true;

  constructor(private router:Router,private activatedRoute:ActivatedRoute,private communityService:CommunityService,private truncateHtmlPipe:TruncateHtmlTextPipe) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
      this.communityService.searchCommunity(this.searchQuery).subscribe(communities => {
        this.searchHighlightedCommunities = communities.map(community => ({
          community,
          searchHighlightedCommunity: `u/${this.truncateHtmlPipe.highlightQueriedText(community.communityName, this.searchQuery)}`,
          searchHighlightedCommunityDescription: this.truncateHtmlPipe.highlightQueriedText(community.description,this.searchQuery)
        }));
        if(this.searchHighlightedCommunities.length===0)
          this.atleast1ResultFound=false;
      });
    });
  }

  navigateToCommunity(communityId: number) {
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }
}
