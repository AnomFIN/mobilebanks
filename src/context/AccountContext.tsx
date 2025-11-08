import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '../../types';

interface AccountContextType {
  balance: number;
  transactions: Transaction[];
  accountNumber: string;
  accountHolderName: string;
  companyName: string;
  createPayment: (amount: number, description?: string) => void;
  updateBalance: (newBalance: number) => void;
  updateAccountHolderName: (name: string) => void;
  updateCompanyName: (company: string) => void;
  updateAccountNumber: (iban: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
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
  const [balance, setBalance] = useState<number>(14574.32);
  const [accountNumber, setAccountNumber] = useState<string>('FI21 1234 5678 9012 34');
  const [accountHolderName, setAccountHolderName] = useState<string>('Aku Ankka');
  const [companyName, setCompanyName] = useState<string>('Firma Oy');
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

  const updateBalance = (newBalance: number) => {
    setBalance(Math.round(newBalance * 100) / 100);
  };

  const updateAccountHolderName = (name: string) => {
    setAccountHolderName(name);
  };

  const updateCompanyName = (company: string) => {
    setCompanyName(company);
  };

  const updateAccountNumber = (iban: string) => {
    setAccountNumber(iban);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    transactionCounter++;
    const newTransaction: Transaction = {
      ...transaction,
      id: transactionCounter.toString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    
    // Update balance based on transaction type
    const amountChange = transaction.type === 'credit' ? 
      Math.abs(transaction.amount) : 
      -Math.abs(transaction.amount);
    setBalance((prev) => Math.round((prev + amountChange) * 100) / 100);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => {
      if (t.id === id) {
        const oldAmount = t.amount;
        const newTransaction = { ...t, ...updatedTransaction };
        
        // If amount changed, update balance
        if (updatedTransaction.amount !== undefined && updatedTransaction.amount !== oldAmount) {
          const amountDiff = updatedTransaction.amount - oldAmount;
          setBalance((prevBalance) => Math.round((prevBalance + amountDiff) * 100) / 100);
        }
        
        return newTransaction;
      }
      return t;
    }));
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (transactionToDelete) {
      // Reverse the balance change
      const amountToReverse = -transactionToDelete.amount;
      setBalance((prev) => Math.round((prev + amountToReverse) * 100) / 100);
    }
    
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AccountContext.Provider value={{ 
      balance, 
      transactions, 
      accountNumber, 
      accountHolderName,
      companyName,
      createPayment,
      updateBalance,
      updateAccountHolderName,
      updateCompanyName,
      updateAccountNumber,
      addTransaction,
      updateTransaction,
      deleteTransaction
    }}>
      {children}
    </AccountContext.Provider>
  );
};
