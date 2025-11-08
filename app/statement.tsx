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
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';
import HeaderBar from '../src/components/HeaderBar';

export default function StatementScreen() {
  const { transactions, balance } = useAccount();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const handleFilterChange = (filter: 'all' | 'credit' | 'debit') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tiliote</Text>
          <Text style={styles.subtitle}>Saldo: {balance.toFixed(2)} €</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              Kaikki
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'credit' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('credit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'credit' && styles.filterTextActive]}>
              Tulot
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'debit' && styles.filterButtonActive]}
            onPress={() => handleFilterChange('debit')}
          >
            <Text style={[styles.filterText, selectedFilter === 'debit' && styles.filterTextActive]}>
              Menot
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Tapahtumat ({filteredTransactions.length})</Text>
          
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
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
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
              <Text style={styles.emptyStateText}>Ei tapahtumia</Text>
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
