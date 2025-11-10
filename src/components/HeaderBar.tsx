import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/themeContext';
import { FontWeight, Colors, Spacing, FontSize, BorderRadius } from '../theme/theme';
import { useAccount } from '../context/AccountContext';

interface HeaderBarProps {
  small?: boolean;
  onProfilePress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ small = false, onProfilePress }) => {
  const theme = useTheme();
  const { language, showAccountWarning } = useAccount();
  
  const content = (
    <View>
      <Text accessibilityRole="header" style={[styles.bankTitle, { color: theme.colors.text, fontSize: small ? 18 : 22 }]}>SumUp</Text>
      <Text style={[styles.greeting, { color: theme.colors.text }]}>Hei, Aku Ankka</Text>
      <Text style={[styles.owner, { color: theme.colors.muted }]}>Tilinomistaja: Firma Oy</Text>
      {showAccountWarning && (
        <View style={[styles.warningBanner, { backgroundColor: Colors.warning + '10' }]} accessible accessibilityRole="alert">
          <View style={styles.warningLeft}> 
            <View style={[styles.warningTriangle, { borderBottomColor: Colors.warning }]} />
          </View>
          <View style={styles.warningContent}>
            <Text style={styles.warningText} numberOfLines={2}>
              {language === 'en'
                ? 'You cannot perform actions on this account right now — account review or account closure is in progress.'
                : 'Et voi tällä hetkellä tehdä tililläsi mitään, koska tarkastelu tai käyttäjätilin lopetus on kesken.'}
            </Text>
          </View>
        </View>
      )}
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
  owner: { marginTop: 2, fontSize: 12, fontWeight: FontWeight.regular, opacity: 0.9 },
  warningBanner: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  warningText: {
    marginLeft: Spacing.sm,
    color: Colors.warning,
    fontSize: FontSize.xs,
  }
  ,
  warningLeft: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  warningContent: {
    flex: 1,
  }
});

export default HeaderBar;
