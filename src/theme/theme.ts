import { Platform } from 'react-native';

// SumUp Theme - White/Blue/Cyan color palette
export const Colors = {
  // Primary colors
  white: '#FFFFFF',
  black: '#0B0B0B',
  primaryBlue: '#0A84FF',
  accentCyan: '#00D1FF',
  
  // Grayscale
  darkGray: '#1A1A1A',
  mediumGray: '#666666',
  lightGray: '#E5E5E5',
  veryLightGray: '#F5F5F5',
  
  // Semantic colors
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  
  // Text colors
  textPrimary: '#0B0B0B',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Additional colors for layout
  background: '#F5F5F5',
  border: '#E5E5E5',
  primary: '#0A84FF',
  primaryLight: '#64B5F6',
  text: '#0B0B0B',
  textMuted: '#666666',
  backgroundSecondary: '#FBFBFB',
  card: '#FFFFFF',
  error: '#FF3B30',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  huge: 48,
};

export const Shadow = {
  small: {
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.primaryBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.accentCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

// Font weights (to use with fontWeight style prop)
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// Common gradients for cards
export const Layout = {
  tabBarHeight: 60,
  headerHeight: 44,
  screenPadding: 16,
};

export const Gradients = {
  blueCard: [Colors.primaryBlue, Colors.accentCyan],
  whiteCard: [Colors.white, Colors.veryLightGray],
  darkCard: [Colors.darkGray, Colors.black],
};

// Re-export useTheme from the context file
export { useTheme, ThemeProvider } from './themeContext';
