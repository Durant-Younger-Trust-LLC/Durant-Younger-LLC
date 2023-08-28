import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BankTransactionService } from '../service/bank-transaction.service';

import { BankTransactionComponent } from './bank-transaction.component';

describe('BankTransaction Management Component', () => {
  let comp: BankTransactionComponent;
  let fixture: ComponentFixture<BankTransactionComponent>;
  let service: BankTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'bank-transaction', component: BankTransactionComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [BankTransactionComponent],
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
      .overrideTemplate(BankTransactionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankTransactionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BankTransactionService);

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
    expect(comp.bankTransactions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bankTransactionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBankTransactionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBankTransactionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
