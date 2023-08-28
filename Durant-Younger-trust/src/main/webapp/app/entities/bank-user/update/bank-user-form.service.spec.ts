import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bank-user.test-samples';

import { BankUserFormService } from './bank-user-form.service';

describe('BankUser Form Service', () => {
  let service: BankUserFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankUserFormService);
  });

  describe('Service methods', () => {
    describe('createBankUserFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBankUserFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            internalUser: expect.any(Object),
          })
        );
      });

      it('passing IBankUser should create a new form with FormGroup', () => {
        const formGroup = service.createBankUserFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            internalUser: expect.any(Object),
          })
        );
      });
    });

    describe('getBankUser', () => {
      it('should return NewBankUser for default BankUser initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBankUserFormGroup(sampleWithNewData);

        const bankUser = service.getBankUser(formGroup) as any;

        expect(bankUser).toMatchObject(sampleWithNewData);
      });

      it('should return NewBankUser for empty BankUser initial value', () => {
        const formGroup = service.createBankUserFormGroup();

        const bankUser = service.getBankUser(formGroup) as any;

        expect(bankUser).toMatchObject({});
      });

      it('should return IBankUser', () => {
        const formGroup = service.createBankUserFormGroup(sampleWithRequiredData);

        const bankUser = service.getBankUser(formGroup) as any;

        expect(bankUser).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBankUser should not enable id FormControl', () => {
        const formGroup = service.createBankUserFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBankUser should disable id FormControl', () => {
        const formGroup = service.createBankUserFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
