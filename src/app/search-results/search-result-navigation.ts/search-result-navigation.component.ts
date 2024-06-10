import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
    });
    this.currentRoute= this.extractRouteString(this.router.url);
  }

  extractRouteString(url: string): string {
    const searchString = 'search/';
    const start = url.indexOf(searchString) + searchString.length;
    const end = url.indexOf('?');
    
    if (start !== -1 && end !== -1) {
      return url.substring(start, end);
    }
    return '';
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
      buttonRef.nativeElement.style.backgroundColor = '#494848';
      buttonRef.nativeElement.style.color= "white";
    }
  }

  navigateToSearch(searchType: string): void {
    this.router.navigate(['/search', searchType], { queryParams: { q: this.searchQuery } });
  }
}