import React, { createContext, useContext, useState } from 'react';
import { Platform } from 'react-native';

export const defaultColors = {
  background: '#FFFFFF',
  surface: '#FBFDFF',
  primary: '#0A84FF',
  accent: '#00D1FF',
  text: '#0B0B0B',
  muted: '#6B7280',
  cardGradientStart: '#0A84FF',
  cardGradientEnd: '#00D1FF',
  shadow: 'rgba(10,132,255,0.12)',
};

export const spacing = { xs: 6, s: 8, m: 16, l: 24, xl: 32 };
export const fontSizes = { small: 12, body: 16, title: 20, largeTitle: 28 };

type Theme = { colors: typeof defaultColors; spacing: typeof spacing; fontSizes: typeof fontSizes; mode: 'light' | 'dark'; toggleMode: () => void };
const ThemeContext = createContext<Theme>({ colors: defaultColors, spacing, fontSizes, mode: 'light', toggleMode: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const toggleMode = () => setMode(m => (m === 'light' ? 'dark' : 'light'));
  const colors = { ...defaultColors } as typeof defaultColors;
  if (mode === 'dark') {
    colors.background = '#0B0B0B';
    colors.surface = '#0F1724';
    colors.text = '#FFFFFF';
    colors.muted = '#9CA3AF';
  }
  return <ThemeContext.Provider value={{ colors, spacing, fontSizes, mode, toggleMode }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

// Additional exports for backward compatibility with other files
export const Colors = {
  black: '#000000',
  white: '#FFFFFF',
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  cardBackground: '#FFFFFF',
  primary: '#0A84FF',
  accent: '#00D1FF',
  text: '#0B0B0B',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#00FFAE',
  danger: '#FF006E',
  warning: '#FFB800',
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
  huge: 56,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  tabBarHeight: Platform.OS === 'ios' ? 84 : 64,
};
