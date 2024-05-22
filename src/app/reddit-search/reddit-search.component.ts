import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunitySearchDto } from '../dto/communitySearchDto';
import { CommunityService } from '../shared/community.service';
import { CommunityDto } from '../dto/CommunityDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reddit-search',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './reddit-search.component.html',
  styleUrl: './reddit-search.component.css'
})
export class RedditSearchComponent {

  searchedCommunities:Array<CommunitySearchDto>=[];
  activeSearch:boolean=false;
  inputField:string="";

  constructor(private router:Router,private communityService: CommunityService) {}

  onSearch(){
    if (this.inputField.trim() !== '') {
      this.activeSearch=true;
      this.communityService.communitySearch(this.inputField).subscribe(
        results => {
          this.searchedCommunities=results;
        },
        () => {
          console.error('Error fetching search results');
        }
      );
    } else {
      this.clearSearch();
    }
  }

  clearSearch(){
    this.activeSearch=false;
    this.searchedCommunities=[];
    this.inputField="";
  }

  navigateToCommunity(communityId: number) {
    this.clearSearch();
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

  onEnter() {
    this.clearSearch();
    this.router.navigate(['search']);
  }
}
