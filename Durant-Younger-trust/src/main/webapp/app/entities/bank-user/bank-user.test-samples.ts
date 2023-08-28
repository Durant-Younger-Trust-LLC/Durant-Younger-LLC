import { IBankUser, NewBankUser } from './bank-user.model';

export const sampleWithRequiredData: IBankUser = {
  id: 88964,
};

export const sampleWithPartialData: IBankUser = {
  id: 91067,
};

export const sampleWithFullData: IBankUser = {
  id: 25655,
};

export const sampleWithNewData: NewBankUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
