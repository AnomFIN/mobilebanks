import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '../theme/theme';

interface HeaderBarProps {
  bankName?: string;
  greeting?: string;
  ownerText?: string;
  onProfilePress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  bankName = 'SumUp',
  greeting = 'Hei, Aku Ankka',
  ownerText = 'Tilinomistaja: Firma Oy',
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.bankName}>{bankName}</Text>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.ownerText}>{ownerText}</Text>
        </View>
      </View>
      {onProfilePress && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
          accessibilityLabel="Open profile"
        >
          <Ionicons name="person-circle-outline" size={32} color={Colors.primaryBlue} />
        </TouchableOpacity>
      )}
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
    backgroundColor: Colors.white,
  },
  leftSection: {
    flex: 1,
  },
  bankName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
    marginBottom: Spacing.xs,
  },
  greetingContainer: {
    marginTop: Spacing.xs,
  },
  greeting: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  ownerText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  profileButton: {
    padding: Spacing.xs,
  },
});
