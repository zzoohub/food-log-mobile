import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface MealData {
  name: string;
  confidence: number;
  nutrition: NutritionInfo;
  ingredients: string[];
}

export default function MealDetail() {
  const { photoUri, isNew } = useLocalSearchParams<{ photoUri: string; isNew: string }>();
  const router = useRouter();
  const [mealData, setMealData] = useState<MealData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (photoUri && isNew === 'true') {
      analyzeMeal();
    }
  }, [photoUri, isNew]);

  const analyzeMeal = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock AI analysis result
      const mockData: MealData = {
        name: 'Grilled Chicken Salad',
        confidence: 85,
        nutrition: {
          calories: 380,
          protein: 32,
          carbs: 18,
          fat: 22,
          fiber: 8,
        },
        ingredients: [
          'Grilled chicken breast',
          'Mixed greens',
          'Cherry tomatoes',
          'Cucumber',
          'Olive oil dressing',
          'Feta cheese',
        ],
      };

      setMealData(mockData);
    } catch (err) {
      setError('Failed to analyze meal. Please try again.');
      console.error('Meal analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    // TODO: Save meal data to storage/database
    console.log('Saving meal:', mealData);
    router.back();
  };

  const handleRetake = () => {
    router.back();
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#FF6B35" />
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={analyzeMeal}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Analysis</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Photo */}
        {photoUri && (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
          </View>
        )}

        {isAnalyzing ? (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color="#FF6B35" />
            <Text style={styles.analyzingText}>Analyzing your meal...</Text>
            <Text style={styles.analyzingSubtext}>
              Our AI is identifying ingredients and calculating nutrition
            </Text>
          </View>
        ) : mealData ? (
          <>
            {/* Meal Info */}
            <View style={styles.section}>
              <Text style={styles.mealName}>{mealData.name}</Text>
              <Text style={styles.confidence}>
                {mealData.confidence}% confidence
              </Text>
            </View>

            {/* Nutrition */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              <View style={styles.nutritionGrid}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{mealData.nutrition.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{mealData.nutrition.protein}g</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{mealData.nutrition.carbs}g</Text>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{mealData.nutrition.fat}g</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>

            {/* Ingredients */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Detected Ingredients</Text>
              {mealData.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4ECDC4" />
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                <Ionicons name="camera" size={20} color="#FF6B35" />
                <Text style={styles.retakeText}>Retake Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Meal</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  saveBtn: {
    padding: 8,
  },
  saveText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  photoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  analyzingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  analyzingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  analyzingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    margin: 20,
  },
  mealName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  confidence: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    color: '#FF6B35',
    fontSize: 20,
    fontWeight: 'bold',
  },
  nutritionLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 16,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  retakeText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  errorMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});