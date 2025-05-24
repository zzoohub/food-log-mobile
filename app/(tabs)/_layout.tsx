import { FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: (typeof FontAwesome)["name"]; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#0066FF" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: "Post",
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="plus-square-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }: { color: string }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
