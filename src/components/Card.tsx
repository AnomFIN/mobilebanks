import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadow, Spacing } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: [string, string];
  padding?: number;
  shadow?: 'small' | 'medium' | 'large' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors = [Colors.gradientStart, Colors.gradientEnd],
  padding = Spacing.lg,
  shadow = 'medium',
}) => {
  const shadowStyle = shadow !== 'none' ? Shadow[shadow] : {};
  
  if (gradient) {
    return (
      <View style={[styles.container, shadowStyle, style]}>
        <LinearGradient
          colors={gradientColors}
          style={[styles.gradient, { padding }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.card, shadowStyle, { padding }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  gradient: {
    borderRadius: BorderRadius.lg,
  },
});
