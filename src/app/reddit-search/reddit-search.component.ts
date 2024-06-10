import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommunitySearchDto } from '../dto/communitySearchDto';
import { CommunityService } from '../shared/community.service';
import { CommunityDto } from '../dto/CommunityDto';
import { Router } from '@angular/router';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-reddit-search',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,DetectOutsideClickDirective],
  templateUrl: './reddit-search.component.html',
  styleUrl: './reddit-search.component.css'
})
export class RedditSearchComponent implements OnInit{

  @ViewChild('searchBar') searchInput!: ElementRef;

  searchedCommunities:Array<CommunitySearchDto>=[];
  activatedSearch:boolean=false;
  inputField:string="";

  constructor(private router:Router,private communityService: CommunityService, private userService:UserService) {}
  
  ngOnInit(): void {
    this.userService.inputFocused.subscribe(() => {
      this.searchInput.nativeElement.focus();
      this.activateSearch();
    });
    this.userService.activatedSearchStatus.subscribe(isActivated => {
      this.activatedSearch=isActivated;
    });
  }

  onSearch(){
    if (this.inputField.trim() !== '') {
      this.activateSearch();
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

  activateSearch(){
    this.userService.updateActivatedStatus(true);
  }

  deactivateSearch(){
    this.userService.updateActivatedStatus(false);
  }

  clearSearch(){
    this.deactivateSearch();
    this.searchedCommunities=[];
    this.inputField="";
  }

  navigateToCommunity(communityId: number) {
    this.clearSearch();
    this.router.navigate(['community'],{queryParams:{id:communityId}})
  }

  onEnter() {
    this.deactivateSearch();
    this.searchInput.nativeElement.blur();
    this.router.navigate(['search/posts'],{queryParams:{q:this.inputField}});
  }
}
