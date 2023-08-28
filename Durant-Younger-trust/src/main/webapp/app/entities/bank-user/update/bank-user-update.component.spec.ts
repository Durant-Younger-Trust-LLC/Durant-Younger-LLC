import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankUserFormService } from './bank-user-form.service';
import { BankUserService } from '../service/bank-user.service';
import { IBankUser } from '../bank-user.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { BankUserUpdateComponent } from './bank-user-update.component';

describe('BankUser Management Update Component', () => {
  let comp: BankUserUpdateComponent;
  let fixture: ComponentFixture<BankUserUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankUserFormService: BankUserFormService;
  let bankUserService: BankUserService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankUserUpdateComponent],
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
      .overrideTemplate(BankUserUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankUserUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankUserFormService = TestBed.inject(BankUserFormService);
    bankUserService = TestBed.inject(BankUserService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const bankUser: IBankUser = { id: 456 };
      const internalUser: IUser = { id: 70428 };
      bankUser.internalUser = internalUser;

      const userCollection: IUser[] = [{ id: 18236 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [internalUser];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankUser });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bankUser: IBankUser = { id: 456 };
      const internalUser: IUser = { id: 36356 };
      bankUser.internalUser = internalUser;

      activatedRoute.data = of({ bankUser });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(internalUser);
      expect(comp.bankUser).toEqual(bankUser);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankUser>>();
      const bankUser = { id: 123 };
      jest.spyOn(bankUserFormService, 'getBankUser').mockReturnValue(bankUser);
      jest.spyOn(bankUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankUser }));
      saveSubject.complete();

      // THEN
      expect(bankUserFormService.getBankUser).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankUserService.update).toHaveBeenCalledWith(expect.objectContaining(bankUser));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankUser>>();
      const bankUser = { id: 123 };
      jest.spyOn(bankUserFormService, 'getBankUser').mockReturnValue({ id: null });
      jest.spyOn(bankUserService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankUser: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankUser }));
      saveSubject.complete();

      // THEN
      expect(bankUserFormService.getBankUser).toHaveBeenCalled();
      expect(bankUserService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankUser>>();
      const bankUser = { id: 123 };
      jest.spyOn(bankUserService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankUser });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankUserService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
