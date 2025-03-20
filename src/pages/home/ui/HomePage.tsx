import { GestureHandlerRootView, Text, View } from "@/shared/ui";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import { Dimensions, FlatList, Image, StyleSheet } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { NativeViewGestureHandler } from "react-native-gesture-handler";

export const HomePage = () => {
  const nativeGestureRef = useRef(null);
  const items = new Array(100).fill(0).map((n, i) => i + 1);
  const width = Dimensions.get("window").width;

  return (
    <GestureHandlerRootView>
      <NativeViewGestureHandler ref={nativeGestureRef}>
        <FlatList
          style={styles.list}
          data={items}
          nestedScrollEnabled
          renderItem={({ item, index }) => (
            <View key={index} style={styles.post_container}>
              <View style={styles.post_user}>
                <Image source={require("~/assets/images/favicon.png")} style={{ width: 25, height: 25 }} />
                <Text>username</Text>
              </View>

              <Carousel
                width={width}
                height={width / (1 / 1)}
                data={Array.from({ length: 10 })}
                panGestureHandlerProps={{
                  // FlatList의 gesture ref를 명확하게 전달합니다.
                  simultaneousHandlers: nativeGestureRef,
                  // 수직 이동이 일정 임계치를 넘으면 제스처를 실패시키도록 합니다.
                  failOffsetY: [-10, 10],
                  // (선택사항) 수평 이동에 대한 활성 임계값도 조정해볼 수 있습니다.
                  activeOffsetX: [-10, 10],
                }}
                renderItem={({ index }: { index: number }) => (
                  <View style={[styles.post_image_container, { width }]} key={index}>
                    <Image
                      source={require("~/assets/images/react-logo.png")}
                      style={{ width: "100%", height: "100%", backgroundColor: "red" }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              />
              <View style={styles.post_reactions}>
                <FontAwesome name="heart-o" size={18} color="black" />
                <Text style={{ fontSize: 14 }}>1 likes</Text>
              </View>
              <View style={styles.post_contents}>
                <Text style={{ fontSize: 14 }}>contents.........</Text>
              </View>
            </View>
          )}
        />
      </NativeViewGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingTop: 50,
  },
  post_container: {
    paddingBottom: 10,
    marginTop: 20,
    borderBottomWidth: 1, // 두께 설정
    borderBottomColor: "#f1f1f1", // 색상 설정
  },
  post_image_container: { aspectRatio: 1 / 1 },
  post_user: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  post_images: {},
  post_reactions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  post_contents: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
