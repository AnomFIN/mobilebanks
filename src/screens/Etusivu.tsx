import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import Card from '../components/Card';

const mockTransactions = [
  { id: '1', title: 'Kauppa Oy', amount: -45.50, date: '2025-11-05', type: 'debit' },
  { id: '2', title: 'Palkka', amount: 2500.00, date: '2025-11-04', type: 'credit' },
  { id: '3', title: 'Vuokra', amount: -850.00, date: '2025-11-03', type: 'debit' },
  { id: '4', title: 'Asiakaslasku', amount: 1200.00, date: '2025-11-02', type: 'credit' },
  { id: '5', title: 'Verkkokauppa', amount: -99.90, date: '2025-11-01', type: 'debit' },
];

const Etusivu: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleQuickAction = (action: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    if (action === 'receipt') {
      navigation.navigate('Kuitti');
    }
  };

  const formatCurrency = (amount: number) => `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} €`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar />
        
        <Animated.View style={[styles.balanceCard, { transform: [{ scale: scaleAnim }] }]}>
          <Card>
            <View style={styles.balanceContent}>
              <View>
                <Text style={styles.balanceLabel}>Kokonaissaldo</Text>
                <Text style={styles.balanceAmount}>5,234.60 €</Text>
                <Text style={styles.accountNumber}>FI12 3456 7890 1234 56</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Maksut')}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionIconText}>💸</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Maksa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Raportit')}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionIconText}>📊</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Raportit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => handleQuickAction('receipt')}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionIconText}>🧾</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Kuitti</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionIconText}>💳</Text>
            </View>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>Kortti</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Viimeisimmät tapahtumat</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Raportit')}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Näytä kaikki</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.transactionList, { backgroundColor: theme.colors.surface }]}>
            {mockTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={transaction.id}
                style={[
                  styles.transactionItem,
                  index < mockTransactions.length - 1 && styles.transactionItemBorder,
                ]}
                onPress={() => navigation.navigate('Kuitti')}
              >
                <View style={[styles.transactionIcon, { backgroundColor: transaction.type === 'credit' ? '#34C759' : theme.colors.muted }]}>
                  <Text style={styles.transactionIconText}>{transaction.type === 'credit' ? '↓' : '↑'}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>{transaction.title}</Text>
                  <Text style={[styles.transactionDate, { color: theme.colors.muted }]}>{transaction.date}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: transaction.type === 'credit' ? '#34C759' : theme.colors.text }]}>
                  {formatCurrency(transaction.amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  balanceCard: { marginHorizontal: 16, marginVertical: 8 },
  balanceContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { fontSize: 14, color: '#FFFFFF', opacity: 0.9, marginBottom: 4, fontWeight: '500' },
  balanceAmount: { fontSize: 36, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  accountNumber: { fontSize: 12, color: '#FFFFFF', opacity: 0.8, fontFamily: 'monospace' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 24 },
  actionButton: { alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionIconText: { fontSize: 24 },
  actionText: { fontSize: 12, fontWeight: '600' },
  section: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  transactionList: { borderRadius: 16, overflow: 'hidden' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16 },
  transactionItemBorder: { borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transactionIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  transactionDetails: { flex: 1 },
  transactionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  transactionDate: { fontSize: 12 },
  transactionAmount: { fontSize: 16, fontWeight: '700' },
});

export default Etusivu;
