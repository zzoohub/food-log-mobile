import { StyleSheet, Dimensions, Image, ScrollView, FlatList, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface PostCardProps {
  username: string;
  likes: number;
  content: string;
  images: string[];
  nativeGestureRef: React.RefObject<FlatList<any> | null>;
}

export function PostCard({ username, likes, content, images, nativeGestureRef }: PostCardProps) {
  const width = Dimensions.get("window").width;

  return (
    <View style={styles.postContainer}>
      <View style={styles.postUser}>
        <Image source={require("@/assets/images/favicon.png")} style={{ width: 25, height: 25 }} />
        <Text>{username}</Text>
      </View>

      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ width, height: width }}>
        {(images.length > 0 ? images : ["placeholder"]).map((_, index) => (
          <View style={[styles.postImageContainer, { width }]} key={index}>
            <Image
              source={require("@/assets/images/react-logo.png")}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.postReactions}>
        <FontAwesome name="heart-o" size={18} color="black" />
        <Text style={{ fontSize: 14 }}>{likes} likes</Text>
      </View>

      <View style={styles.postContents}>
        <Text style={{ fontSize: 14 }}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer: {
    paddingBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  postImageContainer: {
    aspectRatio: 1 / 1,
  },
  postUser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postReactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postContents: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
