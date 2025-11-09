import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import Card from '../components/Card';

const mockMonthlyData = [
  { month: 'Marras', income: 3200, expenses: 1850 },
  { month: 'Loka', income: 2800, expenses: 2100 },
  { month: 'Syys', income: 3500, expenses: 1950 },
  { month: 'Elo', income: 2900, expenses: 2300 },
  { month: 'Heinä', income: 3100, expenses: 1700 },
  { month: 'Kesä', income: 3300, expenses: 2400 },
];

const Raportit: React.FC = () => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePeriodChange = (period: 'month' | 'quarter' | 'year') => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setSelectedPeriod(period);
  };

  const totalIncome = mockMonthlyData.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = mockMonthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderBar small />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Raportit</Text>
          
          <View style={styles.periodSelector}>
            {(['month', 'quarter', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  { backgroundColor: selectedPeriod === period ? theme.colors.primary : theme.colors.surface },
                ]}
                onPress={() => handlePeriodChange(period)}
                accessibilityLabel={`Näytä ${period === 'month' ? 'kuukausi' : period === 'quarter' ? 'vuosineljännes' : 'vuosi'} raportti`}
                accessibilityRole="button"
              >
                <Text style={[styles.periodButtonText, { color: selectedPeriod === period ? '#FFFFFF' : theme.colors.text }]}>
                  {period === 'month' ? 'Kuukausi' : period === 'quarter' ? 'Q' : 'Vuosi'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Card>
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Tulot</Text>
                  <Text style={styles.summaryIncome}>+{totalIncome.toFixed(2)} €</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Menot</Text>
                  <Text style={styles.summaryExpense}>-{totalExpenses.toFixed(2)} €</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Netto</Text>
                  <Text style={[styles.summaryNet, { color: netBalance >= 0 ? '#34C759' : '#FF3B30' }]}>
                    {netBalance >= 0 ? '+' : ''}{netBalance.toFixed(2)} €
                  </Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kuukausittainen yhteenveto</Text>
          
          {mockMonthlyData.map((data, index) => {
            const net = data.income - data.expenses;
            const maxValue = Math.max(...mockMonthlyData.map(d => Math.max(d.income, d.expenses)));
            const incomeBar = (data.income / maxValue) * 100;
            const expenseBar = (data.expenses / maxValue) * 100;
            
            return (
              <View key={index} style={[styles.monthCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.monthHeader}>
                  <Text style={[styles.monthName, { color: theme.colors.text }]}>{data.month}</Text>
                  <Text style={[styles.monthNet, { color: net >= 0 ? '#34C759' : '#FF3B30' }]}>
                    {net >= 0 ? '+' : ''}{net.toFixed(2)} €
                  </Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View style={styles.barRow}>
                    <Text style={[styles.barLabel, { color: theme.colors.text }]}>Tulot</Text>
                    <View style={styles.barWrapper}>
                      <View style={[styles.bar, styles.incomeBar, { width: `${incomeBar}%` }]} />
                    </View>
                    <Text style={[styles.barValue, { color: theme.colors.text }]}>{data.income} €</Text>
                  </View>
                  
                  <View style={styles.barRow}>
                    <Text style={[styles.barLabel, { color: theme.colors.text }]}>Menot</Text>
                    <View style={styles.barWrapper}>
                      <View style={[styles.bar, styles.expenseBar, { width: `${expenseBar}%` }]} />
                    </View>
                    <Text style={[styles.barValue, { color: theme.colors.text }]}>{data.expenses} €</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  periodSelector: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  periodButton: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  periodButtonText: { fontSize: 14, fontWeight: '600' },
  summaryCard: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  summaryItem: { alignItems: 'center' },
  summaryLabel: { fontSize: 12, color: '#FFFFFF', opacity: 0.8, marginBottom: 4, fontWeight: '500' },
  summaryIncome: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  summaryExpense: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  summaryNet: { fontSize: 20, fontWeight: '700' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 16 },
  monthCard: { borderRadius: 12, padding: 16, marginBottom: 12 },
  monthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthName: { fontSize: 16, fontWeight: '700' },
  monthNet: { fontSize: 16, fontWeight: '700' },
  barContainer: { gap: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { width: 50, fontSize: 12, fontWeight: '600' },
  barWrapper: { flex: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 10, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 10 },
  incomeBar: { backgroundColor: '#34C759' },
  expenseBar: { backgroundColor: '#FF3B30' },
  barValue: { width: 70, fontSize: 12, fontWeight: '600', textAlign: 'right' },
});

export default Raportit;
