import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { CAMERA_SETTINGS } from '@/constants';
import { formatBytes } from '@/utils';
import type { CapturedPhoto } from '@/types';

export interface ProcessPhotoOptions {
  uri: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  compress?: boolean;
  generateThumbnail?: boolean;
}

export interface ProcessedPhoto {
  original: CapturedPhoto;
  compressed?: CapturedPhoto;
  thumbnail?: CapturedPhoto;
  size: number;
  formattedSize: string;
}

export class CameraService {
  private static instance: CameraService;

  static getInstance(): CameraService {
    if (!CameraService.instance) {
      CameraService.instance = new CameraService();
    }
    return CameraService.instance;
  }

  /**
   * Process a captured photo with compression and thumbnail generation
   */
  async processPhoto(options: ProcessPhotoOptions): Promise<ProcessedPhoto> {
    const {
      uri,
      quality = CAMERA_SETTINGS.PHOTO_COMPRESSION,
      maxWidth = 1920,
      maxHeight = 1920,
      compress = true,
      generateThumbnail = true,
    } = options;

    try {
      // Get original photo info
      const originalInfo = await FileSystem.getInfoAsync(uri);
      const originalSize = originalInfo.exists && 'size' in originalInfo ? originalInfo.size : 0;

      // Get image dimensions
      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], { format: 'jpeg' });
      
      const original: CapturedPhoto = {
        uri,
        width: imageInfo.width,
        height: imageInfo.height,
      };

      let compressed: CapturedPhoto | undefined;
      let thumbnail: CapturedPhoto | undefined;

      // Compress if needed and requested
      if (compress && originalSize > CAMERA_SETTINGS.MAX_FILE_SIZE) {
        const compressionActions: ImageManipulator.Action[] = [];

        // Resize if too large
        if (imageInfo.width > maxWidth || imageInfo.height > maxHeight) {
          const ratio = Math.min(maxWidth / imageInfo.width, maxHeight / imageInfo.height);
          compressionActions.push({
            resize: {
              width: Math.round(imageInfo.width * ratio),
              height: Math.round(imageInfo.height * ratio),
            },
          });
        }

        if (compressionActions.length > 0 || quality < 1) {
          const compressedResult = await ImageManipulator.manipulateAsync(
            uri,
            compressionActions,
            {
              compress: quality,
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

          compressed = {
            uri: compressedResult.uri,
            width: compressedResult.width,
            height: compressedResult.height,
          };
        }
      }

      // Generate thumbnail
      if (generateThumbnail) {
        const thumbnailSize = CAMERA_SETTINGS.THUMBNAIL_SIZE;
        const thumbnailRatio = Math.min(
          thumbnailSize / imageInfo.width,
          thumbnailSize / imageInfo.height
        );

        const thumbnailResult = await ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: Math.round(imageInfo.width * thumbnailRatio),
                height: Math.round(imageInfo.height * thumbnailRatio),
              },
            },
          ],
          {
            compress: 0.8,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        );

        thumbnail = {
          uri: thumbnailResult.uri,
          width: thumbnailResult.width,
          height: thumbnailResult.height,
        };
      }

      return {
        original,
        compressed,
        thumbnail,
        size: originalSize,
        formattedSize: formatBytes(originalSize),
      };
    } catch (error) {
      console.error('Error processing photo:', error);
      throw new Error(`Failed to process photo: ${error}`);
    }
  }

  /**
   * Process multiple photos
   */
  async processPhotos(photos: ProcessPhotoOptions[]): Promise<ProcessedPhoto[]> {
    const processed = await Promise.allSettled(
      photos.map(photo => this.processPhoto(photo))
    );

    return processed
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Failed to process photo ${index}:`, result.reason);
          return null;
        }
      })
      .filter((photo): photo is ProcessedPhoto => photo !== null);
  }

  /**
   * Save photo to device gallery (requires media library permissions)
   */
  async saveToGallery(uri: string): Promise<string> {
    try {
      // This would use MediaLibrary.saveToLibraryAsync in a real implementation
      // For now, we'll just return the URI
      console.log('Saving photo to gallery:', uri);
      return uri;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      throw new Error('Failed to save photo to gallery');
    }
  }

  /**
   * Delete temporary photo files
   */
  async cleanupPhoto(uri: string): Promise<void> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (error) {
      console.error('Error cleaning up photo:', error);
      // Don't throw here - cleanup failures shouldn't break the app
    }
  }

  /**
   * Cleanup multiple photo files
   */
  async cleanupPhotos(uris: string[]): Promise<void> {
    await Promise.allSettled(uris.map(uri => this.cleanupPhoto(uri)));
  }

  /**
   * Get photo metadata
   */
  async getPhotoMetadata(uri: string) {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        throw new Error('Photo not found');
      }

      const imageInfo = await ImageManipulator.manipulateAsync(uri, [], { format: 'jpeg' });

      return {
        uri,
        width: imageInfo.width,
        height: imageInfo.height,
        size: 'size' in info ? info.size : 0,
        formattedSize: 'size' in info ? formatBytes(info.size) : '0 Bytes',
        aspectRatio: imageInfo.width / imageInfo.height,
        modificationTime: 'modificationTime' in info ? info.modificationTime : Date.now(),
      };
    } catch (error) {
      console.error('Error getting photo metadata:', error);
      throw new Error('Failed to get photo metadata');
    }
  }

  /**
   * Validate photo before processing
   */
  async validatePhoto(uri: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        return { valid: false, error: 'Photo file not found' };
      }

      if ('size' in info && info.size > CAMERA_SETTINGS.MAX_FILE_SIZE * 2) {
        return { valid: false, error: 'Photo file is too large' };
      }

      // Try to get image dimensions to validate it's a valid image
      await ImageManipulator.manipulateAsync(uri, [], { format: 'jpeg' });

      return { valid: true };
    } catch {
      return { valid: false, error: 'Invalid image file' };
    }
  }

  /**
   * Create a photo collage from multiple images
   */
  async createCollage(photos: CapturedPhoto[], maxWidth = 800): Promise<CapturedPhoto> {
    if (photos.length === 0) {
      throw new Error('No photos provided for collage');
    }

    if (photos.length === 1) {
      return photos[0];
    }

    try {
      // This is a simplified implementation
      // In a real app, you'd want more sophisticated collage layouts

      // For now, just return the first photo
      // A real implementation would compose multiple images
      return photos[0];
    } catch (error) {
      console.error('Error creating collage:', error);
      throw new Error('Failed to create photo collage');
    }
  }
}

// Export singleton instance
export const cameraService = CameraService.getInstance();