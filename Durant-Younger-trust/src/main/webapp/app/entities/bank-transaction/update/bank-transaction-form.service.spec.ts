import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../bank-transaction.test-samples';

import { BankTransactionFormService } from './bank-transaction-form.service';

describe('BankTransaction Form Service', () => {
  let service: BankTransactionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankTransactionFormService);
  });

  describe('Service methods', () => {
    describe('createBankTransactionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBankTransactionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            balance: expect.any(Object),
            merchantName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IBankTransaction should create a new form with FormGroup', () => {
        const formGroup = service.createBankTransactionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            description: expect.any(Object),
            balance: expect.any(Object),
            merchantName: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getBankTransaction', () => {
      it('should return NewBankTransaction for default BankTransaction initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createBankTransactionFormGroup(sampleWithNewData);

        const bankTransaction = service.getBankTransaction(formGroup) as any;

        expect(bankTransaction).toMatchObject(sampleWithNewData);
      });

      it('should return NewBankTransaction for empty BankTransaction initial value', () => {
        const formGroup = service.createBankTransactionFormGroup();

        const bankTransaction = service.getBankTransaction(formGroup) as any;

        expect(bankTransaction).toMatchObject({});
      });

      it('should return IBankTransaction', () => {
        const formGroup = service.createBankTransactionFormGroup(sampleWithRequiredData);

        const bankTransaction = service.getBankTransaction(formGroup) as any;

        expect(bankTransaction).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBankTransaction should not enable id FormControl', () => {
        const formGroup = service.createBankTransactionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBankTransaction should disable id FormControl', () => {
        const formGroup = service.createBankTransactionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
