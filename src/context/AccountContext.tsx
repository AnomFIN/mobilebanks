import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '../../types';

interface AccountContextType {
  balance: number;
  transactions: Transaction[];
  accountNumber: string;
  createPayment: (amount: number, description?: string) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: ReactNode;
}

let transactionCounter = 1000;

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const accountNumber = 'FI21 1234 5678 9012 34';
  const [balance, setBalance] = useState<number>(14574.32);
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
  ]);

  const createPayment = (amount: number, description?: string) => {
    // Coerce amount to number
    const numAmount = Number(amount) || 0;
    
    // Create new transaction with negative amount (debit)
    // Use counter-based ID to avoid duplicates
    transactionCounter++;
    const newTransaction: Transaction = {
      id: transactionCounter.toString(),
      title: description || 'Maksu',
      amount: -Math.abs(numAmount),
      date: new Date().toISOString(),
      category: 'Payment',
      status: 'completed',
      type: 'debit',
    };

    // Prepend transaction to list
    setTransactions((prev) => [newTransaction, ...prev]);

    // Subtract amount from balance and round to 2 decimals
    setBalance((prev) => Math.round((prev - Math.abs(numAmount)) * 100) / 100);
  };

  return (
    <AccountContext.Provider value={{ balance, transactions, accountNumber, createPayment }}>
      {children}
    </AccountContext.Provider>
  );
};
