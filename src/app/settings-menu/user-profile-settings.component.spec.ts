import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSettings } from './user-profile-settings.component';

describe('SettingsMenuComponent', () => {
  let component: UserProfileSettings;
  let fixture: ComponentFixture<UserProfileSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileSettings]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserProfileSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
