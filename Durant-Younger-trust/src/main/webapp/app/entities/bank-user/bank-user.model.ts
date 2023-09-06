import { IUser } from 'app/entities/user/user.model';
import { IBankAccount} from "../bank-account/bank-account.model";

export interface IBankUser {
  id: number;
  internalUser?: Pick<IUser, 'id' | 'login'> | null;
  // accounts?: Pick<IBankAccount, 'id' | 'accountName'> [] | null;
  accounts?: IBankAccount[];
}

export type NewBankUser = Omit<IBankUser, 'id'> & { id: null };

// this an array of all the acounts that the bank user has
