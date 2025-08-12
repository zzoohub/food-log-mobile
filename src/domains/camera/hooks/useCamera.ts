import { useState, useCallback } from 'react';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { CAMERA_SETTINGS } from '@/constants';
import type { CameraSettings, CapturedPhoto } from '@/types';

interface UseCameraOptions {
  maxPhotos?: number;
  quality?: number;
  onPhotoCaptured?: (photos: CapturedPhoto[]) => void;
  onError?: (error: Error) => void;
}

export function useCamera({
  maxPhotos = CAMERA_SETTINGS.MAX_PHOTOS_PER_POST,
  quality = CAMERA_SETTINGS.DEFAULT_QUALITY,
  onPhotoCaptured,
  onError,
}: UseCameraOptions = {}) {
  // Permission hooks
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();

  // Camera state
  const [settings, setSettings] = useState<CameraSettings>({
    type: 'back',
    flash: 'off',
    quality,
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);

  // Permission handlers
  const requestCameraAccess = useCallback(async () => {
    if (cameraPermission?.granted) return true;

    const result = await requestCameraPermission();
    return result.granted;
  }, [cameraPermission?.granted, requestCameraPermission]);

  const requestMediaAccess = useCallback(async () => {
    if (!mediaPermission) return false;

    if (mediaPermission.status === ImagePicker.PermissionStatus.GRANTED) {
      return true;
    }

    const { status } = await requestMediaPermission();
    return status === ImagePicker.PermissionStatus.GRANTED;
  }, [mediaPermission, requestMediaPermission]);

  // Camera controls
  const toggleCameraType = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      type: prev.type === 'back' ? 'front' : 'back',
    }));
  }, []);

  const toggleFlash = useCallback(() => {
    setSettings(prev => {
      const flashModes = ['off', 'on', 'auto'] as const;
      const currentIndex = flashModes.indexOf(prev.flash);
      const nextIndex = (currentIndex + 1) % flashModes.length;
      return {
        ...prev,
        flash: flashModes[nextIndex],
      };
    });
  }, []);

  const updateQuality = useCallback((newQuality: number) => {
    setSettings(prev => ({
      ...prev,
      quality: Math.max(0.1, Math.min(1.0, newQuality)),
    }));
  }, []);

  // Photo handling
  const addPhoto = useCallback((photo: CapturedPhoto) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, photo];
      if (newPhotos.length > maxPhotos) {
        newPhotos.splice(0, newPhotos.length - maxPhotos);
      }
      onPhotoCaptured?.(newPhotos);
      return newPhotos;
    });
  }, [maxPhotos, onPhotoCaptured]);

  const addPhotos = useCallback((photos: CapturedPhoto[]) => {
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, ...photos];
      if (newPhotos.length > maxPhotos) {
        newPhotos.splice(0, newPhotos.length - maxPhotos);
      }
      onPhotoCaptured?.(newPhotos);
      return newPhotos;
    });
  }, [maxPhotos, onPhotoCaptured]);

  const removePhoto = useCallback((index: number) => {
    setCapturedPhotos(prev => {
      const newPhotos = prev.filter((_, i) => i !== index);
      onPhotoCaptured?.(newPhotos);
      return newPhotos;
    });
  }, [onPhotoCaptured]);

  const clearPhotos = useCallback(() => {
    setCapturedPhotos([]);
    onPhotoCaptured?.([]);
  }, [onPhotoCaptured]);

  // Error handling
  const handleError = useCallback((error: Error) => {
    console.error('Camera error:', error);
    onError?.(error);
  }, [onError]);

  // Open image picker
  const openImagePicker = useCallback(async () => {
    try {
      const hasPermission = await requestMediaAccess();
      if (!hasPermission) {
        throw new Error('Media library permission denied');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: maxPhotos - capturedPhotos.length,
        quality: settings.quality,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const selectedPhotos: CapturedPhoto[] = result.assets.map(asset => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        }));
        addPhotos(selectedPhotos);
        return selectedPhotos;
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Image picker failed');
      handleError(err);
    }
    return [];
  }, [requestMediaAccess, maxPhotos, capturedPhotos.length, settings.quality, addPhotos, handleError]);

  // Derived state
  const canCaptureMore = capturedPhotos.length < maxPhotos;
  const hasPhotos = capturedPhotos.length > 0;
  const isReady = cameraPermission?.granted === true;

  return {
    // Permissions
    cameraPermission,
    mediaPermission,
    requestCameraAccess,
    requestMediaAccess,
    isReady,

    // Settings
    settings,
    toggleCameraType,
    toggleFlash,
    updateQuality,

    // Photo state
    capturedPhotos,
    isCapturing,
    setIsCapturing,
    canCaptureMore,
    hasPhotos,

    // Actions
    addPhoto,
    addPhotos,
    removePhoto,
    clearPhotos,
    openImagePicker,
    handleError,
  };
}