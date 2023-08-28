import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BankUserService } from '../service/bank-user.service';

import { BankUserComponent } from './bank-user.component';

describe('BankUser Management Component', () => {
  let comp: BankUserComponent;
  let fixture: ComponentFixture<BankUserComponent>;
  let service: BankUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'bank-user', component: BankUserComponent }]), HttpClientTestingModule],
      declarations: [BankUserComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(BankUserComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankUserComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BankUserService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.bankUsers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bankUserService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBankUserIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBankUserIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
