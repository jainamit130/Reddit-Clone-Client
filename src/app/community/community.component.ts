import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommunityService } from '../shared/community.service';
import { CommonModule } from '@angular/common';
import { CommunityDto } from '../dto/CommunityDto';
import { PostTileComponent } from '../post-tile/post-tile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunitiesComponent } from '../communities/communities.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserService } from '../shared/user.service';
import { LoadingService } from '../configuration/loading.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, PostTileComponent,CommunitiesComponent],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css'
})
export class CommunityComponent implements OnInit,AfterViewInit{
  @Input() communityId!:number;

  sanitizedDescription!: SafeHtml;
  truncatedDescription!: SafeHtml;
  isDescriptionTruncated: boolean = false;
  readMore: boolean = false;
  community:CommunityDto;
  joinButton:Boolean=true;

  constructor(private loadingService:LoadingService,private sanitizer: DomSanitizer,private router:Router,private communityService:CommunityService,private userService:UserService,private activatedRoute:ActivatedRoute) {
    this.community={
      communityId: 0,
    communityName: "",
    description:"",
    numberOfPosts: 0,
    numberOfMembers: 0,
    posts: []
    }
  }

  ngAfterViewInit(): void {
    this.loadingService.setLoadingComponent(false);
  }

  ngOnInit(): void {
    this.userService.updateSearchQuery("");
    this.activatedRoute.queryParams.subscribe(params => {this.communityId=params['id']})
    
    this.communityService.getCommunityWithPosts(this.communityId).subscribe(data => {
      this.community=data;
      this.communityService.updateCommunityData(this.community.communityName);
      this.sanitizedDescription=this.sanitizer.bypassSecurityTrustHtml(this.community.description);
      this.checkDescriptionTruncate();
      this.communityService.getUserCommunities().subscribe(communities => {
        this.communityService.updateUserCommunitiesData(communities);
        if(communities.some(community => community.communityId === this.community.communityId))
          this.joinButton=false;
        else  
          this.joinButton=true;
      });
    }); 
  }

  checkDescriptionTruncate() {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = this.community.description;
    const wordCount = tempElement.innerText.split(' ').length;

    if (window.innerWidth <= 1170 && wordCount > 50) {
      this.isDescriptionTruncated = true;
      const truncatedText = tempElement.innerText.split(' ').slice(0, 100).join(' ') + '...';
      this.truncatedDescription = this.sanitizer.bypassSecurityTrustHtml(truncatedText);
    }
  }

  toggleReadMore() {
    this.readMore = !this.readMore;
    if (this.readMore) {
      this.truncatedDescription = this.sanitizedDescription;
    } else {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = this.community.description;
      const truncatedText = tempElement.innerText.split(' ').slice(0, 200).join(' ') + '...';
      this.truncatedDescription = this.sanitizer.bypassSecurityTrustHtml(truncatedText);
    }
  }

  navigateToPost(postId:number,openedInEditMode:boolean) {
    this.router.navigate(['/post'],{queryParams:{postId:postId,openedInEditMode}});
  }

  navigateToCreate() {
    this.router.navigateByUrl('/submit');
  }

  joinCommunity() {
    this.communityService.joinCommunity(this.communityId).
    subscribe(community => {
      this.communityService.addCommunity(community);
      this.joinButton=false;
    });
  } 

  leaveCommunity() {
    this.communityService.leaveCommunity(this.communityId).
    subscribe(community => {
      this.communityService.leaveCommunity(community.communityId);
      this.joinButton=true;
    });
  }
}
