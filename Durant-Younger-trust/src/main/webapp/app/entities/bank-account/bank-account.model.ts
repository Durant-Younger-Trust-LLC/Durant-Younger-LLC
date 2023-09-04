import { IBankUser } from 'app/entities/bank-user/bank-user.model';

export interface IBankAccount {
  id: number;
  accountName?: string | null;
  balance?: number | null;
  user?: Pick<IBankUser, 'id'> | null;
}

export type NewBankAccount = Omit<IBankAccount, 'id'> & { id: null };
""
