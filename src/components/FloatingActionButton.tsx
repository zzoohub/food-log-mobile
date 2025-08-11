import { 
  TouchableOpacity, 
  StyleSheet, 
  ViewStyle,
  useColorScheme,
  Animated,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: 'small' | 'medium' | 'large';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  style?: ViewStyle;
  backgroundColor?: string;
  iconColor?: string;
  animate?: boolean;
}

export function FloatingActionButton({
  onPress,
  icon = 'camera',
  size = 'large',
  position = 'bottom-right',
  style,
  backgroundColor,
  iconColor,
  animate = true,
}: FloatingActionButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animate) {
      // Initial scale-in animation
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Subtle pulse animation
      const startPulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(startPulse, 3000); // Pulse every 3 seconds
        });
      };
      
      setTimeout(startPulse, 2000); // Start pulsing after 2 seconds
    } else {
      scaleAnim.setValue(1);
    }
  }, [animate]);

  const getButtonSize = (): number => {
    switch (size) {
      case 'small': return 48;
      case 'medium': return 56;
      case 'large': return 64;
      default: return 64;
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 24;
      case 'large': return 28;
      default: return 28;
    }
  };

  const getPositionStyle = (): ViewStyle => {
    const buttonSize = getButtonSize();
    const offset = 20;
    
    switch (position) {
      case 'bottom-right':
        return {
          position: 'absolute',
          bottom: offset + 80, // Account for tab bar
          right: offset,
        };
      case 'bottom-center':
        return {
          position: 'absolute',
          bottom: offset + 80,
          left: '50%',
          marginLeft: -buttonSize / 2,
        };
      case 'bottom-left':
        return {
          position: 'absolute',
          bottom: offset + 80,
          left: offset,
        };
      default:
        return {
          position: 'absolute',
          bottom: offset + 80,
          right: offset,
        };
    }
  };

  const buttonSize = getButtonSize();
  const defaultBackgroundColor = '#FF6B35';
  const defaultIconColor = 'white';

  return (
    <Animated.View
      style={[
        getPositionStyle(),
        {
          transform: [
            { scale: animate ? scaleAnim : 1 },
            { scale: animate ? pulseAnim : 1 },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor: backgroundColor || defaultBackgroundColor,
          },
          style,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name={icon}
            size={getIconSize()}
            color={iconColor || defaultIconColor}
          />
        </View>
      </TouchableOpacity>
      
      {/* Shadow/Backdrop */}
      <View
        style={[
          styles.shadow,
          {
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    top: 2,
    left: 0,
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    zIndex: 0,
  },
});