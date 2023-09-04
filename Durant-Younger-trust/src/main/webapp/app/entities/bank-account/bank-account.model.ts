import { IBankUser } from 'app/entities/bank-user/bank-user.model';
import {IBankTransaction} from "../bank-transaction/bank-transaction.model";

export interface IBankAccount {
  id: number;
  accountName?: string | null;
  balance?: number | null;
  user?: Pick<IBankUser, 'id'> | null;
  transactions?: Pick<IBankTransaction, 'id'> [] | null;
}

export type NewBankAccount = Omit<IBankAccount, 'id'> & { id: null };
""
