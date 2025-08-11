import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  useColorScheme
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuickActionButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export function QuickActionButton({
  title,
  icon,
  onPress,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  disabled = false,
}: QuickActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = styles[size];
    
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? '#CCCCCC' : '#FF6B35',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0',
          borderWidth: 1,
          borderColor: isDark ? '#3C3C3E' : '#E0E0E0',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return '#999999';
    
    switch (variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return isDark ? '#FFFFFF' : '#000000';
      case 'ghost':
        return isDark ? '#FFFFFF' : '#000000';
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
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={getIconSize()} 
        color={getTextColor()} 
        style={styles.icon} 
      />
      <Text style={[
        { color: getTextColor() },
        styles.text,
        size === 'small' && styles.smallText,
        size === 'large' && styles.largeText,
        textStyle
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  small: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minHeight: 36,
  },
  medium: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minHeight: 48,
  },
  large: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    minHeight: 56,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
});