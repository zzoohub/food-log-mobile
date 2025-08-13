import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

// Import orbital sections
import CameraCenter from '@/domains/camera/components/OrbitalCamera';
import SocialFeed from '@/domains/social/components/SocialFeed';
import DiscoverSection from '@/domains/discover/components/DiscoverSection';
import ProgressDashboard from '@/domains/progress/components/ProgressDashboard';
import AICoach from '@/domains/ai-coach/components/AICoach';
import { FloatingNotifications } from '@/components/FloatingNotifications';

const { width, height } = Dimensions.get('window');

enum OrbitalSection {
  Camera = 'camera',
  Social = 'social',
  Discover = 'discover', 
  Progress = 'progress',
  AICoach = 'ai-coach',
}

export default function OrbitalNavigation() {
  const [activeSection, setActiveSection] = useState<OrbitalSection>(OrbitalSection.Camera);
  const [isOverview, setIsOverview] = useState(false);

  // Animation values
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Gesture handling for orbital navigation
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Don't allow gestures during camera capture or when in overview mode
      if (activeSection === OrbitalSection.Camera || isOverview) {
        return;
      }
      
      translateX.setValue(event.translationX);
      translateY.setValue(event.translationY);
    })
    .onEnd((event) => {
      const { translationX, translationY, velocityX, velocityY } = event;
      
      // Don't allow navigation during camera capture or overview mode
      if (activeSection === OrbitalSection.Camera || isOverview) {
        // Reset animation values
        Animated.parallel([
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
        return;
      }
      
      // Determine gesture direction and threshold
      const threshold = 80; // Increased threshold to prevent accidental navigation
      const velocityThreshold = 800; // Increased velocity threshold
      
      let nextSection = activeSection;
      
      // Swipe detection with velocity consideration
      if (Math.abs(translationX) > Math.abs(translationY)) {
        // Horizontal swipe
        if (translationX > threshold || velocityX > velocityThreshold) {
          // Swipe right
          nextSection = OrbitalSection.Social;
        } else if (translationX < -threshold || velocityX < -velocityThreshold) {
          // Swipe left  
          nextSection = OrbitalSection.AICoach;
        }
      } else {
        // Vertical swipe
        if (translationY > threshold || velocityY > velocityThreshold) {
          // Swipe down
          nextSection = OrbitalSection.Progress;
        } else if (translationY < -threshold || velocityY < -velocityThreshold) {
          // Swipe up
          nextSection = OrbitalSection.Discover;
        }
      }
      
      // Only navigate if we have a valid next section and it's different from current
      if (nextSection !== activeSection && Object.values(OrbitalSection).includes(nextSection)) {
        navigateToSection(nextSection);
      }
      
      // Reset animation values
      Animated.parallel([
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      ]).start();
    });

  // Pinch gesture for overview mode
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.setValue(event.scale);
    })
    .onEnd((event) => {
      if (event.scale < 0.8) {
        // Show overview
        setIsOverview(true);
        Animated.timing(scale, {
          toValue: 0.7,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        // Return to normal
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }
    });

  const navigateToSection = (section: OrbitalSection) => {
    if (section === activeSection || isOverview) return;
    
    // Validate section exists
    if (!Object.values(OrbitalSection).includes(section)) {
      console.warn('Invalid section navigation attempted:', section);
      return;
    }
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.warn('Haptics feedback failed:', error);
    }
    
    // Fade transition
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setActiveSection(section);
  };

  const exitOverview = () => {
    setIsOverview(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const renderActiveSection = () => {
    const commonProps = {
      onNavigate: (section: string) => navigateToSection(section as OrbitalSection),
      isActive: !isOverview,
    };

    switch (activeSection) {
      case OrbitalSection.Camera:
        return <CameraCenter {...commonProps} />;
      case OrbitalSection.Social:
        return <SocialFeed {...commonProps} />;
      case OrbitalSection.Discover:
        return <DiscoverSection {...commonProps} />;
      case OrbitalSection.Progress:
        return <ProgressDashboard {...commonProps} />;
      case OrbitalSection.AICoach:
        return <AICoach {...commonProps} />;
      default:
        return <CameraCenter {...commonProps} />;
    }
  };

  const renderOverview = () => {
    if (!isOverview) return null;

    return (
      <View style={styles.overviewContainer}>
        <TouchableOpacity 
          style={styles.overviewCard}
          onPress={() => {
            navigateToSection(OrbitalSection.Discover);
            exitOverview();
          }}
        >
          <View style={[styles.overviewSection, styles.discoverSection]}>
            <Text style={styles.overviewTitle}>Discover</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.overviewCard}
          onPress={() => {
            navigateToSection(OrbitalSection.AICoach);
            exitOverview();
          }}
        >
          <View style={[styles.overviewSection, styles.aiSection]}>
            <Text style={styles.overviewTitle}>AI Coach</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.overviewCard}
          onPress={() => {
            navigateToSection(OrbitalSection.Camera);
            exitOverview();
          }}
        >
          <View style={[styles.overviewSection, styles.cameraSection]}>
            <Text style={styles.overviewTitle}>Camera</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.overviewCard}
          onPress={() => {
            navigateToSection(OrbitalSection.Social);
            exitOverview();
          }}
        >
          <View style={[styles.overviewSection, styles.socialSection]}>
            <Text style={styles.overviewTitle}>Social</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.overviewCard}
          onPress={() => {
            navigateToSection(OrbitalSection.Progress);
            exitOverview();
          }}
        >
          <View style={[styles.overviewSection, styles.progressSection]}>
            <Text style={styles.overviewTitle}>Progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <GestureDetector gesture={Gesture.Race(panGesture, pinchGesture)}>
          <Animated.View 
            style={[
              styles.content,
              {
                transform: [
                  { translateX },
                  { translateY },
                  { scale },
                ],
                opacity,
              },
            ]}
          >
            {renderActiveSection()}
            {renderOverview()}
          </Animated.View>
        </GestureDetector>

        {/* Floating Notifications */}
        <FloatingNotifications />

        {/* Section Indicator */}
        <View style={styles.sectionIndicator}>
          <View style={[styles.indicator, activeSection === OrbitalSection.Discover && styles.indicatorActive]} />
          <View style={[styles.indicator, activeSection === OrbitalSection.AICoach && styles.indicatorActive]} />
          <View style={[styles.centerIndicator, activeSection === OrbitalSection.Camera && styles.indicatorActive]} />
          <View style={[styles.indicator, activeSection === OrbitalSection.Social && styles.indicatorActive]} />
          <View style={[styles.indicator, activeSection === OrbitalSection.Progress && styles.indicatorActive]} />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  overviewCard: {
    width: width * 0.4,
    height: height * 0.3,
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  overviewSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverSection: {
    backgroundColor: '#FF6B35',
  },
  aiSection: {
    backgroundColor: '#4ECDC4',
  },
  cameraSection: {
    backgroundColor: '#45B7D1',
  },
  socialSection: {
    backgroundColor: '#FFA07A',
  },
  progressSection: {
    backgroundColor: '#98D8C8',
  },
  overviewTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionIndicator: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 4,
  },
  centerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  indicatorActive: {
    backgroundColor: '#FF6B35',
  },
});