import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-search-result-navigation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './search-result-navigation.component.html',
  styleUrl: './search-result-navigation.component.css'
})
export class SearchResultNavigationComponent implements OnInit,AfterViewInit{

  searchQuery: string = "";
  currentRoute: string = "";
  
  @ViewChild('comments') commentsButton!: ElementRef;
  @ViewChild('posts') postsButton!: ElementRef;
  @ViewChild('communities') communitiesButton!: ElementRef;
  @ViewChild('people') peopleButton!: ElementRef;

  buttonRefs: { [key: string]: ElementRef } = {};

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.searchQuery = params['q'];
    })
  }

  ngAfterViewInit(): void {
    this.userService.routeStatus.subscribe(route => {
      this.currentRoute = route;
    })
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

  navigateToSearch(searchType: string): void {
    this.userService.updateRoute(searchType);
    this.router.navigate(['/search', searchType], { queryParams: { q: this.searchQuery } });
  }
}