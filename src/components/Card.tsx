import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Shadow, Gradients } from '../theme/theme';
import { useTheme } from '../theme/themeContext';

interface CardProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  gradient?: boolean;
  shadow?: 'small' | 'medium' | 'large';
  padding?: number;
  nativeID?: string;
}

const Card = React.forwardRef<any, CardProps>(({ 
  children, 
  style, 
  gradient = false, 
  shadow = 'medium',
  padding = 16,
  nativeID,
}, ref) => {
  const theme = useTheme();
  
  const shadowStyle = shadow ? Shadow[shadow] : {};
  const containerStyle = [
    styles.container, 
    { padding },
    shadowStyle,
    style
  ];

  if (gradient) {
    return (
      // @ts-ignore
      <LinearGradient 
        ref={ref}
        nativeID={nativeID}
        colors={[theme.colors.cardGradientStart, theme.colors.cardGradientEnd]} 
        start={[0, 0]} 
        end={[1, 1]} 
        style={containerStyle}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View ref={ref} nativeID={nativeID} style={[containerStyle, { backgroundColor: '#FFFFFF' }]}> 
      {children}
    </View>
  );
});

const styles = StyleSheet.create({ 
  container: { 
    borderRadius: 20, 
    marginVertical: 8,
    overflow: 'hidden',
  }, 
});

export default Card;
