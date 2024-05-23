import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search-result-navigation',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './search-result-navigation.component.html',
  styleUrl: './search-result-navigation.component.css'
})
export class SearchResultNavigationComponent implements AfterViewInit{
  
  @ViewChild('comments') commentsButton!: ElementRef;
  @ViewChild('posts') postsButton!: ElementRef;
  @ViewChild('communities') communitiesButton!: ElementRef;
  @ViewChild('people') peopleButton!: ElementRef;

  buttonRefs: { [key: string]: ElementRef } = {};

  currentRoute:string="posts";
  
  constructor(private router:Router) {}
  
  ngAfterViewInit(): void {
    this.buttonRefs = {
      'comments': this.commentsButton,
      'posts': this.postsButton,
      'communities': this.communitiesButton,
      'people': this.peopleButton
    };

    const urlSegments = this.router.url.split('/');
    const lastSegment = urlSegments[urlSegments.length - 1];
    this.highlightButton(lastSegment);
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
    this.router.navigate(['search/posts'],{queryParams: { q:'welcome'}});
  }

  navigateToCommentSearch() {
    this.router.navigate(['search/comments']);
  }

  navigateToCommunitySearch() {
    this.router.navigate(['search/communities']);
  }

  navigateToPeopleSearch() {
    this.router.navigate(['search/people']);
  }
}
