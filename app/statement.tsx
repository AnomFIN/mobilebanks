import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow, Gradients } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';

type FilterType = 'all' | 'credit' | 'debit';
type PeriodType = 'week' | 'month' | 'year';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [period, setPeriod] = useState<PeriodType>('month');
  const { transactions, balance } = useAccount();
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'short',
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

  const netBalance = totalIncome - totalExpenses;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Raportit</Text>
          <Text style={styles.subtitle}>Taloudellinen yhteenveto</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSection}>
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[styles.periodTab, period === 'week' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('week')}
            >
              <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>
                Viikko
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodTab, period === 'month' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('month')}
            >
              <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
                Kuukausi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodTab, period === 'year' && styles.periodTabActive]}
              onPress={() => handlePeriodChange('year')}
            >
              <Text style={[styles.periodText, period === 'year' && styles.periodTextActive]}>
                Vuosi
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <Card gradient gradientColors={[Colors.success, '#28A745']} elevation="large">
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="trending-up" size={28} color={Colors.white} />
              </View>
              <Text style={styles.summaryLabel}>Tulot</Text>
              <Text style={styles.summaryAmount}>
                +{totalIncome.toFixed(2)} €
              </Text>
            </View>
          </Card>

          <View style={{ height: Spacing.md }} />

          <Card gradient gradientColors={[Colors.danger, '#DC3545']} elevation="large">
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="trending-down" size={28} color={Colors.white} />
              </View>
              <Text style={styles.summaryLabel}>Menot</Text>
              <Text style={styles.summaryAmount}>
                -{totalExpenses.toFixed(2)} €
              </Text>
            </View>
          </Card>

          <View style={{ height: Spacing.md }} />

          <Card gradient gradientColors={Gradients.blueCard} elevation="large">
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="wallet" size={28} color={Colors.white} />
              </View>
              <Text style={styles.summaryLabel}>Nettosaldo</Text>
              <Text style={styles.summaryAmount}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)} €
              </Text>
            </View>
          </Card>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartSection}>
          <Card>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Kulutuskatsaus</Text>
              <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={64} color={Colors.lightGray} />
              <Text style={styles.chartPlaceholderText}>
                Kaavio tulossa pian
              </Text>
            </View>
          </Card>
        </View>

        {/* Export Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Ionicons name="download-outline" size={22} color={Colors.primaryBlue} />
            <Text style={styles.actionButtonText}>Lataa raportti</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Ionicons name="share-outline" size={22} color={Colors.primaryBlue} />
            <Text style={styles.actionButtonText}>Jaa</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Tapahtumat</Text>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
              onPress={() => handleFilterChange('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                Kaikki
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTab, filter === 'credit' && styles.filterTabActive]}
              onPress={() => handleFilterChange('credit')}
            >
              <Text style={[styles.filterText, filter === 'credit' && styles.filterTextActive]}>
                Tulot
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterTab, filter === 'debit' && styles.filterTabActive]}
              onPress={() => handleFilterChange('debit')}
            >
              <Text style={[styles.filterText, filter === 'debit' && styles.filterTextActive]}>
                Menot
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.transactionsSection}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <TouchableOpacity
                    key={transaction.id}
                    style={[
                      styles.transactionItem,
                      index === filteredTransactions.length - 1 && styles.transactionItemLast,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      router.push('/receipt');
                    }}
                  >
                    <View
                      style={[
                        styles.transactionIcon,
                        transaction.type === 'credit'
                          ? styles.transactionIconCredit
                          : styles.transactionIconDebit,
                      ]}
                    >
                      <Ionicons
                        name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                        size={18}
                        color={Colors.white}
                      />
                    </View>

                    <View style={styles.transactionContent}>
                      <Text style={styles.transactionTitle}>{transaction.title}</Text>
                      <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                      {transaction.category && (
                        <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction.type === 'credit' && styles.transactionAmountCredit,
                      ]}
                    >
                      {formatCurrency(transaction.amount)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="document-outline" size={48} color={Colors.lightGray} />
                  <Text style={styles.emptyStateText}>Ei tapahtumia</Text>
                </View>
              )}
            </Card>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.veryLightGray,
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  periodSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 4,
    ...Shadow.small,
  },
  periodTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  periodTabActive: {
    backgroundColor: Colors.primaryBlue,
  },
  periodText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  periodTextActive: {
    color: Colors.white,
  },
  summarySection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  chartSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.veryLightGray,
    borderRadius: BorderRadius.md,
  },
  chartPlaceholderText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  actionButtonText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.primaryBlue,
  },
  filterSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    ...Shadow.small,
  },
  filterTabActive: {
    backgroundColor: Colors.primaryBlue,
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  transactionsSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  transactionItemLast: {
    borderBottomWidth: 0,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionIconCredit: {
    backgroundColor: Colors.success,
  },
  transactionIconDebit: {
    backgroundColor: Colors.mediumGray,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionCategory: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  transactionAmountCredit: {
    color: Colors.success,
  },
  emptyState: {
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
});
