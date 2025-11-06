import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow, Gradients } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';

export default function HomeScreen() {
  const { balance, transactions, accountNumber } = useAccount();
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      month: 'short',
      day: 'numeric',
    });
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar
        onProfilePress={handlePress}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <Animated.View style={[styles.balanceCardContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Card gradient gradientColors={Gradients.blueCard} elevation="large">
            <View style={styles.balanceContent}>
              <View>
                <Text style={styles.balanceLabel}>Kokonaissaldo</Text>
                <Text style={styles.balanceAmount}>
                  {balance.toFixed(2)} €
                </Text>
                <Text style={styles.accountNumber}>{accountNumber}</Text>
              </View>
              <View style={styles.logoContainer}>
                <Ionicons name="wallet" size={36} color={Colors.white} />
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/payment');
            }}
            accessibilityLabel="Luo uusi maksu"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="send" size={24} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.actionText}>Maksu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/statement');
            }}
            accessibilityLabel="Näytä raportit"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="bar-chart" size={24} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.actionText}>Raportit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/receipt');
            }}
            accessibilityLabel="Näytä kuitti"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="document-text" size={24} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.actionText}>Kuitti</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            accessibilityLabel="Lisää toimintoja"
          >
            <View style={styles.actionIcon}>
              <Ionicons name="ellipsis-horizontal" size={24} color={Colors.primaryBlue} />
            </View>
            <Text style={styles.actionText}>Lisää</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Viimeaikaiset tapahtumat</Text>
            <TouchableOpacity
              onPress={() => {
                handlePress();
                router.push('/statement');
              }}
            >
              <Text style={styles.seeAll}>Näytä kaikki</Text>
            </TouchableOpacity>
          </View>

          <Card>
            {recentTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  index === recentTransactions.length - 1 && styles.transactionItemLast,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/receipt');
                }}
                accessibilityLabel={`Tapahtuma: ${transaction.title}`}
              >
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === 'credit' ? styles.transactionIconCredit : styles.transactionIconDebit,
                  ]}
                >
                  <Ionicons
                    name={transaction.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                    size={18}
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
          </Card>
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
  },
  balanceAmount: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  accountNumber: {
    fontSize: FontSize.xs,
    color: Colors.white,
    opacity: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    paddingVertical: Spacing.md,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadow.medium,
  },
  actionText: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
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
  transactionDetails: {
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
  transactionAmount: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  transactionAmountCredit: {
    color: Colors.success,
  },
});
