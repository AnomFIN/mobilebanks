import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Platform } from 'react-native';

// SumUp Color Palette - White/Blue/Cyan theme
export const Colors = {
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  
  // Primary colors
  primary: '#0A84FF',
  primaryDark: '#0066CC',
  primaryLight: '#4DA3FF',
  
  // Accent color
  accent: '#00D1FF',
  accentLight: '#33DDFF',
  
  // Text colors
  text: '#0B0B0B',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  
  // UI colors
  white: '#FFFFFF',
  black: '#0B0B0B',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Status colors
  success: '#10B981',
  successLight: '#D1FAE5',
  error: '#EF4444',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  // Card & Surface colors
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Gradient colors
  gradientStart: '#0A84FF',
  gradientEnd: '#00D1FF',
};

// Spacing constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// Font sizes
export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// Font weights
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Shadow styles
export const Shadow = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Animation durations
export const AnimationDuration = {
  fast: 150,
  normal: 250,
  slow: 350,
};

// Theme type
export type Theme = {
  colors: typeof Colors;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  fontSize: typeof FontSize;
  fontWeight: typeof FontWeight;
  shadow: typeof Shadow;
  animationDuration: typeof AnimationDuration;
  isDark: boolean;
};

// Light theme (default for SumUp)
export const lightTheme: Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSize: FontSize,
  fontWeight: FontWeight,
  shadow: Shadow,
  animationDuration: AnimationDuration,
  isDark: false,
};

// Dark theme (optional, for toggle support)
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...Colors,
    background: '#0B0B0B',
    backgroundSecondary: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    card: '#1A1A1A',
    cardBorder: '#374151',
    border: '#374151',
  },
  isDark: true,
};

// Theme context
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
