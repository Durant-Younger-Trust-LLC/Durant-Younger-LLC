import { IUser } from 'app/entities/user/user.model';

export interface IBankUser {
  id: number;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewBankUser = Omit<IBankUser, 'id'> & { id: null };
