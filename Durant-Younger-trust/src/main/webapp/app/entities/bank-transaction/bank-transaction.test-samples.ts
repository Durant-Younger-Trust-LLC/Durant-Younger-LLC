import dayjs from 'dayjs/esm';

import { IBankTransaction, NewBankTransaction } from './bank-transaction.model';

export const sampleWithRequiredData: IBankTransaction = {
  id: 80132,
};

export const sampleWithPartialData: IBankTransaction = {
  id: 31576,
  description: 'optimizing orange embrace',
  balance: 4154,
};

export const sampleWithFullData: IBankTransaction = {
  id: 96655,
  date: dayjs('2023-08-28'),
  description: 'Exclusive Inlet Savings',
  balance: 7629,
  merchantName: 'Account homogeneous Berkshire',
};

export const sampleWithNewData: NewBankTransaction = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
