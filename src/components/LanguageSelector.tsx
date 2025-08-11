import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  useI18n, 
  changeLanguage, 
  SUPPORTED_LANGUAGES, 
  type SupportedLanguage 
} from '@/lib/i18n';

interface LanguageSelectorProps {
  visible?: boolean;
  onClose?: () => void;
  style?: any;
}

export function LanguageSelector({ visible = false, onClose, style }: LanguageSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language: currentLanguage, t } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';
  const cardBackgroundColor = isDark ? '#1C1C1E' : '#F8F9FA';
  const borderColor = isDark ? '#333333' : '#E5E5E7';

  const handleLanguageChange = async (languageCode: SupportedLanguage) => {
    if (languageCode === currentLanguage) {
      onClose?.();
      return;
    }

    try {
      setIsChanging(true);
      await changeLanguage(languageCode);
      
      // Small delay to show feedback before closing
      setTimeout(() => {
        setIsChanging(false);
        onClose?.();
      }, 300);
    } catch (error) {
      console.error('Failed to change language:', error);
      setIsChanging(false);
    }
  };

  const renderLanguageItem = ({ item }: { item: typeof SUPPORTED_LANGUAGES[number] }) => {
    const isSelected = item.code === currentLanguage;
    const isDisabled = isChanging;

    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          {
            backgroundColor: cardBackgroundColor,
            borderColor,
            opacity: isDisabled ? 0.6 : 1,
          },
          isSelected && styles.selectedLanguageItem,
        ]}
        onPress={() => handleLanguageChange(item.code)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, { color: textColor }]}>
            {item.nativeName}
          </Text>
          <Text style={[styles.languageCode, { color: secondaryTextColor }]}>
            {item.name}
          </Text>
        </View>
        
        {isSelected && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color="#FF6B35" 
          />
        )}
        
        {isChanging && isSelected && (
          <Ionicons 
            name="reload" 
            size={20} 
            color="#FF6B35" 
            style={styles.loadingIcon} 
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: textColor }]}>
              {t('settings.language.title')}
            </Text>
            <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
              {t('settings.language.description')}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: cardBackgroundColor }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={20} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>

        {/* Language List */}
        <FlatList
          data={SUPPORTED_LANGUAGES}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          contentContainerStyle={styles.languageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Info Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: secondaryTextColor }]}>
            Language changes take effect immediately and are saved to your device.
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

// Inline Language Selector Button (for settings screens)
interface LanguageSelectorButtonProps {
  onPress?: () => void;
  style?: any;
}

export function LanguageSelectorButton({ onPress, style }: LanguageSelectorButtonProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { language: currentLanguage, t } = useI18n();

  const textColor = isDark ? '#FFFFFF' : '#000000';
  const secondaryTextColor = isDark ? '#CCCCCC' : '#666666';
  const cardBackgroundColor = isDark ? '#1C1C1E' : '#F8F9FA';

  const currentLangData = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);

  return (
    <TouchableOpacity
      style={[styles.inlineButton, { backgroundColor: cardBackgroundColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.inlineButtonContent}>
        <View style={styles.inlineButtonLeft}>
          <Ionicons name="language" size={20} color="#FF6B35" />
          <View style={styles.inlineButtonText}>
            <Text style={[styles.inlineButtonTitle, { color: textColor }]}>
              {t('common.language')}
            </Text>
            <Text style={[styles.inlineButtonSubtitle, { color: secondaryTextColor }]}>
              {currentLangData?.nativeName || 'English'}
            </Text>
          </View>
        </View>
        
        <Ionicons name="chevron-forward" size={16} color={secondaryTextColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  languageList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  selectedLanguageItem: {
    borderColor: '#FF6B35',
    borderWidth: 2,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  languageCode: {
    fontSize: 14,
  },
  loadingIcon: {
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Inline button styles
  inlineButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  inlineButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  inlineButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inlineButtonText: {
    marginLeft: 12,
    flex: 1,
  },
  inlineButtonTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  inlineButtonSubtitle: {
    fontSize: 14,
  },
});