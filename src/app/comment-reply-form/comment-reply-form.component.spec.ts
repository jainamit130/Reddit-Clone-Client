import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReplyFormComponent } from './comment-reply-form.component';

describe('CommentReplyFormComponent', () => {
  let component: CommentReplyFormComponent;
  let fixture: ComponentFixture<CommentReplyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentReplyFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
