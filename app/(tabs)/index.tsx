import { StyleSheet, SafeAreaView, View } from "react-native";
import { PostFeed } from "@/domains/post";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PostFeed />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
});
