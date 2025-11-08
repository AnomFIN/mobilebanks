import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/themeContext';
import { FontWeight } from '../theme/theme';

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
  bankTitle: { fontWeight: FontWeight.heavy }, 
  greeting: { marginTop: 4, fontSize: 16, fontWeight: FontWeight.semibold }, 
  owner: { marginTop: 2, fontSize: 12, fontWeight: FontWeight.regular, opacity: 0.9 } 
});

export default HeaderBar;
