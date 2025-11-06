import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing } from '../theme/theme';

interface HeaderBarProps {
  userName?: string;
  companyName?: string;
  onProfilePress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userName = 'Aku Ankka',
  companyName = 'Firma Oy',
  onProfilePress,
}) => {
  return (
    <View style={styles.container} accessibilityLabel="SumUp header with user greeting">
      <View style={styles.leftSection}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>SumUp</Text>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>Hei, {userName}</Text>
          <Text style={styles.companyInfo}>Tilinomistaja: {companyName}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={onProfilePress}
        accessibilityLabel="Profile button"
        accessibilityRole="button"
      >
        <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
  leftSection: {
    flex: 1,
  },
  brandContainer: {
    marginBottom: Spacing.xs,
  },
  brandName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  greetingContainer: {
    marginTop: Spacing.xs,
  },
  greeting: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  companyInfo: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  profileButton: {
    padding: Spacing.xs,
  },
});
