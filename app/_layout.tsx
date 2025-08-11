import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { AppProvider } from "@/containers";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import "@/lib/i18n"; // Initialize i18n

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <AppProvider>
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: isDark ? '#000000' : '#FFFFFF' },
        animation: 'fade', // Smooth transitions between screens
      }}>
        <Stack.Screen 
          name="(tabs)" 
          options={{
            // Camera-first navigation handled by tabs layout
          }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </AppProvider>
  );
}
