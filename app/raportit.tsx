import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { impactAsync } from '../src/utils/safeHaptics';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';

export default function RaportitScreen() {
  const { transactions } = useAccount();
  const [selectedRange, setSelectedRange] = useState<'week' | 'month' | 'year'>('month');

  const handleRangeChange = (range: 'week' | 'month' | 'year') => {
    impactAsync((global as any).Haptics?.ImpactFeedbackStyle?.Light || 'light');
    setSelectedRange(range);
  };

  // Calculate summary data
  const totalIncome = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netBalance = totalIncome - totalExpenses;
  const transactionCount = transactions.length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Raportit</Text>
          <Text style={styles.subtitle}>Taloudelliset yhteenvedot</Text>
        </View>

        {/* Range Picker */}
        <View style={styles.rangeContainer}>
          <TouchableOpacity
            style={[styles.rangeButton, selectedRange === 'week' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('week')}
            accessibilityLabel="Weekly report"
            accessibilityRole="button"
          >
            <Text style={[styles.rangeText, selectedRange === 'week' && styles.rangeTextActive]}>
              Viikko
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rangeButton, selectedRange === 'month' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('month')}
            accessibilityLabel="Monthly report"
            accessibilityRole="button"
          >
            <Text style={[styles.rangeText, selectedRange === 'month' && styles.rangeTextActive]}>
              Kuukausi
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rangeButton, selectedRange === 'year' && styles.rangeButtonActive]}
            onPress={() => handleRangeChange('year')}
            accessibilityLabel="Yearly report"
            accessibilityRole="button"
          >
            <Text style={[styles.rangeText, selectedRange === 'year' && styles.rangeTextActive]}>
              Vuosi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-up" size={24} color={Colors.success} />
            </View>
            <Text style={styles.summaryLabel}>Tulot</Text>
            <Text style={[styles.summaryValue, styles.incomeValue]}>
              +{totalIncome.toFixed(2)} €
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="trending-down" size={24} color={Colors.error} />
            </View>
            <Text style={styles.summaryLabel}>Menot</Text>
            <Text style={[styles.summaryValue, styles.expenseValue]}>
              -{totalExpenses.toFixed(2)} €
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="analytics" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.summaryLabel}>Netto</Text>
            <Text style={[styles.summaryValue, netBalance >= 0 ? styles.incomeValue : styles.expenseValue]}>
              {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)} €
            </Text>
          </Card>

          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconContainer}>
              <Ionicons name="swap-horizontal" size={24} color={Colors.accentCyan} />
            </View>
            <Text style={styles.summaryLabel}>Tapahtumat</Text>
            <Text style={styles.summaryValue}>
              {transactionCount}
            </Text>
          </Card>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.chartSection}>
          <Card>
            <Text style={styles.chartTitle}>Kuukausittainen yhteenveto</Text>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart-outline" size={64} color={Colors.primary} />
              <Text style={styles.chartPlaceholderText}>
                Kaavio tulossa pian
              </Text>
              <Text style={styles.chartPlaceholderSubtext}>
                Tässä näytetään tapahtumien graafinen esitys
              </Text>
            </View>
          </Card>
        </View>

        {/* Category Breakdown */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Kategoriajako</Text>
          <Card>
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.categoryName}>Liikenne</Text>
              </View>
              <Text style={styles.categoryAmount}>-65.80 €</Text>
            </View>
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.categoryName}>Tulot</Text>
              </View>
              <Text style={styles.categoryAmount}>+4350.00 €</Text>
            </View>
            <View style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View style={[styles.categoryDot, { backgroundColor: Colors.accentCyan }]} />
                <Text style={styles.categoryName}>Ruoka</Text>
              </View>
              <Text style={styles.categoryAmount}>-49.00 €</Text>
            </View>
          </Card>
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
  rangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  rangeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rangeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadow.small,
  },
  rangeText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  rangeTextActive: {
    color: Colors.white,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  summaryCard: {
    width: '48%',
    padding: Spacing.md,
  },
  summaryIconContainer: {
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
  summaryValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  incomeValue: {
    color: Colors.success,
  },
  expenseValue: {
    color: Colors.error,
  },
  chartSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  chartPlaceholderText: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.md,
  },
  chartPlaceholderSubtext: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  categorySection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  categoryName: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  categoryAmount: {
    fontSize: FontSize.md,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
});
