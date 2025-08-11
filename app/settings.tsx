import { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LanguageSelector, LanguageSelectorButton } from "@/components";
import { useI18n, getCurrentLanguage } from "@/lib/i18n";

export default function SettingsPage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { t } = useI18n();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#FF6B35" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {t('settings.title')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Settings Content */}
      <ScrollView style={styles.content}>
        {/* Language Setting */}
        <LanguageSelectorButton
          onPress={() => setShowLanguageSelector(true)}
          style={styles.settingItem}
        />

        {/* Current Language Display */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>
            Current Language: {getCurrentLanguage()}
          </Text>
        </View>

        {/* Example translated content */}
        <View style={styles.exampleSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Translation Examples:
          </Text>
          
          <View style={styles.exampleItem}>
            <Text style={[styles.exampleLabel, { color: secondaryTextColor }]}>
              Navigation:
            </Text>
            <Text style={[styles.exampleText, { color: textColor }]}>
              {t('navigation.camera')} • {t('navigation.timeline')} • {t('navigation.discover')}
            </Text>
          </View>

          <View style={styles.exampleItem}>
            <Text style={[styles.exampleLabel, { color: secondaryTextColor }]}>
              Meal Types:
            </Text>
            <Text style={[styles.exampleText, { color: textColor }]}>
              {t('timeline.mealTypes.breakfast')} • {t('timeline.mealTypes.lunch')} • {t('timeline.mealTypes.dinner')}
            </Text>
          </View>

          <View style={styles.exampleItem}>
            <Text style={[styles.exampleLabel, { color: secondaryTextColor }]}>
              Common UI:
            </Text>
            <Text style={[styles.exampleText, { color: textColor }]}>
              {t('common.save')} • {t('common.cancel')} • {t('common.ok')}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingItem: {
    marginBottom: 16,
  },
  infoSection: {
    padding: 16,
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 12,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  exampleSection: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  exampleItem: {
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
  },
});