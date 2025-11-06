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
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { mockTransactions, mockAccount } from '../mockData';
import { Card } from '../src/components/Card';

export default function ReceiptScreen() {
  // Get the most recent transaction as the receipt example
  const recentTransaction = mockTransactions[0];

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-FI', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await Share.share({
        message: `Receipt from SumUp\n\nTransaction: ${recentTransaction.title}\nAmount: ${formatCurrency(recentTransaction.amount)}\nDate: ${formatDate(recentTransaction.date)}\nStatus: ${recentTransaction.status}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, this would download the receipt
    alert('Receipt downloaded! 📄');
  };

  const handlePrint = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would print the receipt
    alert('Print functionality coming soon! 🖨️');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kuitti</Text>
          <Text style={styles.subtitle}>Tapahtuman tiedot</Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCardContainer}>
          <Card gradient gradientColors={[Colors.gradientStart, Colors.gradientEnd]}>
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <View style={styles.logoCircle}>
                <Ionicons name="card-outline" size={32} color={Colors.white} />
              </View>
              <Text style={styles.companyName}>SumUp</Text>
              <Text style={styles.companySubtitle}>Mobile Banking</Text>
            </View>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.white}
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
              <Text style={styles.amount}>
                {formatCurrency(recentTransaction.amount)}
              </Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tapahtuma ID</Text>
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
                  {mockAccount.accountNumber}
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
                <Ionicons name="qr-code" size={80} color={Colors.white} />
              </View>
              <Text style={styles.qrText}>Skannaa vahvistaaksesi</Text>
            </View>
          </Card>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
            accessibilityLabel="Share receipt"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Jaa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            accessibilityLabel="Download receipt"
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Lataa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrint}
            accessibilityLabel="Print receipt"
            accessibilityRole="button"
          >
            <Ionicons name="print-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Tulosta</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Tämä on virallinen kuitti SumUpilta.
          </Text>
          <Text style={styles.footerText}>
            Säilytä tämä omissa tiedostoissasi.
          </Text>
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
  receiptCardContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  companyHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  companyName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  companySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: Spacing.lg,
  },
  amountSection: {
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: FontSize.sm,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: Spacing.sm,
  },
  amount: {
    fontSize: FontSize.xxxxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
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
    color: Colors.white,
    opacity: 0.7,
    flex: 1,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.white,
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  qrText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    opacity: 0.7,
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
    backgroundColor: Colors.card,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.small,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: FontWeight.semibold,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
