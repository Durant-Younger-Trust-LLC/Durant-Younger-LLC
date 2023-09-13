import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBankTransaction, NewBankTransaction } from '../bank-transaction.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };
//
/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBankTransaction for edit and NewBankTransactionFormGroupInput for create.
 */
type BankTransactionFormGroupInput = IBankTransaction | PartialWithRequiredKeyOf<NewBankTransaction>;

type BankTransactionFormDefaults = Pick<NewBankTransaction, 'id'>;

type BankTransactionFormGroupContent = {
  id: FormControl<IBankTransaction['id'] | NewBankTransaction['id']>;
  date: FormControl<IBankTransaction['date']>;
  description: FormControl<IBankTransaction['description']>;
  balance: FormControl<IBankTransaction['balance']>;
  merchantName: FormControl<IBankTransaction['merchantName']>;
  user: FormControl<IBankTransaction['user']>;
  transactionAmount: FormControl<IBankTransaction['transactionAmount']>;
  type: FormControl<IBankTransaction['type']>;
};

export type BankTransactionFormGroup = FormGroup<BankTransactionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankTransactionFormService {
  createBankTransactionFormGroup(bankTransaction: BankTransactionFormGroupInput = { id: null }): BankTransactionFormGroup {
    const bankTransactionRawValue = {
      ...this.getFormDefaults(),
      ...bankTransaction,
    };
    return new FormGroup<BankTransactionFormGroupContent>({
      id: new FormControl(
        { value: bankTransactionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(bankTransactionRawValue.date),
      description: new FormControl(bankTransactionRawValue.description),
      balance: new FormControl(bankTransactionRawValue.balance),
      merchantName: new FormControl(bankTransactionRawValue.merchantName),
      user: new FormControl(bankTransactionRawValue.user),
      transactionAmount: new FormControl(bankTransactionRawValue.transactionAmount),
      type: new FormControl(bankTransactionRawValue.type),
    });
  }

  getBankTransaction(form: BankTransactionFormGroup): IBankTransaction | NewBankTransaction {
    return form.getRawValue() as IBankTransaction | NewBankTransaction;
  }

  resetForm(form: BankTransactionFormGroup, bankTransaction: BankTransactionFormGroupInput): void {
    const bankTransactionRawValue = { ...this.getFormDefaults(), ...bankTransaction };
    form.reset(
      {
        ...bankTransactionRawValue,
        id: { value: bankTransactionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BankTransactionFormDefaults {
    return {
      id: null,
    };
  }
}
