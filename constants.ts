import { Platform } from 'react-native';

export const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  neonGreen: '#00FFAE',
  gray: '#1A1A1A',
  lightGray: '#333333',
  darkGray: '#0A0A0A',
  textSecondary: '#999999',
  success: '#00FFAE',
  danger: '#FF006E',
  warning: '#FFB800',
  // Additional colors needed by components
  primary: '#0A84FF',
  accent: '#00D1FF',
  background: '#FFFFFF',
  backgroundSecondary: '#FBFDFF',
  border: '#E5E7EB',
  cardBackground: '#1A1A1A',
  text: '#0B0B0B',
  overlay: 'rgba(0, 0, 0, 0.5)',
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
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
};

export const Shadow = {
  small: {
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.neonGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Layout = {
  tabBarHeight: Platform.OS === 'ios' ? 80 : 60,
};
