import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-search-result-navigation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './search-result-navigation.component.html',
  styleUrl: './search-result-navigation.component.css'
})
export class SearchResultNavigationComponent implements OnInit,AfterViewInit{

  searchQuery:string="";

  routeConfig:any = {
    'posts': this.navigateToPostSearch,
    'comments': this.navigateToCommentSearch,
    'communities':this.navigateToCommunitySearch,
    'people':this.navigateToPeopleSearch
  };

  currentRoute:string="";

  @ViewChild('comments') commentsButton!: ElementRef;
  @ViewChild('posts') postsButton!: ElementRef;
  @ViewChild('communities') communitiesButton!: ElementRef;
  @ViewChild('people') peopleButton!: ElementRef;

  buttonRefs: { [key: string]: ElementRef } = {};

  constructor(private router:Router,private activatedRoute:ActivatedRoute, private userService:UserService) {}
  
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery=params['q'];
      this.userService.routeStatus.subscribe(route => {
        this.currentRoute=route;
        const selectedFunction = (this.routeConfig as any)[this.currentRoute];
        if (selectedFunction) {
          selectedFunction(); 
        } else {
          console.error('Search not found');
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.buttonRefs = {
      'comments': this.commentsButton,
      'posts': this.postsButton,
      'communities': this.communitiesButton,
      'people': this.peopleButton
    };
    this.highlightButton(this.currentRoute);
  }

  getButtonRef(key: string): ElementRef | undefined {
    return this.buttonRefs[key];
  }

  highlightButton(key: string): void {
    const buttonRef = this.getButtonRef(key);
    if (buttonRef) {
      buttonRef.nativeElement.style.backgroundColor = 'rgb(201, 216, 216)';
    }
  }

  navigateToPostSearch() {
    this.userService.updateRoute("posts");
    this.router.navigate(['search/posts'],{queryParams: { q:this.searchQuery}});
  }

  navigateToCommentSearch() {
    this.userService.updateRoute("comments");
    this.router.navigate(['search/comments'],{queryParams: { q:this.searchQuery}});
  }

  navigateToCommunitySearch() {
    this.userService.updateRoute("communities");
    this.router.navigate(['search/communities'],{queryParams: { q:this.searchQuery}});
  }

  navigateToPeopleSearch() {
    this.userService.updateRoute("people");
    this.router.navigate(['search/people'],{queryParams: { q:this.searchQuery}});
  }

}
