import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Shadow } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  gradient?: boolean;
  gradientColors?: string[];
  style?: ViewStyle;
  elevation?: 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  gradient = false,
  gradientColors = [Colors.white, Colors.veryLightGray],
  style,
  elevation = 'medium',
}) => {
  const shadowStyle = elevation === 'small' 
    ? Shadow.small 
    : elevation === 'large' 
    ? Shadow.large 
    : Shadow.medium;

  if (gradient) {
    return (
      <View style={[styles.container, shadowStyle, style]}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.solidCard, shadowStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  solidCard: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
  },
  gradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
});
