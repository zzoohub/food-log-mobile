import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme, Platform } from "react-native";
import { useNavigationI18n } from "@/lib/i18n";  

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigationI18n();

  return (
    <Tabs 
      initialRouteName="index" // Ensure camera is the initial route
      screenOptions={{ 
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: isDark ? "#8E8E93" : "#999999",
        tabBarStyle: {
          backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          // Add subtle blur effect for better visual hierarchy
          ...(Platform.OS === 'ios' && {
            position: 'absolute',
            borderTopColor: 'transparent',
          }),
        },
        headerShown: false,
        // Optimize tab transitions for speed
        lazy: false, // Pre-load all tabs for instant switching
        tabBarHideOnKeyboard: true,
      }}
    >
      {/* Camera as primary tab - instant access */}
      <Tabs.Screen
        name="index"
        options={{
          title: navigation.camera,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "camera" : "camera-outline"} 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* Personal Timeline */}
      <Tabs.Screen
        name="timeline"
        options={{
          title: navigation.timeline,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* Social Feed */}
      <Tabs.Screen
        name="feeds"
        options={{
          title: navigation.discover,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={focused ? 28 : 24} 
              color={color} 
            />
          ),
        }}
      />
      
      {/* Hide the old create-post tab since camera is now primary */}
      <Tabs.Screen
        name="create-post"
        options={{
          href: null, // Hide this tab
        }}
      />
    </Tabs>
  );
}
