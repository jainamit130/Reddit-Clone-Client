import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';
import { FormsModule } from '@angular/forms';
import { CommunityService } from '../shared/community.service';
import { CommunitySearchDto } from '../dto/communitySearchDto';

@Component({
  selector: 'app-community-search',
  standalone: true,
  imports: [CommonModule,DetectOutsideClickDirective,FormsModule],
  templateUrl: './community-search.component.html',
  styleUrl: './community-search.component.css'
})
export class CommunitySearchComponent implements OnInit{
  @ViewChild('searchInput') searchInput!: ElementRef;
  selectedCommunity:string="";
  inputField:string="";
  activeSearch:boolean=true;
  @Input() userCommunities$:Array<CommunitySearchDto>=[];
  otherCommunities$:Array<CommunitySearchDto>=[];
  searchContainer:boolean=false;

  constructor(private communityService:CommunityService){}

  ngOnInit(): void {
    this.communityService.currentCommunityData.subscribe(currentCommunity => {
      this.selectedCommunity=currentCommunity;
    })
    if (this.selectedCommunity && this.selectedCommunity.length !== 0){
      this.activeSearch=false;
    }
  }

  focusInput() {
    if(this.searchInput)
      this.searchInput.nativeElement.focus();
  }

  clearField(){
    this.inputField="";
    this.otherCommunities$=[];
    this.focusInput();
  }

  closeSearch() {
    this.searchContainer=false;
    if(this.selectedCommunity && this.selectedCommunity.length !== 0){
      this.activeSearch=false;
    }
  }

  selectCommunity(community:string) {
    this.selectedCommunity=community;
    this.activeSearch=false;
    this.communityService.updateCommunityData(this.selectedCommunity);
  }

  openSearch(event: MouseEvent) {
    this.activeSearch=true;
    this.searchContainer=true;
    this.focusInput();
    event.stopPropagation();
  }

  onSearch(){
    if (this.inputField.trim() !== '') {
      this.communityService.communitySearch(this.inputField).subscribe(
        (results: CommunitySearchDto[]) => {
          this.otherCommunities$ = results.filter(community => {
            return !this.userCommunities$.includes(community);
          });
          //remove prefix non matching communities from userCommunities
          this.userCommunities$.filter(userCommunity =>{
            console.log(userCommunity.communityName.substring(0,this.inputField.length));
            console.log(this.inputField);
            return userCommunity.communityName.substring(0,this.inputField.length)==this.inputField;
          }); 
        },
        () => {
          console.error('Error fetching search results');
        }
      );
    } else {
      this.otherCommunities$ = [];
    }
  }
}
