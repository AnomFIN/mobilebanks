import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';

export default function HomeScreen() {
  const { balance, transactions, accountNumber } = useAccount();
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleQuickAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action === 'payment') {
      router.push('/payment');
    }
  };

  const handleTransactionPress = (transactionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/receipt');
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-FI', {
      month: 'short',
      day: 'numeric',
    });
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with SumUp branding */}
        <HeaderBar
          userName="Aku Ankka"
          companyName="Firma Oy"
          onProfilePress={handlePress}
        />

        {/* Balance Card with gradient */}
        <View style={styles.balanceCardContainer}>
          <Card gradient gradientColors={[Colors.gradientStart, Colors.gradientEnd]}>
            <View style={styles.balanceContent}>
              <View>
                <Text style={styles.balanceLabel}>Kokonaissaldo</Text>
                <Text style={styles.balanceAmount}>
                  {balance.toFixed(2)} €
                </Text>
                <Text style={styles.accountNumber}>{accountNumber}</Text>
              </View>
              <View style={styles.logoContainer}>
                <Ionicons name="card-outline" size={40} color={Colors.white} />
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('payment')}
            accessibilityLabel="Create payment"
            accessibilityRole="button"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="send-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Luo maksu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('request')}
            accessibilityLabel="Request payment"
            accessibilityRole="button"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="download-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Pyydä</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('exchange')}
            accessibilityLabel="Exchange currency"
            accessibilityRole="button"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="swap-horizontal-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Vaihda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleQuickAction('topup')}
            accessibilityLabel="Top up account"
            accessibilityRole="button"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="wallet-outline" size={24} color={Colors.white} />
            </View>
            <Text style={styles.actionText}>Lataa</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Viimeaikaiset tapahtumat</Text>
            <TouchableOpacity onPress={handlePress} accessibilityLabel="View all transactions" accessibilityRole="button">
              <Text style={styles.seeAll}>Näytä kaikki</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionItem}
              onPress={() => handleTransactionPress(transaction.id)}
              accessibilityLabel={`Transaction: ${transaction.title}, ${formatCurrency(transaction.amount)}`}
              accessibilityRole="button"
            >
              <View style={[
                styles.transactionIcon,
                transaction.type === 'credit' ? styles.transactionIconCredit : styles.transactionIconDebit
              ]}>
                <Ionicons
                  name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                  size={20}
                  color={Colors.white}
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
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
          ))}
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
  balanceCardContainer: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  balanceAmount: {
    fontSize: FontSize.xxxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  accountNumber: {
    fontSize: FontSize.xs,
    color: Colors.white,
    opacity: 0.8,
    fontFamily: 'monospace',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.medium,
  },
  actionText: {
    fontSize: FontSize.xs,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.small,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionIconCredit: {
    backgroundColor: Colors.success,
  },
  transactionIconDebit: {
    backgroundColor: Colors.textMuted,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  transactionDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  transactionAmountCredit: {
    color: Colors.success,
  },
});
