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
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../constants';
import { mockTransactions, mockAccount } from '../mockData';

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
        message: `Receipt from Helsinki eBike Service Oy\n\nTransaction: ${recentTransaction.title}\nAmount: ${formatCurrency(recentTransaction.amount)}\nDate: ${formatDate(recentTransaction.date)}\nStatus: ${recentTransaction.status}`,
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
          <Text style={styles.title}>Receipt</Text>
          <Text style={styles.subtitle}>Transaction details</Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          <LinearGradient
            colors={[Colors.gray, Colors.darkGray]}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Company Header */}
            <View style={styles.companyHeader}>
              <View style={styles.logoCircle}>
                <Ionicons name="bicycle" size={32} color={Colors.neonGreen} />
              </View>
              <Text style={styles.companyName}>
                Helsinki eBike Service Oy
              </Text>
              <Text style={styles.companySubtitle}>Yritystili</Text>
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
              <Text style={styles.amountLabel}>Amount</Text>
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
                <Text style={styles.detailLabel}>Transaction ID</Text>
                <Text style={styles.detailValue}>
                  #{recentTransaction.id.padStart(8, '0')}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailValue}>
                  {formatDate(recentTransaction.date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.title}
                </Text>
              </View>

              {recentTransaction.recipient && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Recipient</Text>
                  <Text style={styles.detailValue}>
                    {recentTransaction.recipient}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.category}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Account</Text>
                <Text style={styles.detailValue}>
                  {mockAccount.accountNumber}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>
                  {recentTransaction.type === 'credit' ? 'Credit' : 'Debit'}
                </Text>
              </View>
            </View>

            {/* QR Code Placeholder */}
            <View style={styles.qrSection}>
              <View style={styles.qrPlaceholder}>
                <Ionicons name="qr-code" size={80} color={Colors.neonGreen} />
              </View>
              <Text style={styles.qrText}>Scan to verify</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={Colors.white} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
          >
            <Ionicons name="download-outline" size={24} color={Colors.white} />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrint}
          >
            <Ionicons name="print-outline" size={24} color={Colors.white} />
            <Text style={styles.actionButtonText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is an official receipt from Helsinki eBike Service Oy.
          </Text>
          <Text style={styles.footerText}>
            Keep this for your records.
          </Text>
        </View>
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
  receiptCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadow.large,
  },
  gradient: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  companyHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.neonGreen,
  },
  companyName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  companySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: '700',
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
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    color: Colors.white,
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
    color: Colors.white,
    fontWeight: '600',
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
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
    backgroundColor: Colors.gray,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: '600',
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
