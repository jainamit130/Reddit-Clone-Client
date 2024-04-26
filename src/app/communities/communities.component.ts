import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommunityDto } from '../dto/CommunityDto';
import { CommunityService } from '../shared/community.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.css'
})
export class CommunitiesComponent implements OnInit{
  communities$:Array<CommunityDto> = [];
  // @Output() shareCommunities= new EventEmitter<Array<CommunityDto>>();

  constructor(private communityService:CommunityService,private rouetr:Router){}
  
  ngOnInit(): void {
    this.communityService.getAllCommunities().subscribe(community => {
      this.communities$=community;
    });
  }
  
  createCommunity() {
    this.rouetr.navigateByUrl('/create-community');
  }
  
  openCommunity(communityId:number) {
    this.rouetr.navigate(['/community'],{queryParams: { id:communityId}});
  }
}
