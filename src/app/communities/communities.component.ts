import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommunityDto } from '../dto/CommunityDto';
import { CommunityService } from '../shared/community.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScreenWidthToggleDirective } from '../directives/screen-width-toggle.directive';
import { UserService } from '../shared/user.service';
import { DetectOutsideClickDirective } from '../directives/detect-outside-click.directive';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [CommonModule,ScreenWidthToggleDirective,DetectOutsideClickDirective],
  templateUrl: './communities.component.html',
  styleUrl: './communities.component.css'
})
export class CommunitiesComponent implements OnInit,AfterViewInit {
  communities$: CommunityDto[] = [];
  isVisible = true;

  constructor(private cdr: ChangeDetectorRef,private communityService: CommunityService, private router: Router,private userService:UserService) {}

  ngAfterViewInit(): void {
    this.userService.isVisibleObserver.subscribe(isVisible => {
      this.isVisible=isVisible;
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    this.communityService.getAllCommunities().subscribe(community => {
      this.communities$ = community;
    });
  }

  createCommunity(): void {
    this.router.navigateByUrl('/create-community');
  }

  openCommunity(communityId: number,event: any): void {
    this.closeVisibility(event);
    this.router.navigate(['/community'], { queryParams: { id: communityId }, replaceUrl: true });
  }

  closeVisibility(event: any): void {
    this.userService.isToggleActiveObserver.subscribe(isToggle => {
      if (isToggle) {
        this.userService.updateIsVisible(false);
      } else {
        event.stopPropagation();
      }
    });
  }
}