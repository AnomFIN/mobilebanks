import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../constants';
import { mockTransactions } from '../mockData';

type FilterType = 'all' | 'credit' | 'debit';

export default function StatementScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-FI', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleFilterChange = (newFilter: FilterType) => {
    if (newFilter !== filter) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      setFilter(newFilter);
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const totalIncome = mockTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Statement</Text>
          <Text style={styles.subtitle}>Transaction history</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={24} color={Colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +{totalIncome.toFixed(2)} €
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-down" size={24} color={Colors.danger} />
            </View>
            <Text style={styles.summaryLabel}>Expenses</Text>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -{totalExpenses.toFixed(2)} €
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => handleFilterChange('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'credit' && styles.filterTabActive]}
            onPress={() => handleFilterChange('credit')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'credit' && styles.filterTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'debit' && styles.filterTabActive]}
            onPress={() => handleFilterChange('debit')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'debit' && styles.filterTextActive,
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <Animated.View style={[styles.transactionsList, { opacity: fadeAnim }]}>
          {filteredTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View
                style={[
                  styles.transactionIconContainer,
                  transaction.type === 'credit'
                    ? styles.transactionIconCredit
                    : styles.transactionIconDebit,
                ]}
              >
                <Ionicons
                  name={
                    transaction.type === 'credit'
                      ? 'arrow-down'
                      : 'arrow-up'
                  }
                  size={20}
                  color={Colors.white}
                />
              </View>

              <View style={styles.transactionContent}>
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'credit' &&
                        styles.transactionAmountCredit,
                    ]}
                  >
                    {formatCurrency(transaction.amount)}
                  </Text>
                </View>

                <View style={styles.transactionFooter}>
                  <View style={styles.transactionMeta}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>

                  <View style={styles.transactionMeta}>
                    <Ionicons
                      name="pricetag-outline"
                      size={12}
                      color={Colors.textSecondary}
                    />
                    <Text style={styles.transactionCategory}>
                      {transaction.category}
                    </Text>
                  </View>
                </View>

                {transaction.recipient && (
                  <Text style={styles.transactionRecipient}>
                    {transaction.recipient}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  incomeCard: {
    backgroundColor: Colors.gray,
    borderColor: Colors.success,
  },
  expenseCard: {
    backgroundColor: Colors.gray,
    borderColor: Colors.danger,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.danger,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  filterTabActive: {
    backgroundColor: Colors.neonGreen,
    borderColor: Colors.neonGreen,
    ...Shadow.small,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.black,
  },
  transactionsList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    backgroundColor: Colors.gray,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionIconCredit: {
    backgroundColor: Colors.success,
  },
  transactionIconDebit: {
    backgroundColor: Colors.lightGray,
  },
  transactionContent: {
    flex: 1,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  transactionTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.white,
    marginRight: Spacing.sm,
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.white,
  },
  transactionAmountCredit: {
    color: Colors.success,
  },
  transactionFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionCategory: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionRecipient: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
