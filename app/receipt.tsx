import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBar } from '../src/components/HeaderBar';
import { Card } from '../src/components/Card';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadow } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';

export default function ReceiptScreen() {
  const { transactions, accountNumber } = useAccount();
  // Get the most recent transaction as the receipt example
  const recentTransaction = transactions[0] || {
    id: '1',
    title: 'Maksu',
    amount: -15.90,
    date: new Date().toISOString(),
    category: 'Yleinen',
    status: 'completed' as const,
    recipient: 'Vastaanottaja',
    type: 'debit' as const,
  };

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `SumUp Kuitti\n\nTapahtuma: ${recentTransaction.title}\nSumma: ${formatCurrency(recentTransaction.amount)}\nPäivämäärä: ${formatDate(recentTransaction.date)}\nTila: ${recentTransaction.status}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Mock download action
  };

  const handlePrint = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Mock print action
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Kuitti</Text>
          <Text style={styles.subtitle}>Tapahtuman tiedot</Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptSection}>
          <Card elevation="large">
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <View style={styles.logoCircle}>
                <Ionicons name="wallet" size={32} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.companyName}>SumUp</Text>
              <Text style={styles.companySubtitle}>Maksujärjestelmä</Text>
            </View>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.success}
              />
              <Text style={styles.statusText}>
                {recentTransaction.status.toUpperCase()}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Amount */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Summa</Text>
              <Text
                style={[
                  styles.amount,
                  recentTransaction.type === 'credit' && styles.amountCredit,
                ]}
              >
                {formatCurrency(recentTransaction.amount)}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tapahtumatunnus</Text>
                <Text style={styles.detailValue}>
                  #{recentTransaction.id.padStart(8, '0')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Päivämäärä</Text>
                <Text style={styles.detailValue}>
                  {formatDate(recentTransaction.date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Aika</Text>
                <Text style={styles.detailValue}>
                  {formatTime(recentTransaction.date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kuvaus</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.title}
                </Text>
              </View>

              {recentTransaction.recipient && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Vastaanottaja</Text>
                  <Text style={styles.detailValue}>
                    {recentTransaction.recipient}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Kategoria</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.category}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tili</Text>
                <Text style={styles.detailValue}>
                  {accountNumber}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tyyppi</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.type === 'credit' ? 'Tulo' : 'Meno'}
                </Text>
              </View>
            </View>

            {/* QR Code Placeholder */}
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code-outline" size={80} color={Colors.primaryBlue} />
              </View>
              <Text style={styles.qrText}>Skannaa varmistaaksesi</Text>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            accessibilityLabel="Jaa kuitti"
          >
            <Ionicons name="share-outline" size={24} color={Colors.primaryBlue} />
            <Text style={styles.actionButtonText}>Jaa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            accessibilityLabel="Lataa kuitti"
          >
            <Ionicons name="download-outline" size={24} color={Colors.primaryBlue} />
            <Text style={styles.actionButtonText}>Lataa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrint}
            accessibilityLabel="Tulosta kuitti"
          >
            <Ionicons name="print-outline" size={24} color={Colors.primaryBlue} />
            <Text style={styles.actionButtonText}>Tulosta</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tämä on virallinen kuitti SumUp-maksusta.
          </Text>
          <Text style={styles.footerText}>
            Säilytä tämä tietueidesi vuoksi.
          </Text>
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
  receiptSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  companyHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.veryLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
  },
  companyName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  companySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.veryLightGray,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: Spacing.lg,
  },
  amountSection: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  amount: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  amountCredit: {
    color: Colors.success,
  },
  detailsSection: {
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    flex: 1,
    textAlign: 'right',
  },
  qrSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: Colors.veryLightGray,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  qrText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
