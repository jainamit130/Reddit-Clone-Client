import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSearchResultComponent } from './comment-search-result.component';

describe('CommentSearchResultComponent', () => {
  let component: CommentSearchResultComponent;
  let fixture: ComponentFixture<CommentSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentSearchResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
