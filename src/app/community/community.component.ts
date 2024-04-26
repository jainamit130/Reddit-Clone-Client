import { Component, Input, OnInit } from '@angular/core';
import { CommunityService } from '../shared/community.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../shared/post.service';
import { CommentDto } from '../dto/commentDto';
import { CommunityDto } from '../dto/CommunityDto';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, PostTileComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit{
  @Input() communityId!:number;
  community!:CommunityDto;
  constructor(private communityService:CommunityService,private activatedRoute:ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {this.communityId=params['id']})
    this.communityService.getCommunity(this.communityId).subscribe(data => {
      this.community=data;
      console.log(this.community)
      this.communityService.updateCommunityData(this.community);
    });
  }
}
