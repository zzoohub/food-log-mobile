import { StyleSheet, SafeAreaView, View, Text } from "react-native";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
