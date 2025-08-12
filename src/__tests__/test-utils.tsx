/**
 * Test utilities for rendering components with providers
 */

import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from '../lib/i18n/config';

// Create a custom QueryClient for tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });

// All providers wrapper
interface AllProvidersProps {
  children: ReactNode;
  queryClient?: QueryClient;
}

const AllProviders: React.FC<AllProvidersProps> = ({ 
  children, 
  queryClient = createTestQueryClient() 
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </QueryClientProvider>
  );
};

// Custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

const customRender = (
  ui: ReactElement,
  { queryClient, ...options }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <AllProviders queryClient={queryClient}>{children}</AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock data generators
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  username: 'testuser',
  email: 'test@example.com',
  avatar: undefined,
  isLoggedIn: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockPost = (overrides = {}) => ({
  id: 'test-post-id',
  userId: 'test-user-id',
  username: 'testuser',
  content: 'Test post content',
  images: ['https://example.com/image.jpg'],
  likes: 5,
  isLiked: false,
  mealType: 'lunch' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
});

export const createMockCapturedPhoto = (overrides = {}) => ({
  uri: 'file://test-photo.jpg',
  width: 400,
  height: 300,
  ...overrides,
});

export const createMockNutritionInfo = (overrides = {}) => ({
  calories: 250,
  protein: 15,
  carbs: 30,
  fat: 8,
  fiber: 5,
  sugar: 10,
  sodium: 400,
  ...overrides,
});

export const createMockAIAnalysis = (overrides = {}) => ({
  detectedFoods: ['apple', 'banana'],
  confidence: 0.9,
  estimatedCalories: 150,
  mealCategory: 'snack' as const,
  ingredients: ['apple', 'banana'],
  cuisineType: 'fruit',
  ...overrides,
});

export const createMockUserPreferences = (overrides = {}) => ({
  language: 'en' as const,
  theme: 'system' as const,
  notifications: {
    posts: true,
    likes: true,
    follows: true,
  },
  privacy: {
    showLocation: false,
    allowAnalytics: true,
  },
  ...overrides,
});

// Test helpers for async operations
export const waitForNextUpdate = () => 
  new Promise(resolve => setTimeout(resolve, 0));

export const actAndWait = async (fn: () => void) => {
  await fn();
  await waitForNextUpdate();
};

// Mock store creators
export const createMockUserStore = (initialState = {}) => {
  const defaultState = {
    user: null,
    preferences: createMockUserPreferences(),
    isLoading: false,
    error: null,
    setUser: jest.fn(),
    updateUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    loadUserFromStorage: jest.fn(),
    setPreferences: jest.fn(),
    clearError: jest.fn(),
  };

  return {
    ...defaultState,
    ...initialState,
  };
};

// Export everything including the custom render
export * from '@testing-library/react-native';
export { 
  customRender as render, 
  createTestQueryClient,
  AllProviders 
};