import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommunityService } from '../shared/community.service';
import { CommonModule } from '@angular/common';
import { CommunityDto } from '../dto/CommunityDto';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDto } from '../dto/postDto';
import { CommunitiesComponent } from '../communities/communities.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, PostTileComponent,CommunitiesComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit{
  @Input() communityId!:number;
  sanitizedDescription!: SafeHtml;
  community:CommunityDto;
  userCommunities:Array<CommunityDto> = [];
  joinButton:Boolean=true;
  constructor(private sanitizer: DomSanitizer,private router:Router,private communityService:CommunityService,private activatedRoute:ActivatedRoute) {
    this.community={
      communityId: 0,
    communityName: "",
    description:"",
    numberOfPosts: 0,
    numberOfMembers: 0,
    posts: []
    }
  }

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe(params => {this.communityId=params['id']})
    
    this.communityService.getCommunityWithPosts(this.communityId).subscribe(data => {
      this.community=data;
      this.communityService.updateCommunityData(this.community.communityName);
      this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.community.description);
    
      this.communityService.getUserCommunities().subscribe(communities => {
        this.communityService.updateUserCommunitiesData(communities);
        this.userCommunities=communities;
        if(this.userCommunities.some(community => community.communityId === this.community.communityId))
          this.joinButton=false;
        else  
          this.joinButton=true;
      });
    }); 
  }

  navigateToPost(postId:number) {
    this.router.navigate(['/post'],{queryParams:{postId}});
  }

  navigateToCreate() {
    this.router.navigateByUrl('/submit');
  }

  joinCommunity() {
    this.communityService.joinComunity(this.communityId).
    subscribe(community => {
      this.userCommunities.push(community);
      this.communityService.updateUserCommunitiesData(this.userCommunities);
      this.joinButton=false;
    });
  } 

  leaveCommunity() {
    this.communityService.leaveCommunity(this.communityId).
    subscribe(community => {
      this.userCommunities = this.userCommunities.filter(item => item !== community);
      this.communityService.updateUserCommunitiesData(this.userCommunities);
      this.joinButton=true;
    });
  }
}
