import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

const HeaderBar: React.FC<{ small?: boolean }> = ({ small = false }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View>
        <Text accessibilityRole="header" style={[styles.bankTitle, { color: theme.colors.text, fontSize: small ? 18 : 22 }]}>SumUp</Text>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>Hei, Aku Ankka</Text>
        <Text style={[styles.owner, { color: theme.colors.muted }]}>Tilinomistaja: Firma Oy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { paddingHorizontal: 16, paddingVertical: 14 }, 
  bankTitle: { fontWeight: '800' }, 
  greeting: { marginTop: 4, fontSize: 16, fontWeight: '600' }, 
  owner: { marginTop: 2, fontSize: 12, fontWeight: '400', opacity: 0.9 } 
});

export default HeaderBar;
