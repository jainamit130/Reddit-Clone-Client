import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedditSearchComponent } from './reddit-search.component';

describe('RedditSearchComponent', () => {
  let component: RedditSearchComponent;
  let fixture: ComponentFixture<RedditSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedditSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RedditSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
