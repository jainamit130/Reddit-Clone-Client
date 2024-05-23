import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultNavigationComponent } from './search-result-navigation.component';

describe('SearchResultNavigationTsComponent', () => {
  let component: SearchResultNavigationComponent;
  let fixture: ComponentFixture<SearchResultNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchResultNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
