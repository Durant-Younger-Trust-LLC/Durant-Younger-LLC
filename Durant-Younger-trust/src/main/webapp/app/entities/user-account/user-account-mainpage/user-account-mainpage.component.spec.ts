import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountMainpageComponent } from './user-account-mainpage.component';

describe('UserAccountMainpageComponent', () => {
  let component: UserAccountMainpageComponent;
  let fixture: ComponentFixture<UserAccountMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAccountMainpageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAccountMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
