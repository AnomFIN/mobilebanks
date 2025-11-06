import { Platform } from 'react-native';

// SumUp Color Palette - White/Blue/Black theme with neon-like cyan accent
export const Colors = {
  // Primary colors
  white: '#FFFFFF',
  black: '#0B0B0B',
  primary: '#0A84FF',      // iOS-style blue
  accent: '#00D1FF',       // Neon cyan accent
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F7',
  backgroundTertiary: '#E5E5EA',
  
  // Card colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E5EA',
  
  // Text colors
  text: '#0B0B0B',
  textSecondary: '#86868B',
  textTertiary: '#C7C7CC',
  
  // Status colors
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#0A84FF',
  
  // UI element colors
  border: '#E5E5EA',
  separator: '#D1D1D6',
  overlay: 'rgba(0, 0, 0, 0.4)',
  
  // Gradient colors for cards
  gradientStart: '#0A84FF',
  gradientEnd: '#00D1FF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

export const Shadow = {
  small: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  accent: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Typography presets
export const Typography = {
  h1: {
    fontSize: FontSize.huge,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 56,
  },
  h2: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    lineHeight: 40,
  },
  h3: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 32,
  },
  body: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    color: Colors.text,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  small: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
};

// Layout constants
export const Layout = {
  screenPadding: Spacing.lg,
  cardPadding: Spacing.lg,
  sectionSpacing: Spacing.xl,
  tabBarHeight: Platform.OS === 'ios' ? 85 : 65,
};
