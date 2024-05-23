import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSearchResultComponent } from './people-search-result.component';

describe('PeopleSearchResultComponent', () => {
  let component: PeopleSearchResultComponent;
  let fixture: ComponentFixture<PeopleSearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleSearchResultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeopleSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
