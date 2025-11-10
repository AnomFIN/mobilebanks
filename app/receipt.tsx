import React from 'react';
import { Platform } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { impactAsync, notificationAsync } from '../src/utils/safeHaptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight } from '../src/theme/theme';
import { useAccount } from '../src/context/AccountContext';
import Card from '../src/components/Card';
import HeaderBar from '../src/components/HeaderBar';

export default function ReceiptScreen() {
  const { transactions } = useAccount();
  const { language } = useAccount();
  // Get the most recent transaction as the receipt example
  const recentTransaction = transactions[0];

  const formatCurrency = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;
  };

  const t = (key: string) => {
    if (language === 'en') {
      const en: Record<string, string> = {
        receipt: 'Receipt',
        transactionDetails: 'Transaction details',
        amount: 'Amount',
        transactionId: 'Transaction ID',
        dateTime: 'Date & time',
        description: 'Description',
        recipient: 'Recipient',
        iban: 'IBAN',
        category: 'Category',
        type: 'Type',
        scan: 'Scan to verify',
        footer1: 'This is an official SumUp receipt.',
        footer2: 'Keep this for your records.',
      };
      return en[key] || key;
    }
    const fi: Record<string, string> = {
      receipt: 'Kuitti',
      transactionDetails: 'Tapahtuman tiedot',
      amount: 'Summa',
      transactionId: 'Tapahtumatunnus',
      dateTime: 'Päivämäärä ja aika',
      description: 'Kuvaus',
      recipient: 'Vastaanottaja',
      iban: 'IBAN',
      category: 'Kategoria',
      type: 'Tyyppi',
      scan: 'Skannaa vahvistaaksesi',
      footer1: 'Tämä on virallinen kuitti SumUp:sta.',
      footer2: 'Säilytä tämä omia tietojasi varten.',
    };
    return fi[key] || key;
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
    impactAsync((global as any).Haptics?.ImpactFeedbackStyle?.Medium || 'medium');
    try {
      await Share.share({
        message: `Kuitti SumUp:sta\n\nTapahtuma: ${recentTransaction.title}\nSumma: ${formatCurrency(recentTransaction.amount)}\nPäivämäärä: ${formatDate(recentTransaction.date)}\nTila: ${recentTransaction.status}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDownload = () => {
    notificationAsync((global as any).Haptics?.NotificationFeedbackType?.Success || 'success');
    alert('Kuitti ladattu.');
  };

  const receiptRef = React.useRef<any>(null);

  const handlePrint = async () => {
    impactAsync((global as any).Haptics?.ImpactFeedbackStyle?.Medium || 'medium');
    // Web: try to export receipt as PNG using html2canvas
    if (Platform.OS === 'web') {
      // Dynamically import html2canvas to avoid adding it for native builds
      // @ts-ignore
      import('html2canvas').then((module) => {
        const html2canvas = module.default || module;
        const el = document.getElementById('receipt-root');
        if (!el) {
          alert('Kuittia ei löytynyt tulostettavaksi.');
          return;
        }
        html2canvas(el, { backgroundColor: '#ffffff' }).then((canvas: any) => {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `kuitti_${recentTransaction.id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }).catch((err: any) => {
          console.error('html2canvas error', err);
          alert('Kuvan luonti epäonnistui.');
        });
      }).catch((err) => {
        console.error('Could not load html2canvas', err);
        alert('Tulostus ei ole käytettävissä.');
      });
      return;
    }

    // Native: capture view and share/save (dynamic import to avoid type errors in web)
    try {
      if (!receiptRef.current) {
        alert('Kuittia ei löytynyt tallennettavaksi.');
        return;
      }
      // Dynamically load view-shot and expo-sharing to keep web bundle light
      const viewShotMod = await import('react-native-view-shot');
      const sharingMod = await import('expo-sharing');
      const captureRef = viewShotMod.captureRef || viewShotMod.default?.captureRef;
      const Sharing = sharingMod;
      if (!captureRef) {
        alert('Kuvan luonti ei ole saatavilla tässä laitteessa.');
        return;
      }
      const uri = await captureRef(receiptRef.current, { format: 'png', quality: 1, result: 'tmpfile' });
      if (uri) {
        if (Sharing && Sharing.isAvailableAsync && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(uri, { mimeType: 'image/png' });
        } else {
          alert('Tiedosto tallennettu: ' + uri);
        }
      }
    } catch (err) {
      console.error('view-shot error', err);
      alert('Kuvan luonti epäonnistui.');
    }
  };

  if (!recentTransaction) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Ei kuitissa näytettäviä tapahtumia</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderBar />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('receipt')}</Text>
          <Text style={styles.subtitle}>{t('transactionDetails')}</Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCardContainer}>
          <Card shadow="large" padding={Spacing.xl} ref={receiptRef} {...(Platform.OS === 'web' ? { nativeID: 'receipt-root' } : {})}>
            {/* Company Header */}
            <View style={styles.companyHeaderRow}>
              <View style={styles.companyLeft}>
                <Text style={styles.companyName}>SumUp Bank</Text>
                <Text style={styles.companySubtitle}>Y-tunnus 1234567-8</Text>
              </View>
              <View style={styles.companyRight}>
                <Text style={styles.receiptType}>Kuitti</Text>
                <Text style={styles.receiptDate}>{formatDate(recentTransaction.date)}</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={styles.paperDivider} />

            <View style={styles.amountSectionPaper}>
              <Text style={styles.amountLabelPaper}>{t('amount')}</Text>
              <Text style={[styles.amountPaper, recentTransaction.type === 'credit' && styles.amountCreditPaper]}>
                {formatCurrency(recentTransaction.amount)}
              </Text>
            </View>

            <View style={styles.paperDivider} />

            {/* Transaction Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('transactionId')}</Text>
                <Text style={styles.detailValue}>#{recentTransaction.id.padStart(8, '0')}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('dateTime')}</Text>
                <Text style={styles.detailValue}>{formatDate(recentTransaction.date)}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('description')}</Text>
                <Text style={styles.detailValue}>{recentTransaction.title}</Text>
              </View>

              {recentTransaction.recipient && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('recipient')}</Text>
                  <Text style={styles.detailValue}>{recentTransaction.recipient}</Text>
                </View>
              )}

              {recentTransaction.iban && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{t('iban')}</Text>
                  <Text style={styles.detailValue}>{recentTransaction.iban}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('category')}</Text>
                <Text style={styles.detailValue}>{recentTransaction.category}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('type')}</Text>
                <Text style={styles.detailValue}>{recentTransaction.type === 'credit' ? (language === 'en' ? 'Credit' : 'Tulo') : (language === 'en' ? 'Debit' : 'Meno')}</Text>
              </View>
            </View>

            {/* QR Code Placeholder */}
            <View style={styles.qrSectionPaper}>
              <View style={styles.qrPlaceholderPaper} />
              <Text style={styles.qrTextPaper}>{language === 'en' ? 'Check the transaction in your online bank' : 'Tarkista tapahtuma verkkopankistasi'}</Text>
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
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Jaa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDownload}
            accessibilityLabel="Lataa kuitti"
          >
            <Ionicons name="download-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Lataa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrint}
            accessibilityLabel="Tulosta kuitti"
          >
            <Ionicons name="print-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Tulosta</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('footer1')}</Text>
          <Text style={styles.footerText}>{t('footer2')}</Text>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
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
  companyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  companyLeft: {
    flex: 1,
  },
  companyRight: {
    alignItems: 'flex-end',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  companyName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  companySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    opacity: 0.9,
  },
  receiptType: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
  },
  receiptDate: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
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
  paperDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.lg,
  },
  amountSection: {
    alignItems: 'center',
  },
  amountSectionPaper: {
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  amountLabelPaper: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },
  amountPaper: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  amountCreditPaper: {
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
    opacity: 0.9,
    flex: 1,
    fontWeight: FontWeight.medium,
  },
  detailValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semibold,
    flex: 1,
    textAlign: 'right',
  },
  qrSectionPaper: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  qrPlaceholderPaper: {
    width: 96,
    height: 96,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrTextPaper: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    opacity: 0.9,
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
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
