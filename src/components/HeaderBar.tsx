import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight } from '../theme/theme';

interface HeaderBarProps {
  userName?: string;
  companyName?: string;
  showProfile?: boolean;
  onProfilePress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  userName = 'Aku Ankka',
  companyName = 'Firma Oy',
  showProfile = true,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Hei, {userName}</Text>
        <Text style={styles.companyName}>Tilinomistaja: {companyName}</Text>
      </View>
      {showProfile && (
        <TouchableOpacity
          style={styles.profileButton}
          onPress={onProfilePress}
          accessibilityLabel="Profile button"
        >
          <Ionicons name="person-circle" size={40} color={Colors.primary} />
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
    backgroundColor: Colors.background,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  companyName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
  },
  profileButton: {
    padding: Spacing.xs,
  },
});
