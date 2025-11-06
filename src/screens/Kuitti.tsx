import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/theme';

const Kuitti: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'SumUp Kuitti\n\nKauppa Oy\n-45.50 €\n2025-11-05 14:23\n\nTapahtuma ID: TXN123456789',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const receiptData = {
    merchant: 'Kauppa Oy',
    amount: -45.50,
    date: '2025-11-05',
    time: '14:23',
    transactionId: 'TXN123456789',
    accountNumber: 'FI12 3456 7890 1234 56',
    type: 'Ostos',
    category: 'Ruoka ja juoma',
    status: 'Valmis',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Takaisin"
          accessibilityRole="button"
        >
          <Text style={[styles.backButtonText, { color: theme.colors.primary }]}>← Takaisin</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
          accessibilityLabel="Jaa kuitti"
          accessibilityRole="button"
        >
          <Text style={styles.shareIcon}>↗️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.icon}>🧾</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>Maksukuitti</Text>
          <Text style={[styles.statusBadge, { backgroundColor: '#34C759' + '20', color: '#34C759' }]}>
            {receiptData.status}
          </Text>

          <View style={[styles.amountCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.amountLabel, { color: theme.colors.muted }]}>Summa</Text>
            <Text style={[styles.amount, { color: theme.colors.text }]}>
              {receiptData.amount.toFixed(2)} €
            </Text>
          </View>

          <View style={[styles.detailsCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Kauppias</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{receiptData.merchant}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Päivämäärä</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{receiptData.date}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Aika</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{receiptData.time}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Tyyppi</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{receiptData.type}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Kategoria</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text }]}>{receiptData.category}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Tilinumero</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text, fontFamily: 'monospace' }]}>
                {receiptData.accountNumber}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.muted + '20' }]} />
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.colors.muted }]}>Tapahtuma ID</Text>
              <Text style={[styles.detailValue, { color: theme.colors.text, fontFamily: 'monospace' }]}>
                {receiptData.transactionId}
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              accessibilityLabel="Lataa PDF"
              accessibilityRole="button"
            >
              <Text style={styles.actionIcon}>📄</Text>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Lataa PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
              accessibilityLabel="Lähetä sähköpostilla"
              accessibilityRole="button"
            >
              <Text style={styles.actionIcon}>✉️</Text>
              <Text style={[styles.actionText, { color: theme.colors.text }]}>Lähetä email</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.footerText, { color: theme.colors.muted }]}>
            Kiitos käytöstä! 🙏
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 16, fontWeight: '600' },
  shareButton: { padding: 8 },
  shareIcon: { fontSize: 20 },
  scrollContent: { paddingBottom: 40 },
  content: { padding: 16, alignItems: 'center' },
  iconContainer: { marginVertical: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 40 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 12 },
  statusBadge: { fontSize: 14, fontWeight: '600', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 24 },
  amountCard: { width: '100%', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  amountLabel: { fontSize: 14, marginBottom: 8 },
  amount: { fontSize: 48, fontWeight: '700' },
  detailsCard: { width: '100%', borderRadius: 16, padding: 20, marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  detailLabel: { fontSize: 14, fontWeight: '500' },
  detailValue: { fontSize: 14, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: 16 },
  divider: { height: 1 },
  actions: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 24 },
  actionButton: { flex: 1, borderRadius: 12, padding: 16, alignItems: 'center' },
  actionIcon: { fontSize: 24, marginBottom: 8 },
  actionText: { fontSize: 14, fontWeight: '600' },
  footerText: { fontSize: 14, textAlign: 'center' },
});

export default Kuitti;
