export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  recipient?: string;
  iban?: string;
  type: 'debit' | 'credit';
}

export interface Account {
  balance: number;
  accountNumber: string;
  currency: string;
}
