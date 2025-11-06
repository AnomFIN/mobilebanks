import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/theme';

interface HeaderBarProps {
  small?: boolean;
  onProfilePress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ small = false, onProfilePress }) => {
  const theme = useTheme();
  
  const content = (
    <View>
      <Text accessibilityRole="header" style={[styles.bankTitle, { color: theme.colors.text, fontSize: small ? 18 : 22 }]}>SumUp</Text>
      <Text style={[styles.greeting, { color: theme.colors.text }]}>Hei, Aku Ankka</Text>
      <Text style={[styles.owner, { color: theme.colors.muted }]}>Tilinomistaja: Firma Oy</Text>
    </View>
  );

  if (onProfilePress) {
    return (
      <TouchableOpacity 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {content}
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
