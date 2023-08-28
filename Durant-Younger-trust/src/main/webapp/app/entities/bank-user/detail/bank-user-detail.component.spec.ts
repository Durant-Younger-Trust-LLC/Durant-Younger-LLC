import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BankUserDetailComponent } from './bank-user-detail.component';

describe('BankUser Management Detail Component', () => {
  let comp: BankUserDetailComponent;
  let fixture: ComponentFixture<BankUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ bankUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BankUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BankUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load bankUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.bankUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
