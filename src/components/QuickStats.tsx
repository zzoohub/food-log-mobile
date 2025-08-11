import { View, Text, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatItem {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

interface QuickStatsProps {
  stats: StatItem[];
  columns?: number;
  style?: ViewStyle;
  compact?: boolean;
}

export function QuickStats({ stats, columns = 3, style, compact = false }: QuickStatsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundColor = isDark ? "#1C1C1E" : "#F8F9FA";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryTextColor = isDark ? "#CCCCCC" : "#666666";

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "trending-up";
      case "down":
        return "trending-down";
      case "neutral":
        return "remove";
      default:
        return "remove";
    }
  };

  const getTrendColor = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "#4ECDC4";
      case "down":
        return "#E17055";
      case "neutral":
        return secondaryTextColor;
      default:
        return secondaryTextColor;
    }
  };

  const chunkArray = (array: StatItem[], size: number): StatItem[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const statChunks = chunkArray(stats, columns);

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {statChunks.map((chunk, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {chunk.map((stat, index) => (
            <View key={index} style={[styles.statItem, compact && styles.compactStatItem, { flex: 1 / columns }]}>
              {stat.icon && (
                <Ionicons
                  name={stat.icon}
                  size={compact ? 16 : 20}
                  color={stat.color || "#FF6B35"}
                  style={styles.icon}
                />
              )}

              <Text style={[compact ? styles.compactValue : styles.value, { color: stat.color || textColor }]}>
                {stat.value}
              </Text>

              <Text
                style={[compact ? styles.compactLabel : styles.label, { color: secondaryTextColor }]}
                numberOfLines={1}
              >
                {stat.label}
              </Text>

              {stat.trend && stat.trendValue && (
                <View style={styles.trendContainer}>
                  <Ionicons
                    name={getTrendIcon(stat.trend) as keyof typeof Ionicons.glyphMap}
                    size={12}
                    color={getTrendColor(stat.trend)}
                  />
                  <Text style={[styles.trendValue, { color: getTrendColor(stat.trend) }]}>{stat.trendValue}</Text>
                </View>
              )}
            </View>
          ))}

          {/* Fill empty spaces if row is not complete */}
          {chunk.length < columns &&
            Array(columns - chunk.length)
              .fill(0)
              .map((_, emptyIndex) => <View key={`empty-${emptyIndex}`} style={{ flex: 1 / columns }} />)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 8,
  },
  compactStatItem: {
    paddingHorizontal: 4,
  },
  icon: {
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  compactValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  compactLabel: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  trendValue: {
    fontSize: 10,
    fontWeight: "600",
  },
});
