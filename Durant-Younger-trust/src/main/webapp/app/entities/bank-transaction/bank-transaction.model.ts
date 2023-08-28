import dayjs from 'dayjs/esm';
import { IBankAccount } from 'app/entities/bank-account/bank-account.model';

export interface IBankTransaction {
  id: number;
  date?: dayjs.Dayjs | null;
  description?: string | null;
  balance?: number | null;
  merchantName?: string | null;
  user?: Pick<IBankAccount, 'id'> | null;
}

export type NewBankTransaction = Omit<IBankTransaction, 'id'> & { id: null };
