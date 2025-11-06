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
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';

type FilterType = 'all' | 'credit' | 'debit';
type PeriodType = 'week' | 'month' | 'year';

export default function StatementScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [period, setPeriod] = useState<PeriodType>('month');
  const { transactions, balance } = useAccount();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
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

  const handlePeriodChange = (newPeriod: PeriodType) => {
    if (newPeriod !== period) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPeriod(newPeriod);
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netIncome = totalIncome - totalExpenses;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Raportit</Text>
          <Text style={styles.subtitle}>Taloudellinen yhteenveto</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          {(['week', 'month', 'year'] as PeriodType[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodTab, period === p && styles.periodTabActive]}
              onPress={() => handlePeriodChange(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p && styles.periodTextActive,
                ]}
              >
                {p === 'week' ? 'Viikko' : p === 'month' ? 'Kuukausi' : 'Vuosi'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card shadow="medium" padding={Spacing.lg} style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-up" size={24} color={Colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Tulot</Text>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +{totalIncome.toFixed(2)} €
            </Text>
          </Card>

          <Card shadow="medium" padding={Spacing.lg} style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="trending-down" size={24} color={Colors.danger} />
            </View>
            <Text style={styles.summaryLabel}>Menot</Text>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -{totalExpenses.toFixed(2)} €
            </Text>
          </Card>
        </View>

        {/* Net Income Card */}
        <View style={styles.netIncomeContainer}>
          <Card gradient shadow="large" padding={Spacing.lg}>
            <View style={styles.netIncomeContent}>
              <View>
                <Text style={styles.netIncomeLabel}>Nettotulos</Text>
                <Text
                  style={[
                    styles.netIncomeAmount,
                    netIncome >= 0 ? styles.netPositive : styles.netNegative,
                  ]}
                >
                  {formatCurrency(netIncome)}
                </Text>
              </View>
              <View style={styles.netIncomeIcon}>
                <Ionicons
                  name={netIncome >= 0 ? 'trending-up' : 'trending-down'}
                  size={32}
                  color={Colors.white}
                />
              </View>
            </View>
          </Card>
        </View>

        {/* Simple Chart Placeholder */}
        <View style={styles.chartContainer}>
          <Card shadow="medium" padding={Spacing.lg}>
            <Text style={styles.chartTitle}>Kulutuskuvaaja</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartBars}>
                {[60, 80, 45, 90, 70, 85, 55].map((height, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        { height: `${height}%`, backgroundColor: Colors.primary },
                      ]}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.chartLabels}>
                {['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'].map((day, index) => (
                  <Text key={index} style={styles.chartLabel}>
                    {day}
                  </Text>
                ))}
              </View>
            </View>
          </Card>
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
              Kaikki
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
              Tulot
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
              Menot
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transactions List */}
        <Animated.View style={[styles.transactionsList, { opacity: fadeAnim }]}>
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              shadow="small"
              padding={Spacing.md}
              style={styles.transactionCard}
            >
              <TouchableOpacity
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
            </Card>
          ))}
        </Animated.View>

        {/* Export Button */}
        <View style={styles.exportContainer}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          >
            <Ionicons name="download-outline" size={20} color={Colors.white} />
            <Text style={styles.exportButtonText}>Vie raportti</Text>
          </TouchableOpacity>
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  periodTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  periodTextActive: {
    color: Colors.white,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  summaryAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  incomeAmount: {
    color: Colors.success,
  },
  expenseAmount: {
    color: Colors.danger,
  },
  netIncomeContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  netIncomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netIncomeLabel: {
    fontSize: FontSize.md,
    color: Colors.white,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
    opacity: 0.9,
  },
  netIncomeAmount: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  netPositive: {
    color: Colors.white,
  },
  netNegative: {
    color: Colors.white,
  },
  netIncomeIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chartPlaceholder: {
    height: 180,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginBottom: Spacing.sm,
  },
  chartBarContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '100%',
    borderRadius: BorderRadius.xs,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    flex: 1,
    textAlign: 'center',
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
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    ...Shadow.small,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  transactionsList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  transactionCard: {
    marginBottom: Spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
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
    backgroundColor: Colors.textSecondary,
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
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
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
  exportContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    ...Shadow.medium,
    gap: Spacing.sm,
  },
  exportButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
