import { useState } from "react";
import { 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  useColorScheme,
  Dimensions,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useDiscoverI18n } from "@/lib/i18n";

const { width } = Dimensions.get("window");

// Mock data for social feed
const mockSocialPosts = [
  {
    id: "1",
    user: {
      name: "Sarah Chen",
      avatar: "https://via.placeholder.com/40x40/4ECDC4/FFFFFF?text=SC",
      isFollowing: false,
    },
    image: "https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=Healthy Bowl",
    food: "Mediterranean Bowl",
    timeAgo: "2h ago",
    likes: 24,
    isLiked: false,
    calories: 480,
    tags: ["healthy", "mediterranean", "lunch"]
  },
  {
    id: "2",
    user: {
      name: "Mike Johnson",
      avatar: "https://via.placeholder.com/40x40/45B7D1/FFFFFF?text=MJ",
      isFollowing: true,
    },
    image: "https://via.placeholder.com/400x300/F9CA24/FFFFFF?text=Smoothie",
    food: "Green Power Smoothie",
    timeAgo: "4h ago",
    likes: 18,
    isLiked: true,
    calories: 240,
    tags: ["smoothie", "breakfast", "energy"]
  },
  {
    id: "3",
    user: {
      name: "Emma Wilson",
      avatar: "https://via.placeholder.com/40x40/E17055/FFFFFF?text=EW",
      isFollowing: false,
    },
    image: "https://via.placeholder.com/400x300/6C5CE7/FFFFFF?text=Pasta",
    food: "Homemade Carbonara",
    timeAgo: "6h ago",
    likes: 42,
    isLiked: false,
    calories: 650,
    tags: ["pasta", "dinner", "comfort"]
  },
];

const createInspirationCategories = (discover: ReturnType<typeof useDiscoverI18n>) => [
  { id: "healthy" as const, name: discover.category("healthy"), color: "#4ECDC4" },
  { id: "quick" as const, name: discover.category("quick"), color: "#FF6B35" },
  { id: "comfort" as const, name: discover.category("comfort"), color: "#F9CA24" },
  { id: "breakfast" as const, name: discover.category("breakfast"), color: "#45B7D1" },
  { id: "lunch" as const, name: discover.category("lunch"), color: "#A8E6CF" },
  { id: "dinner" as const, name: discover.category("dinner"), color: "#E17055" },
];

export default function FeedsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState(mockSocialPosts);
  const discover = useDiscoverI18n();

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';
  const cardBackgroundColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const borderColor = isDark ? '#333333' : '#E5E5E7';
  
  // Create localized categories
  const inspirationCategories = createInspirationCategories(discover);

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const toggleFollow = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, user: { ...post.user, isFollowing: !post.user.isFollowing } }
        : post
    ));
  };

  const renderPost = ({ item }: { item: typeof mockSocialPosts[0] }) => (
    <View style={[styles.postCard, { backgroundColor: cardBackgroundColor, borderColor }]}>
      {/* User Header */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: textColor }]}>{item.user.name}</Text>
            <Text style={[styles.timeAgo, { color: secondaryTextColor }]}>{item.timeAgo}</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.followButton,
            item.user.isFollowing ? styles.followingButton : styles.notFollowingButton
          ]}
          onPress={() => toggleFollow(item.id)}
        >
          <Text style={[
            styles.followButtonText,
            { color: item.user.isFollowing ? secondaryTextColor : '#FF6B35' }
          ]}>
            {item.user.isFollowing ? discover.following : discover.follow}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Food Image */}
      <TouchableOpacity style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.foodImage} />
        
        {/* Quick stats overlay */}
        <View style={styles.statsOverlay}>
          <View style={styles.statBadge}>
            <Text style={styles.caloriesText}>{discover.formatCalories(item.calories)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Post Content */}
      <View style={styles.postContent}>
        <View style={styles.postHeader}>
          <Text style={[styles.foodName, { color: textColor }]}>{item.food}</Text>
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons 
              name={item.isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={item.isLiked ? "#FF6B35" : secondaryTextColor} 
            />
            <Text style={[styles.likesCount, { color: secondaryTextColor }]}>
              {discover.formatLikes(item.likes)}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tags */}
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: isDark ? '#2C2C2E' : '#F0F0F0' }]}>
              <Text style={[styles.tagText, { color: secondaryTextColor }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: textColor }]}>{discover.title}</Text>
          <Text style={[styles.headerSubtitle, { color: secondaryTextColor }]}>
            {discover.subtitle}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.cameraButton}
          onPress={() => router.push("/" as any)}
        >
          <Ionicons name="camera" size={24} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            activeCategory === "all" && styles.activeCategoryButton
          ]}
          onPress={() => setActiveCategory("all")}
        >
          <Text style={[
            styles.categoryButtonText,
            { color: activeCategory === "all" ? 'white' : secondaryTextColor }
          ]}>
            {discover.category("all")}
          </Text>
        </TouchableOpacity>
        
        {inspirationCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && [styles.activeCategoryButton, { backgroundColor: category.color }]
            ]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              { color: activeCategory === category.id ? 'white' : secondaryTextColor }
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContainer}
        refreshing={false}
        onRefresh={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  activeCategoryButton: {
    backgroundColor: "#FF6B35",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  feedContainer: {
    padding: 16,
    gap: 20,
  },
  postCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  followingButton: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  notFollowingButton: {
    backgroundColor: "rgba(255, 107, 53, 0.1)",
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  imageContainer: {
    position: "relative",
  },
  foodImage: {
    width: '100%',
    height: 300,
  },
  statsOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  statBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  caloriesText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  postContent: {
    padding: 16,
    paddingTop: 12,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
  },
});
