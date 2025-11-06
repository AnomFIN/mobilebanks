import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

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
} as const;

export const spacing = { xs: 6, s: 8, m: 16, l: 24, xl: 32 } as const;
export const fontSizes = { small: 12, body: 16, title: 20, largeTitle: 28 } as const;

type ColorScheme = {
  background: string;
  surface: string;
  primary: string;
  accent: string;
  text: string;
  muted: string;
  cardGradientStart: string;
  cardGradientEnd: string;
  shadow: string;
};

type Theme = {
  colors: ColorScheme;
  spacing: typeof spacing;
  fontSizes: typeof fontSizes;
  mode: 'light' | 'dark';
  toggleMode: () => void;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = useCallback(() => {
    setMode((m) => (m === 'light' ? 'dark' : 'light'));
  }, []);

  const colors = useMemo(() => {
    if (mode === 'dark') {
      return {
        background: '#0B0B0B' as const,
        surface: '#0F1724' as const,
        text: '#FFFFFF' as const,
        muted: '#9CA3AF' as const,
        primary: defaultColors.primary,
        accent: defaultColors.accent,
        cardGradientStart: defaultColors.cardGradientStart,
        cardGradientEnd: defaultColors.cardGradientEnd,
        shadow: defaultColors.shadow,
      };
    }
    return defaultColors;
  }, [mode]);

  const value = useMemo(() => ({ colors, spacing, fontSizes, mode, toggleMode }), [colors, mode, toggleMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

// Re-export constants from constants.ts for backward compatibility
export { Colors, Spacing, BorderRadius, FontSize, Shadow, FontWeight, Layout } from '../../constants';
