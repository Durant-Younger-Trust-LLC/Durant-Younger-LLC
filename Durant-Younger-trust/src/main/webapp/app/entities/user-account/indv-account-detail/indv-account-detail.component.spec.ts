import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndvAccountDetailComponent } from './indv-account-detail.component';

describe('IndvAccountDetailComponent', () => {
  let component: IndvAccountDetailComponent;
  let fixture: ComponentFixture<IndvAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndvAccountDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndvAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
