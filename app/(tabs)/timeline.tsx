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
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { QuickStats } from "@/components";
import { useTimelineI18n } from "@/lib/i18n";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - 60) / 3; // 3 photos per row with spacing

// Mock data for demonstration - labels will be dynamically translated
const createMockMeals = (timeline: ReturnType<typeof useTimelineI18n>) => [
  {
    id: "1",
    image: "https://via.placeholder.com/300x300/FF6B35/FFFFFF?text=Breakfast",
    time: "8:30 AM",
    type: "breakfast" as const,
    food: "Avocado Toast",
    calories: 420,
    date: "today" as const
  },
  {
    id: "2", 
    image: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Lunch",
    time: "12:45 PM",
    type: "lunch" as const, 
    food: "Quinoa Bowl",
    calories: 520,
    date: "today" as const
  },
  {
    id: "3",
    image: "https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=Dinner",
    time: "7:20 PM",
    type: "dinner" as const,
    food: "Grilled Salmon",
    calories: 680,
    date: "today" as const
  },
  {
    id: "4",
    image: "https://via.placeholder.com/300x300/F9CA24/FFFFFF?text=Snack",
    time: "3:15 PM",
    type: "snack" as const,
    food: "Mixed Nuts",
    calories: 180,
    date: "yesterday" as const
  },
];

const createWeeklyStats = (timeline: ReturnType<typeof useTimelineI18n>) => [
  {
    label: timeline.stat("meals"),
    value: 18,
    icon: "restaurant" as const,
    color: "#FF6B35",
    trend: "up" as const,
    trendValue: "+3"
  },
  {
    label: timeline.stat("avgCalories"),
    value: "1,203",
    icon: "flame" as const,
    color: "#4ECDC4",
    trend: "neutral" as const,
    trendValue: "±0"
  },
  {
    label: timeline.stat("goalProgress"),
    value: "85%",
    icon: "checkmark-circle" as const,
    color: "#45B7D1",
    trend: "up" as const,
    trendValue: "+12%"
  },
];

export default function TimelinePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const timeline = useTimelineI18n();

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';
  const cardBackgroundColor = isDark ? '#1C1C1E' : '#F8F9FA';
  
  // Create localized mock data
  const mockMeals = createMockMeals(timeline);
  const weeklyStats = createWeeklyStats(timeline);
  
  const groupedMeals = mockMeals.reduce((acc, meal) => {
    const dateKey = meal.date === 'today' ? timeline.today : timeline.yesterday;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(meal);
    return acc;
  }, {} as Record<string, typeof mockMeals>);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>{timeline.title}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push("/settings" as any)}
          >
            <Ionicons name="settings-outline" size={20} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cameraButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="camera" size={24} color="#FF6B35" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: textColor }]}>{timeline.thisWeek}</Text>
            <View style={styles.periodSelector}>
              {(['day', 'week', 'month'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.selectedPeriodButton
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodButtonText,
                    { color: selectedPeriod === period ? 'white' : secondaryTextColor }
                  ]}>
                    {timeline.period(period)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <QuickStats 
            stats={weeklyStats} 
            columns={3} 
            style={{ marginTop: 16 }}
          />
        </View>

        {/* View Toggle */}
        <View style={styles.viewControls}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{timeline.recentMeals}</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedView === 'grid' && styles.activeToggleButton
              ]}
              onPress={() => setSelectedView('grid')}
            >
              <Ionicons 
                name="grid" 
                size={18} 
                color={selectedView === 'grid' ? 'white' : secondaryTextColor} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                selectedView === 'list' && styles.activeToggleButton
              ]}
              onPress={() => setSelectedView('list')}
            >
              <Ionicons 
                name="list" 
                size={18} 
                color={selectedView === 'list' ? 'white' : secondaryTextColor} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Meals Timeline */}
        {Object.entries(groupedMeals).map(([date, meals]) => (
          <View key={date} style={styles.dateSection}>
            <Text style={[styles.dateHeader, { color: textColor }]}>{date}</Text>
            
            {selectedView === 'grid' ? (
              <View style={styles.photosGrid}>
                {meals.map((meal) => (
                  <TouchableOpacity key={meal.id} style={styles.photoItem}>
                    <Image source={{ uri: meal.image }} style={styles.mealPhoto} />
                    <Text style={[styles.mealTime, { color: secondaryTextColor }]}>
                      {meal.time}
                    </Text>
                    <Text style={[styles.mealType, { color: textColor }]} numberOfLines={1}>
                      {meal.food}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.mealsList}>
                {meals.map((meal) => (
                  <TouchableOpacity 
                    key={meal.id} 
                    style={[styles.mealListItem, { backgroundColor: cardBackgroundColor }]}
                  >
                    <Image source={{ uri: meal.image }} style={styles.listMealPhoto} />
                    <View style={styles.mealInfo}>
                      <View style={styles.mealHeader}>
                        <Text style={[styles.listMealFood, { color: textColor }]}>
                          {meal.food}
                        </Text>
                        <Text style={[styles.mealCalories, { color: '#FF6B35' }]}>
                          {timeline.formatCalories(meal.calories)}
                        </Text>
                      </View>
                      <View style={styles.mealMeta}>
                        <Text style={[styles.listMealTime, { color: secondaryTextColor }]}>
                          {meal.time}
                        </Text>
                        <Text style={[styles.listMealType, { color: secondaryTextColor }]}>
                          • {timeline.mealType(meal.type)}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={secondaryTextColor} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Quick Add Button */}
        <TouchableOpacity 
          style={styles.quickAddButton}
          onPress={() => router.push("/")}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.quickAddText}>{timeline.quickCapture}</Text>
        </TouchableOpacity>

        {/* Bottom spacing for tab bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsSection: {
    marginBottom: 24,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectedPeriodButton: {
    backgroundColor: "#FF6B35",
  },
  periodButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Removed old stats styles - now using QuickStats component
  viewControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeToggleButton: {
    backgroundColor: "#FF6B35",
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photoItem: {
    width: PHOTO_SIZE,
    marginBottom: 16,
  },
  mealPhoto: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    marginBottom: 8,
  },
  mealTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  mealType: {
    fontSize: 14,
    fontWeight: "500",
  },
  mealsList: {
    gap: 12,
  },
  mealListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  listMealPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  listMealFood: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: "600",
  },
  mealMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  listMealTime: {
    fontSize: 12,
  },
  listMealType: {
    fontSize: 12,
    marginLeft: 8,
  },
  quickAddButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  quickAddText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});