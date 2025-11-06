import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '../types';

interface AccountContextType {
  balance: number;
  transactions: Transaction[];
  accountNumber: string;
  createPayment: (amount: number, description?: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const accountNumber = 'FI21 1234 5678 9012 34';
  const [balance, setBalance] = useState<number>(14574.32);
  const [transactionCounter, setTransactionCounter] = useState<number>(100);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'eBike Rental - Day Pass',
      amount: -15.90,
      date: '2025-11-05T14:30:00Z',
      category: 'Transport',
      status: 'completed',
      recipient: 'Helsinki eBike Service',
      type: 'debit',
    },
    {
      id: '2',
      title: 'Salary',
      amount: 3500.00,
      date: '2025-11-01T09:00:00Z',
      category: 'Income',
      status: 'completed',
      recipient: 'Employer Ltd',
      type: 'credit',
    },
    {
      id: '3',
      title: 'eBike Monthly Subscription',
      amount: -49.90,
      date: '2025-10-28T12:15:00Z',
      category: 'Transport',
      status: 'completed',
      recipient: 'Helsinki eBike Service',
      type: 'debit',
    },
    {
      id: '4',
      title: 'Grocery Store',
      amount: -87.35,
      date: '2025-10-27T16:45:00Z',
      category: 'Shopping',
      status: 'completed',
      recipient: 'K-Market',
      type: 'debit',
    },
    {
      id: '5',
      title: 'Restaurant',
      amount: -42.50,
      date: '2025-10-26T19:30:00Z',
      category: 'Food',
      status: 'completed',
      recipient: 'Ravintola Nokka',
      type: 'debit',
    },
  ]);

  const createPayment = (amount: number, description?: string) => {
    // Coerce amount to number
    const numAmount = Number(amount) || 0;
    
    // Create new transaction with negative amount (debit)
    const newTransaction: Transaction = {
      id: `tx-${transactionCounter + 1}`,
      title: description || 'Maksu',
      amount: -numAmount,
      date: new Date().toISOString(),
      category: 'Payment',
      status: 'completed',
      type: 'debit',
    };

    // Increment counter for next transaction
    setTransactionCounter(prev => prev + 1);

    // Prepend to transactions array
    setTransactions(prev => [newTransaction, ...prev]);

    // Subtract from balance and round to 2 decimals
    setBalance(prev => Math.round((prev - numAmount) * 100) / 100);
  };

  return (
    <AccountContext.Provider value={{ balance, transactions, accountNumber, createPayment }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
