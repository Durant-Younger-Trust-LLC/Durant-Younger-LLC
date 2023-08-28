import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBankUser, NewBankUser } from '../bank-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBankUser for edit and NewBankUserFormGroupInput for create.
 */
type BankUserFormGroupInput = IBankUser | PartialWithRequiredKeyOf<NewBankUser>;

type BankUserFormDefaults = Pick<NewBankUser, 'id'>;

type BankUserFormGroupContent = {
  id: FormControl<IBankUser['id'] | NewBankUser['id']>;
  internalUser: FormControl<IBankUser['internalUser']>;
};

export type BankUserFormGroup = FormGroup<BankUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BankUserFormService {
  createBankUserFormGroup(bankUser: BankUserFormGroupInput = { id: null }): BankUserFormGroup {
    const bankUserRawValue = {
      ...this.getFormDefaults(),
      ...bankUser,
    };
    return new FormGroup<BankUserFormGroupContent>({
      id: new FormControl(
        { value: bankUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      internalUser: new FormControl(bankUserRawValue.internalUser),
    });
  }

  getBankUser(form: BankUserFormGroup): IBankUser | NewBankUser {
    return form.getRawValue() as IBankUser | NewBankUser;
  }

  resetForm(form: BankUserFormGroup, bankUser: BankUserFormGroupInput): void {
    const bankUserRawValue = { ...this.getFormDefaults(), ...bankUser };
    form.reset(
      {
        ...bankUserRawValue,
        id: { value: bankUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BankUserFormDefaults {
    return {
      id: null,
    };
  }
}
