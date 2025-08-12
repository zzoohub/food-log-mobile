import React from 'react';
import {
  View,
  ViewStyle,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { lightTheme, darkTheme, componentStyles } from '@/styles/tokens';
import type { BaseComponentProps } from '@/types';

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'elevated';
  onPress?: () => void;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  variant = 'default',
  onPress,
  padding = 'medium',
  testID,
  style,
}: CardProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const getCardStyle = (): ViewStyle => {
    const baseStyle = variant === 'elevated' 
      ? componentStyles.card.elevated 
      : componentStyles.card.default;

    const paddingValue = {
      none: 0,
      small: 8,
      medium: 16,
      large: 24,
    }[padding];

    return {
      ...baseStyle,
      backgroundColor: theme.colors.surface,
      padding: paddingValue,
      borderColor: theme.colors.border,
      borderWidth: variant === 'default' ? 1 : 0,
    };
  };

  const cardStyle = getCardStyle();

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]} testID={testID}>
      {children}
    </View>
  );
}

// No styles required