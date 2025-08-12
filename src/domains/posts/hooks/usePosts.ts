import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS, MUTATION_KEYS } from '@/constants';
import type { Post, PaginatedResponse, PostFormData, ApiResponse } from '@/types';

// Mock API functions - replace with real API calls
const mockApi = {
  getPosts: async (page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    const mockPosts: Post[] = Array.from({ length: limit }, (_, index) => ({
      id: `post-${page}-${index}`,
      userId: `user-${Math.floor(Math.random() * 5) + 1}`,
      username: `user${Math.floor(Math.random() * 5) + 1}`,
      content: `This is a sample post content for post ${page}-${index}`,
      images: [`https://picsum.photos/400/300?random=${page}${index}`],
      likes: Math.floor(Math.random() * 100),
      isLiked: Math.random() > 0.5,
      mealType: ['breakfast', 'lunch', 'dinner', 'snack'][Math.floor(Math.random() * 4)] as any,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7), // Random within last week
      updatedAt: new Date(),
    }));

    return {
      data: mockPosts,
      page,
      limit,
      total: 100,
      hasNextPage: page < 10,
    };
  },

  createPost: async (postData: PostFormData): Promise<ApiResponse<Post>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: 'current-user-id',
      username: 'currentuser',
      content: postData.content,
      images: postData.images,
      likes: 0,
      isLiked: false,
      mealType: postData.mealType,
      location: postData.location,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      success: true,
      data: newPost,
    };
  },

  toggleLike: async (postId: string, isLiked: boolean): Promise<ApiResponse<{ likes: number; isLiked: boolean }>> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      data: {
        likes: Math.floor(Math.random() * 100) + (isLiked ? 1 : -1),
        isLiked,
      },
    };
  },
};

export interface UsePostsOptions {
  page?: number;
  limit?: number;
  userId?: string;
  enabled?: boolean;
}

export function usePosts({ page = 1, limit = 10, userId, enabled = true }: UsePostsOptions = {}) {
  const queryKey = userId 
    ? [QUERY_KEYS.TIMELINE, userId, page, limit]
    : [QUERY_KEYS.FEED, page, limit];

  return useQuery({
    queryKey,
    queryFn: () => mockApi.getPosts(page, limit),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useInfinitePosts({ limit = 10, userId }: Omit<UsePostsOptions, 'page'> = {}) {
  const queryKey = userId 
    ? [QUERY_KEYS.TIMELINE, userId, 'infinite']
    : [QUERY_KEYS.FEED, 'infinite'];

  return useQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => mockApi.getPosts(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  } as any); // Type assertion for infinite query
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_POST],
    mutationFn: mockApi.createPost,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate and refetch posts
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEED] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMELINE] });
        
        // Optionally add the new post to the cache
        queryClient.setQueryData(
          [QUERY_KEYS.POST_DETAIL, response.data.id],
          response.data
        );
      }
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.LIKE_POST],
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) =>
      mockApi.toggleLike(postId, isLiked),
    onMutate: async ({ postId, isLiked }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.FEED] });
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.TIMELINE] });

      // Snapshot the previous values
      const previousFeedData = queryClient.getQueryData([QUERY_KEYS.FEED]);
      const previousTimelineData = queryClient.getQueryData([QUERY_KEYS.TIMELINE]);

      // Optimistically update the cache
      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.FEED] },
        (oldData: any) => updatePostInCache(oldData, postId, isLiked)
      );

      queryClient.setQueriesData(
        { queryKey: [QUERY_KEYS.TIMELINE] },
        (oldData: any) => updatePostInCache(oldData, postId, isLiked)
      );

      return { previousFeedData, previousTimelineData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousFeedData) {
        queryClient.setQueryData([QUERY_KEYS.FEED], context.previousFeedData);
      }
      if (context?.previousTimelineData) {
        queryClient.setQueryData([QUERY_KEYS.TIMELINE], context.previousTimelineData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEED] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TIMELINE] });
    },
  });
}

// Helper function to update post in cache
function updatePostInCache(oldData: any, postId: string, isLiked: boolean) {
  if (!oldData?.data) return oldData;

  return {
    ...oldData,
    data: oldData.data.map((post: Post) =>
      post.id === postId
        ? {
            ...post,
            isLiked,
            likes: post.likes + (isLiked ? 1 : -1),
          }
        : post
    ),
  };
}

// Custom hook for post operations
export function usePostActions() {
  const createPost = useCreatePost();
  const toggleLike = useToggleLike();

  return {
    createPost: createPost.mutate,
    toggleLike: toggleLike.mutate,
    isCreatingPost: createPost.isPending,
    isTogglingLike: toggleLike.isPending,
    createPostError: createPost.error,
    toggleLikeError: toggleLike.error,
  };
}