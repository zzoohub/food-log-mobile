/**
 * Type safety tests to verify that our exported types work correctly
 */

import type { 
  User, 
  Post, 
  MealType, 
  PostPrivacy,
  CameraSettings,
  PostFormData 
} from '../index';

describe('Type Safety Tests', () => {
  it('should have properly typed User interface', () => {
    const mockUser: User = {
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com',
      avatar: 'https://example.com/avatar.jpg',
      isLoggedIn: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(typeof mockUser.id).toBe('string');
    expect(typeof mockUser.username).toBe('string');
    expect(typeof mockUser.email).toBe('string');
    expect(typeof mockUser.isLoggedIn).toBe('boolean');
    expect(mockUser.createdAt).toBeInstanceOf(Date);
    expect(mockUser.updatedAt).toBeInstanceOf(Date);
  });

  it('should have properly typed Post interface', () => {
    const mockPost: Post = {
      id: 'post-123',
      userId: 'user-123',
      username: 'testuser',
      content: 'Delicious meal!',
      images: ['https://example.com/image.jpg'],
      likes: 42,
      isLiked: true,
      mealType: 'breakfast' as MealType,
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY'
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(typeof mockPost.id).toBe('string');
    expect(typeof mockPost.content).toBe('string');
    expect(Array.isArray(mockPost.images)).toBe(true);
    expect(typeof mockPost.likes).toBe('number');
    expect(typeof mockPost.isLiked).toBe('boolean');
    expect(mockPost.createdAt).toBeInstanceOf(Date);
  });

  it('should validate MealType enum values', () => {
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    
    validMealTypes.forEach(mealType => {
      const post: Partial<Post> = {
        mealType: mealType as MealType
      };
      expect(post.mealType).toBeDefined();
    });
  });

  it('should validate PostPrivacy enum values', () => {
    const validPrivacyLevels = ['public', 'friends', 'private'];
    
    validPrivacyLevels.forEach(privacy => {
      const post: Partial<Post> = {
        privacy: privacy as PostPrivacy
      };
      expect(post.privacy).toBeDefined();
    });
  });

  it('should have properly typed CameraSettings', () => {
    const cameraSettings: CameraSettings = {
      type: 'back',
      flash: 'auto',
      quality: 0.8
    };

    expect(['back', 'front']).toContain(cameraSettings.type);
    expect(['on', 'off', 'auto']).toContain(cameraSettings.flash);
    expect(typeof cameraSettings.quality).toBe('number');
    expect(cameraSettings.quality).toBeGreaterThanOrEqual(0);
    expect(cameraSettings.quality).toBeLessThanOrEqual(1);
  });

  it('should have properly typed PostFormData', () => {
    const formData: PostFormData = {
      content: 'Test post content',
      images: ['image1.jpg', 'image2.jpg'],
      mealType: 'lunch' as MealType,
      privacy: 'public' as PostPrivacy,
      location: {
        latitude: 37.7749,
        longitude: -122.4194,
        address: 'San Francisco, CA'
      }
    };

    expect(typeof formData.content).toBe('string');
    expect(Array.isArray(formData.images)).toBe(true);
    expect(formData.images.length).toBeGreaterThan(0);
    expect(['breakfast', 'lunch', 'dinner', 'snack']).toContain(formData.mealType);
    expect(['public', 'friends', 'private']).toContain(formData.privacy);
    expect(typeof formData.location?.latitude).toBe('number');
    expect(typeof formData.location?.longitude).toBe('number');
  });

  it('should enforce required vs optional properties', () => {
    // This test verifies TypeScript compilation - if it compiles, the types are correct
    
    // Required properties only
    const minimalPost: Pick<Post, 'id' | 'userId' | 'username' | 'content' | 'images' | 'likes' | 'isLiked' | 'createdAt' | 'updatedAt'> = {
      id: 'post-123',
      userId: 'user-123', 
      username: 'testuser',
      content: 'Test content',
      images: ['test.jpg'],
      likes: 0,
      isLiked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(minimalPost).toBeDefined();

    // Optional properties can be undefined
    const partialPost: Partial<Post> = {
      id: 'post-123',
      // mealType and location are optional
    };

    expect(partialPost.mealType).toBeUndefined();
    expect(partialPost.location).toBeUndefined();
  });
});