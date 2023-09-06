import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountNewComponent } from './user-account-new.component';

describe('UserAccountNewComponent', () => {
  let component: UserAccountNewComponent;
  let fixture: ComponentFixture<UserAccountNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
