import { IBankAccount, NewBankAccount } from './bank-account.model';

export const sampleWithRequiredData: IBankAccount = {
  id: 9495,
};

export const sampleWithPartialData: IBankAccount = {
  id: 82725,
  balance: 85,
};

export const sampleWithFullData: IBankAccount = {
  id: 81250,
  accountName: 'Investment Account',
  balance: 50357,
};

export const sampleWithNewData: NewBankAccount = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
