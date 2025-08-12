# Food Log Mobile - Architecture Guide

## Overview

This document outlines the architectural patterns and organizational structure for the Food Log mobile application built with React Native and Expo.

## Refactoring Summary

The codebase has been comprehensively refactored to improve:
- **Maintainability**: Clear separation of concerns and modular architecture
- **Readability**: Consistent naming conventions and well-organized code structure
- **Performance**: Optimized imports, efficient state management, and proper caching
- **Type Safety**: Enhanced TypeScript usage with comprehensive type definitions
- **Developer Experience**: Better tooling support and easier navigation

### Key Improvements Made:
1. **Consolidated Camera Components**: Merged duplicate camera implementations into a single, reusable CameraView component
2. **Enhanced State Management**: Improved Zustand stores with proper error handling and persistence
3. **Design System**: Implemented consistent styling with design tokens and reusable UI components
4. **Better TypeScript**: Added comprehensive type definitions and improved type safety
5. **Optimized Architecture**: Clear domain separation with proper dependency management

## Design Principles

1. **Separation of Concerns** - Clear boundaries between UI, business logic, and data
2. **Component Reusability** - Modular, composable components with consistent APIs
3. **Type Safety** - Comprehensive TypeScript usage with shared type definitions
4. **Performance First** - Optimized imports, lazy loading, and efficient state management
5. **Maintainability** - Clear folder structure and naming conventions

## Folder Structure

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Basic UI primitives (Button, Input, etc.)
│   ├── layout/             # Layout components (Header, SafeArea, etc.)
│   ├── form/               # Form-related components
│   └── feedback/           # Loading, Error, Success components
├── screens/                # Screen-level components (pages)
├── domains/                # Business logic organized by domain
│   ├── camera/            # Camera and photo capture logic
│   ├── posts/             # Post management
│   ├── user/              # User management and authentication
│   └── social/            # Social features (feeds, following)
├── services/              # External integrations and APIs
│   ├── api/               # API client and endpoints
│   ├── storage/           # Local storage utilities
│   └── permissions/       # Device permissions handling
├── hooks/                 # Shared custom hooks
├── utils/                 # Utility functions and helpers
├── constants/             # App-wide constants
├── types/                 # Shared TypeScript type definitions
├── styles/                # Design system and styling
│   ├── tokens/            # Design tokens (colors, spacing, etc.)
│   ├── components/        # Component-specific styles
│   └── themes/            # Theme definitions
└── lib/                   # Third-party library configurations
    ├── i18n/              # Internationalization
    ├── navigation/        # Navigation setup
    └── state/             # Global state management
```

## Component Architecture

### UI Components (`src/components/ui/`)
- **Primitive components** with minimal business logic
- **Consistent API** with proper prop interfaces
- **Theming support** using design tokens
- **Accessibility** built-in by default

### Domain Components (`src/domains/*/components/`)
- **Domain-specific** UI components
- **Business logic integration** through custom hooks
- **Feature-complete** components for specific use cases

### Screen Components (`src/screens/`)
- **Page-level** components that compose other components
- **Route handling** and navigation logic
- **Data orchestration** between domains

## State Management Strategy

### Global State (Zustand)
- **User authentication** and profile data
- **App-wide settings** and preferences
- **Theme and localization** state

### Server State (React Query)
- **API data fetching** and caching
- **Background synchronization**
- **Optimistic updates** for user actions

### Local State (React useState/useReducer)
- **Component-specific** temporary state
- **Form inputs** and UI interactions
- **Animation states** and transitions

## Data Flow Patterns

1. **Screen** → **Domain Hook** → **Service** → **API**
2. **Component** → **Custom Hook** → **Store** (for global state)
3. **User Action** → **Handler** → **Mutation** → **Cache Update**

## Performance Optimizations

- **Bundle splitting** by domain
- **Lazy loading** for non-critical screens
- **Memoization** for expensive calculations
- **Image optimization** and caching
- **Tree shaking** with proper exports

## Error Handling

- **Error boundaries** at domain and screen levels
- **Graceful degradation** for network failures
- **User-friendly** error messages with actions
- **Logging** for debugging and monitoring

## Testing Strategy

- **Unit tests** for utilities and business logic
- **Component tests** for UI behavior
- **Integration tests** for user flows
- **End-to-end tests** for critical paths