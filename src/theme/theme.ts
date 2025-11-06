import React, { createContext, useContext, useState } from 'react';

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
