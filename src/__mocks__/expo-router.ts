/**
 * Mock for expo-router
 */

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
}));

export const useLocalSearchParams = jest.fn(() => ({}));

export const usePathname = jest.fn(() => '/');

export const useSegments = jest.fn(() => []);

export const Link = jest.fn(({ children }: { children: any; href: any }) => children);

export const Redirect = jest.fn(() => null);

export const Stack = jest.fn(() => null);

export const Tabs = jest.fn(() => null);

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};