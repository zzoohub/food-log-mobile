import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { CameraView as ExpoCameraView, FlashMode, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCameraI18n } from '@/lib/i18n';
import { triggerHaptic, showAlert } from '@/utils';
import { CAMERA_SETTINGS, ANIMATION_DURATION } from '@/constants';
import { createElevation } from '@/styles/tokens';
import type { CapturedPhoto, CameraSettings } from '@/types';

interface CameraViewProps {
  onPhotoCapture?: (photos: CapturedPhoto[]) => void;
  onClose?: () => void;
  mode?: 'fullscreen' | 'modal';
  maxPhotos?: number;
}

export function CameraView({ 
  onPhotoCapture, 
  onClose, 
  mode = 'fullscreen',
  maxPhotos = CAMERA_SETTINGS.MAX_PHOTOS_PER_POST 
}: CameraViewProps) {
  // Permissions and camera state
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
  
  // Camera settings
  const [settings, setSettings] = useState<CameraSettings>({
    type: 'back',
    flash: 'off',
    quality: CAMERA_SETTINGS.DEFAULT_QUALITY,
  });
  
  // UI state
  const [isCapturing, setIsCapturing] = useState(false);
  const [recentPhotos, setRecentPhotos] = useState<CapturedPhoto[]>([]);
  
  // Refs and hooks
  const cameraRef = useRef<ExpoCameraView>(null);
  const router = useRouter();
  const theme = { colors: { background: 'black', text: 'white', primary: '#FF6B35', textSecondary: 'rgba(255,255,255,0.7)' }, statusBar: 'light-content' };
  const camera = useCameraI18n();

  // Setup status bar for fullscreen mode
  useEffect(() => {
    if (mode === 'fullscreen') {
      StatusBar.setBarStyle('light-content', true);
      return () => {
        StatusBar.setBarStyle(theme.statusBar, true);
      };
    }
  }, [mode, theme.statusBar]);

  // Permission handling
  const handleCameraPermissionRequest = async () => {
    const result = await requestCameraPermission();
    if (!result.granted) {
      showAlert(
        camera.permissions.title,
        camera.permissions.message,
        [
          { text: camera.permissions.cancel, style: 'cancel' },
          { text: camera.permissions.openSettings, onPress: () => {} },
        ]
      );
    }
  };

  const handleMediaPermissionRequest = async (): Promise<boolean> => {
    if (!mediaPermission) return false;

    if (mediaPermission.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestMediaPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        showAlert(
          camera.permissions.mediaTitle,
          camera.permissions.mediaMessage,
          [
            { text: camera.permissions.cancel, style: 'cancel' },
            { text: camera.permissions.openSettings, onPress: () => {} },
          ]
        );
        return false;
      }
    }
    return true;
  };

  // Camera actions
  const capturePhoto = async () => {
    if (!cameraRef.current || isCapturing) return;

    try {
      setIsCapturing(true);
      triggerHaptic('LIGHT');

      const photo = await cameraRef.current.takePictureAsync({
        quality: settings.quality,
        base64: false,
        skipProcessing: false,
      });

      if (photo?.uri) {
        const capturedPhoto: CapturedPhoto = {
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          base64: photo.base64,
        };

        const newPhotos = [...recentPhotos, capturedPhoto];
        setRecentPhotos(newPhotos);

        // Trigger success haptic
        triggerHaptic('SUCCESS');

        // Handle photo capture based on mode
        if (mode === 'modal' && onPhotoCapture) {
          onPhotoCapture([capturedPhoto]);
        } else {
          // Auto-save and show success for fullscreen mode
          setTimeout(() => {
            showAlert(
              camera.capture.success,
              camera.capture.successMessage,
              [{ 
                text: camera.capture.viewTimeline, 
                onPress: () => router.push('/timeline' as any) 
              }]
            );
          }, ANIMATION_DURATION.MEDIUM);
        }
      }
    } catch (error) {
      console.error('Photo capture failed:', error);
      triggerHaptic('ERROR');
      showAlert(camera.capture.error, camera.capture.errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const openImagePicker = async () => {
    const hasPermission = await handleMediaPermissionRequest();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxPhotos,
        quality: settings.quality,
      });

      if (!result.canceled && result.assets) {
        const selectedPhotos: CapturedPhoto[] = result.assets.map(asset => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        }));

        if (onPhotoCapture) {
          onPhotoCapture(selectedPhotos);
        }
      }
    } catch (error) {
      console.error('Image picker failed:', error);
      showAlert(camera.capture.error, camera.capture.errorMessage);
    }
  };

  // Camera setting toggles
  const toggleCameraType = () => {
    setSettings(prev => ({
      ...prev,
      type: prev.type === 'back' ? 'front' : 'back',
    }));
    triggerHaptic('LIGHT');
  };

  const toggleFlash = () => {
    setSettings(prev => {
      let newFlash: FlashMode;
      switch (prev.flash) {
        case 'off': newFlash = 'on'; break;
        case 'on': newFlash = 'auto'; break;
        case 'auto': newFlash = 'off'; break;
        default: newFlash = 'off';
      }
      return { ...prev, flash: newFlash };
    });
    triggerHaptic('LIGHT');
  };

  const getFlashIcon = () => {
    switch (settings.flash) {
      case 'on': return 'flash';
      case 'auto': return 'flash-outline';
      case 'off':
      default: return 'flash-off';
    }
  };

  // Render permission states
  if (!cameraPermission) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {camera.preparing}
        </Text>
      </SafeAreaView>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView style={[styles.permissionContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.permissionContent}>
          <Ionicons name="camera-outline" size={80} color={theme.colors.primary} />
          <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
            {camera.welcome.title}
          </Text>
          <Text style={[styles.permissionMessage, { color: theme.colors.textSecondary }]}>
            {camera.welcome.message}
          </Text>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: theme.colors.primary }]} 
            onPress={handleCameraPermissionRequest}
          >
            <Text style={styles.permissionButtonText}>
              {camera.welcome.enableCamera}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main camera interface
  const isModal = mode === 'modal';

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={settings.type}
        flash={settings.flash}
        mode="picture"
      >
        {/* Top overlay */}
        <View style={[styles.topOverlay, isModal && styles.modalTopOverlay]}>
          {isModal && onClose && (
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
          )}

          {!isModal && (
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={() => router.push('/timeline' as any)}
            >
              <Ionicons name="grid-outline" size={24} color="white" />
            </TouchableOpacity>
          )}

          <View style={styles.centerTop}>
            <Text style={styles.quickHint}>
              {isModal ? camera.selectPhoto : camera.quickHint}
            </Text>
          </View>

          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Ionicons name={getFlashIcon()} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main capture area */}
        <TouchableOpacity
          style={styles.captureArea}
          onPress={capturePhoto}
          disabled={isCapturing}
          activeOpacity={0.8}
        >
          <View style={styles.captureIndicator}>
            <View style={[styles.captureRing, isCapturing && styles.capturingRing]}>
              <View style={[styles.captureButton, isCapturing && styles.capturingButton]} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Bottom overlay */}
        <View style={[styles.bottomOverlay, isModal && styles.modalBottomOverlay]}>
          <TouchableOpacity style={styles.bottomButton} onPress={openImagePicker}>
            <Ionicons name="images-outline" size={20} color="white" />
            <Text style={styles.bottomButtonText}>{camera.gallery}</Text>
          </TouchableOpacity>

          <View style={styles.bottomCenter}>
            {isCapturing ? (
              <Text style={styles.capturingText}>{camera.capturingText}</Text>
            ) : (
              <Text style={styles.hintText}>{camera.hintText}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.bottomButton} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse-outline" size={20} color="white" />
            <Text style={styles.bottomButtonText}>{camera.flip}</Text>
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    ...createElevation('md'),
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  topOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  modalTopOverlay: {
    paddingTop: 50,
  },
  centerTop: {
    flex: 1,
    alignItems: 'center',
  },
  quickHint: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  capturingRing: {
    borderColor: '#FF6B35',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
  },
  capturingButton: {
    backgroundColor: '#FF6B35',
  },
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  modalBottomOverlay: {
    paddingBottom: 30,
  },
  bottomButton: {
    alignItems: 'center',
    padding: 8,
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomCenter: {
    flex: 1,
    alignItems: 'center',
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  capturingText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});