import { IUser } from 'app/entities/user/user.model';
import { IBankAccount} from "../bank-account/bank-account.model";

export interface IBankUser {
  id: number;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  bankAccount?: Pick<IBankAccount, 'id' | 'accountName'> | null;
}

export type NewBankUser = Omit<IBankUser, 'id'> & { id: null };
