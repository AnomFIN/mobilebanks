import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Shadow, Spacing, AnimationDuration } from '../theme/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  animated?: boolean;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  gradient = false,
  gradientColors = [Colors.gradientStart, Colors.gradientEnd] as const,
  animated = true,
  accessibilityLabel,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: AnimationDuration.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animated, fadeAnim, scaleAnim]);

  const animatedStyle = animated
    ? {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }
    : {};

  if (gradient) {
    return (
      <Animated.View
        style={[styles.container, animatedStyle, style]}
        accessibilityLabel={accessibilityLabel}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.container, styles.cardStyle, animatedStyle, style]}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  cardStyle: {
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.medium,
  },
  gradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
});
