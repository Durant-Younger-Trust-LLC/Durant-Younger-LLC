import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankTransactionFormService } from './bank-transaction-form.service';
import { BankTransactionService } from '../service/bank-transaction.service';
import { IBankTransaction } from '../bank-transaction.model';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';
import { BankAccountService } from 'app/entities/bank-account/service/bank-account.service';

import { BankTransactionUpdateComponent } from './bank-transaction-update.component';

describe('BankTransaction Management Update Component', () => {
  let comp: BankTransactionUpdateComponent;
  let fixture: ComponentFixture<BankTransactionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankTransactionFormService: BankTransactionFormService;
  let bankTransactionService: BankTransactionService;
  let bankAccountService: BankAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankTransactionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BankTransactionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankTransactionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankTransactionFormService = TestBed.inject(BankTransactionFormService);
    bankTransactionService = TestBed.inject(BankTransactionService);
    bankAccountService = TestBed.inject(BankAccountService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BankAccount query and add missing value', () => {
      const bankTransaction: IBankTransaction = { id: 456 };
      const user: IBankAccount = { id: 74117 };
      bankTransaction.user = user;

      const bankAccountCollection: IBankAccount[] = [{ id: 86507 }];
      jest.spyOn(bankAccountService, 'query').mockReturnValue(of(new HttpResponse({ body: bankAccountCollection })));
      const additionalBankAccounts = [user];
      const expectedCollection: IBankAccount[] = [...additionalBankAccounts, ...bankAccountCollection];
      jest.spyOn(bankAccountService, 'addBankAccountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankTransaction });
      comp.ngOnInit();

      expect(bankAccountService.query).toHaveBeenCalled();
      expect(bankAccountService.addBankAccountToCollectionIfMissing).toHaveBeenCalledWith(
        bankAccountCollection,
        ...additionalBankAccounts.map(expect.objectContaining)
      );
      expect(comp.bankAccountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bankTransaction: IBankTransaction = { id: 456 };
      const user: IBankAccount = { id: 3091 };
      bankTransaction.user = user;

      activatedRoute.data = of({ bankTransaction });
      comp.ngOnInit();

      expect(comp.bankAccountsSharedCollection).toContain(user);
      expect(comp.bankTransaction).toEqual(bankTransaction);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankTransaction>>();
      const bankTransaction = { id: 123 };
      jest.spyOn(bankTransactionFormService, 'getBankTransaction').mockReturnValue(bankTransaction);
      jest.spyOn(bankTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankTransaction }));
      saveSubject.complete();

      // THEN
      expect(bankTransactionFormService.getBankTransaction).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankTransactionService.update).toHaveBeenCalledWith(expect.objectContaining(bankTransaction));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankTransaction>>();
      const bankTransaction = { id: 123 };
      jest.spyOn(bankTransactionFormService, 'getBankTransaction').mockReturnValue({ id: null });
      jest.spyOn(bankTransactionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankTransaction: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankTransaction }));
      saveSubject.complete();

      // THEN
      expect(bankTransactionFormService.getBankTransaction).toHaveBeenCalled();
      expect(bankTransactionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankTransaction>>();
      const bankTransaction = { id: 123 };
      jest.spyOn(bankTransactionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankTransaction });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankTransactionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBankAccount', () => {
      it('Should forward to bankAccountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bankAccountService, 'compareBankAccount');
        comp.compareBankAccount(entity, entity2);
        expect(bankAccountService.compareBankAccount).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
