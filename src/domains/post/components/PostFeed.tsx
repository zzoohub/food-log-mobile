import { FlatList, StyleSheet, View } from "react-native";
import { useRef } from "react";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { PostCard } from "./PostCard";
import { Post, usePosts } from "@/domains/post";

export function PostFeed() {
  const flatListRef = useRef<FlatList>(null);
  const { posts, loading, refetch } = usePosts();

  // 새로운 제스처 API 사용
  const nativeGesture = Gesture.Native();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={nativeGesture}>
        <FlatList
          ref={flatListRef}
          style={styles.list}
          data={posts}
          nestedScrollEnabled
          keyExtractor={(item: Post) => item.id}
          refreshing={loading}
          onRefresh={refetch}
          renderItem={({ item }: { item: Post }) => (
            <PostCard
              username={item.username}
              likes={item.likes}
              content={item.content}
              images={item.images}
              nativeGestureRef={flatListRef}
            />
          )}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyContent} />
              </View>
            ) : null
          }
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyContent: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
});
