import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankAccountFormService } from './bank-account-form.service';
import { BankAccountService } from '../service/bank-account.service';
import { IBankAccount } from '../bank-account.model';
import { IBankUser } from 'app/entities/bank-user/bank-user.model';
import { BankUserService } from 'app/entities/bank-user/service/bank-user.service';

import { BankAccountUpdateComponent } from './bank-account-update.component';

describe('BankAccount Management Update Component', () => {
  let comp: BankAccountUpdateComponent;
  let fixture: ComponentFixture<BankAccountUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankAccountFormService: BankAccountFormService;
  let bankAccountService: BankAccountService;
  let bankUserService: BankUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankAccountUpdateComponent],
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
      .overrideTemplate(BankAccountUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankAccountUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankAccountFormService = TestBed.inject(BankAccountFormService);
    bankAccountService = TestBed.inject(BankAccountService);
    bankUserService = TestBed.inject(BankUserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BankUser query and add missing value', () => {
      const bankAccount: IBankAccount = { id: 456 };
      const user: IBankUser = { id: 73425 };
      bankAccount.user = user;

      const bankUserCollection: IBankUser[] = [{ id: 72032 }];
      jest.spyOn(bankUserService, 'query').mockReturnValue(of(new HttpResponse({ body: bankUserCollection })));
      const additionalBankUsers = [user];
      const expectedCollection: IBankUser[] = [...additionalBankUsers, ...bankUserCollection];
      jest.spyOn(bankUserService, 'addBankUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(bankUserService.query).toHaveBeenCalled();
      expect(bankUserService.addBankUserToCollectionIfMissing).toHaveBeenCalledWith(
        bankUserCollection,
        ...additionalBankUsers.map(expect.objectContaining)
      );
      expect(comp.bankUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bankAccount: IBankAccount = { id: 456 };
      const user: IBankUser = { id: 50707 };
      bankAccount.user = user;

      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      expect(comp.bankUsersSharedCollection).toContain(user);
      expect(comp.bankAccount).toEqual(bankAccount);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankAccount>>();
      const bankAccount = { id: 123 };
      jest.spyOn(bankAccountFormService, 'getBankAccount').mockReturnValue(bankAccount);
      jest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankAccount }));
      saveSubject.complete();

      // THEN
      expect(bankAccountFormService.getBankAccount).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankAccountService.update).toHaveBeenCalledWith(expect.objectContaining(bankAccount));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankAccount>>();
      const bankAccount = { id: 123 };
      jest.spyOn(bankAccountFormService, 'getBankAccount').mockReturnValue({ id: null });
      jest.spyOn(bankAccountService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankAccount }));
      saveSubject.complete();

      // THEN
      expect(bankAccountFormService.getBankAccount).toHaveBeenCalled();
      expect(bankAccountService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankAccount>>();
      const bankAccount = { id: 123 };
      jest.spyOn(bankAccountService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankAccount });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankAccountService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBankUser', () => {
      it('Should forward to bankUserService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(bankUserService, 'compareBankUser');
        comp.compareBankUser(entity, entity2);
        expect(bankUserService.compareBankUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
