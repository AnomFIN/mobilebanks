import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/theme';

const Card: React.FC<{ children?: React.ReactNode; style?: ViewStyle }> = ({ children, style }) => {
  const theme = useTheme();
  return (
    <LinearGradient colors={[theme.colors.cardGradientStart, theme.colors.cardGradientEnd]} start={[0,0]} end={[1,1]} style={[styles.container, style]}>
      <View style={styles.inner}>{children}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({ 
  container: { 
    padding: 16, 
    borderRadius: 20, 
    marginVertical: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.12, 
    shadowRadius: 14, 
    shadowOffset: { width: 0, height: 8 }, 
    elevation: 8 
  }, 
  inner: { 
    borderRadius: 16, 
    overflow: 'hidden' 
  } 
});

export default Card;
