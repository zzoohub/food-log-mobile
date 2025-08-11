import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions,
  useColorScheme,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface PhotoItem {
  id: string;
  uri: string;
  timestamp?: string;
  food?: string;
  calories?: number;
}

interface PhotoGridProps {
  photos: PhotoItem[];
  numColumns?: number;
  onPhotoPress?: (photo: PhotoItem) => void;
  onAddPhoto?: () => void;
  showAddButton?: boolean;
  spacing?: number;
}

export function PhotoGrid({
  photos,
  numColumns = 3,
  onPhotoPress,
  onAddPhoto,
  showAddButton = false,
  spacing = 8,
}: PhotoGridProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const totalSpacing = spacing * (numColumns + 1);
  const photoSize = (width - totalSpacing) / numColumns;
  
  const backgroundColor = isDark ? '#1C1C1E' : '#F8F9FA';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';

  const renderPhoto = ({ item, index }: { item: PhotoItem | 'add-button'; index: number }) => {
    if (item === 'add-button') {
      return (
        <TouchableOpacity
          style={[
            styles.photoItem,
            {
              width: photoSize,
              height: photoSize,
              backgroundColor,
              marginLeft: index % numColumns === 0 ? 0 : spacing,
            }
          ]}
          onPress={onAddPhoto}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={32} color="#FF6B35" />
          <Text style={[styles.addText, { color: '#FF6B35' }]}>Add Photo</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.photoItem,
          {
            width: photoSize,
            height: photoSize,
            marginLeft: index % numColumns === 0 ? 0 : spacing,
          }
        ]}
        onPress={() => onPhotoPress?.(item)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.photo, { width: photoSize, height: photoSize }]}
          resizeMode="cover"
        />
        
        {/* Photo overlay with info */}
        {(item.timestamp || item.food || item.calories) && (
          <View style={styles.photoOverlay}>
            {item.timestamp && (
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            )}
            {item.food && (
              <Text style={styles.foodName} numberOfLines={1}>{item.food}</Text>
            )}
            {item.calories && (
              <Text style={styles.calories}>{item.calories} cal</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const data = showAddButton ? ['add-button' as const, ...photos] : photos;

  return (
    <FlatList
      data={data}
      renderItem={renderPhoto}
      keyExtractor={(item, index) => 
        item === 'add-button' ? 'add-button' : item.id
      }
      numColumns={numColumns}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: spacing }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  photoItem: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photo: {
    borderRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  timestamp: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 2,
  },
  foodName: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  calories: {
    color: '#FF6B35',
    fontSize: 10,
    fontWeight: '500',
  },
  addText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});