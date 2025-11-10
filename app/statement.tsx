import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { impactAsync } from '../src/utils/safeHaptics';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';
import HeaderBar from '../src/components/HeaderBar';

export default function StatementScreen() {
  const { transactions, balance, language } = useAccount();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const handleFilterChange = (filter: 'all' | 'credit' | 'debit') => {
    impactAsync((global as any).Haptics?.ImpactFeedbackStyle?.Light || 'light');
    setSelectedFilter(filter);
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'short',
    });
  };

  const filteredTransactions = transactions.filter((t) => {
    if (selectedFilter === 'all') return true;
    return t.type === selectedFilter;
  });

  const t = (key: string) => {
    if (language === 'en') {
      const en: Record<string, string> = {
        title: 'Statement',
        subtitle: 'Balance',
        all: 'All',
        income: 'Income',
        expenses: 'Expenses',
        transactions: 'Transactions',
        noTransactions: 'No transactions',
      };
      return en[key] || key;
    }
    const fi: Record<string, string> = {
      title: 'Tiliote',
      subtitle: 'Saldo',
      all: 'Kaikki',
      income: 'Tulot',
      expenses: 'Menot',
      transactions: 'Tapahtumat',
      noTransactions: 'Ei tapahtumia',
    };
    return fi[key] || key;
  };

  const openingBalance = 38880.31;
  const formatMoneyWithSpace = (n: number) => {
    return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('title')}</Text>
          <Text style={styles.period}>1.11.2025 - 9.11.2025</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Opening balance</Text>
            <Text style={styles.balanceValue}>{formatMoneyWithSpace(openingBalance)} €</Text>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Closing balance</Text>
            <Text style={styles.balanceValue}>{formatMoneyWithSpace(balance)} €</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              {t('all')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'credit' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('credit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'credit' && styles.filterTextActive]}>
              {t('income')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'debit' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('debit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'debit' && styles.filterTextActive]}>
              {t('expenses')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>{t('transactions')} ({filteredTransactions.length})</Text>
          
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: transaction.type === 'credit' ? Colors.success + '20' : Colors.error + '20' }]}>
                    <Ionicons
                      name={transaction.type === 'credit' ? 'add-circle' : 'remove-circle'}
                      size={20}
                      color={transaction.type === 'credit' ? Colors.success : Colors.error}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    {transaction.recipient ? (
                      <Text style={styles.transactionRecipient}>{transaction.recipient}</Text>
                    ) : (
                      <Text style={styles.transactionCategory}>{transaction.category}</Text>
                    )}
                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[styles.transactionAmount, { color: transaction.type === 'credit' ? Colors.success : Colors.error }]}>
                    {formatCurrency(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionStatus}>{transaction.status}</Text>
                </View>
              </View>
            </Card>
          ))}

          {filteredTransactions.length === 0 && (
            <Card style={styles.emptyState}>
              <Ionicons name="document-outline" size={48} color={Colors.textSecondary} />
              <Text style={styles.emptyStateText}>{t('noTransactions')}</Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  filterButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.white,
  },
  transactionsSection: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  period: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  balanceValue: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  transactionCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  transactionRecipient: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
    fontWeight: FontWeight.medium,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
});
