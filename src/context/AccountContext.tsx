import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction } from '../../types';

interface AccountContextType {
  balance: number;
  transactions: Transaction[];
  accountNumber: string;
  accountHolderName: string;
  companyName: string;
  createPayment: (amount: number, description?: string, recipient?: string, iban?: string) => void;
  language: 'fi' | 'en';
  setLanguage: (lang: 'fi' | 'en') => void;
  showAccountWarning: boolean;
  setShowAccountWarning: (v: boolean) => void;
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
  const [accountNumber, setAccountNumber] = useState<string>('FI21 1234 5678 9012 34');
  // Opening balance before the listed transactions
  const openingBalance = 38880.31;

  const [accountHolderName, setAccountHolderName] = useState<string>('Aku Ankka');
  const [companyName, setCompanyName] = useState<string>('Firma Oy');
  const [language, setLanguage] = useState<'fi' | 'en'>('fi');
  // Default OFF per user request
  const [showAccountWarning, setShowAccountWarning] = useState<boolean>(false);
  const initialTransactions: Transaction[] = [
    {
      id: '1',
      title: 'BANK TRANSFER',
      amount: 69.90,
      date: '2025-11-06T08:30:00Z',
      category: 'Bank transfer',
      status: 'completed',
      recipient: 'Milenna Sinkko',
      type: 'credit',
    },
    {
      id: '2',
      title: 'BANK TRANSFER',
      amount: -38712.61,
      date: '2025-11-06T09:15:00Z',
      category: 'Bank transfer',
      status: 'pending',
      recipient: 'Lakiasiaintoimisto Premilex Oy',
      type: 'debit',
    },
    {
      id: '3',
      title: 'BANK TRANSFER',
      amount: -90.00,
      date: '2025-11-07T10:05:00Z',
      category: 'Bank transfer',
      status: 'completed',
      recipient: 'Lakiasiaintoimisto Premilex Oy',
      type: 'debit',
    },
    {
      id: '4',
      title: 'BANK TRANSFER',
      amount: -7.80,
      date: '2025-11-07T11:30:00Z',
      category: 'Bank transfer',
      status: 'completed',
      recipient: 'Sumup LTC',
      type: 'debit',
    },
  ];

  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Compute closing balance from opening balance + transactions amounts
  const computedClosing = Math.round((openingBalance + transactions.reduce((s, t) => s + t.amount, 0)) * 100) / 100;
  const [balance, setBalance] = useState<number>(computedClosing);

  const createPayment = (amount: number, description?: string, recipient?: string, iban?: string) => {
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
      recipient: recipient,
      iban: iban,
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
      showAccountWarning,
      setShowAccountWarning,
      language,
      setLanguage,
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
