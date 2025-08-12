import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme, componentStyles, textStyles } from '@/styles/tokens';
import { triggerHaptic } from '@/utils';
import type { BaseComponentProps } from '@/types';

interface QuickActionButtonProps extends BaseComponentProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  haptic?: boolean;
}

export function QuickActionButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  haptic = true,
  testID,
  style,
}: QuickActionButtonProps) {
  const theme = darkTheme;

  const handlePress = () => {
    if (disabled) return;
    
    if (haptic) {
      triggerHaptic('LIGHT');
    }
    
    onPress();
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = size === 'small' 
      ? componentStyles.button.small 
      : componentStyles.button.primary;
    
    const styles: ViewStyle = {
      ...baseStyle,
      opacity: disabled ? 0.4 : 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    };
    
    switch (variant) {
      case 'primary':
        return {
          ...styles,
          backgroundColor: theme.colors.primary,
        };
      case 'secondary':
        return {
          ...styles,
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'ghost':
        return {
          ...styles,
          backgroundColor: 'transparent',
        };
      default:
        return styles;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return 'white';
      case 'secondary':
      case 'ghost':
        return theme.colors.text;
      default:
        return 'white';
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 20;
      case 'large': return 24;
      default: return 20;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      testID={testID}
    >
      <Ionicons 
        name={icon} 
        size={getIconSize()} 
        color={getTextColor()} 
        style={styles.icon} 
      />
      <Text style={[
        textStyles.button,
        { color: getTextColor() },
        size === 'small' && { fontSize: 14 },
        size === 'large' && { fontSize: 18 },
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 8,
  },
});