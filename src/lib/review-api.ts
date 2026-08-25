import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  AverageRating,
  CreateReviewInput,
  Review,
  ReviewEligibility,
  ReviewListMeta,
} from '@/types/review';

export const reviewApi = {
  create: async (payload: CreateReviewInput) => {
    const { data } = await api.post<ApiSuccessResponse<Review>>('/reviews', payload);
    return data;
  },
  getUserReviews: async (userId: string, params: { page?: number; limit?: number } = {}) => {
    const { data } = await api.get<ApiSuccessResponse<Review[]>>(`/users/${userId}/reviews`, {
      params,
    });
    return data as ApiSuccessResponse<Review[]> & { meta: ReviewListMeta };
  },
  getUserRating: async (userId: string) => {
    const { data } = await api.get<ApiSuccessResponse<AverageRating>>(`/users/${userId}/rating`);
    return data.data;
  },
  getEligibility: async (listingId: string) => {
    const { data } = await api.get<ApiSuccessResponse<ReviewEligibility>>(
      `/reviews/eligibility/${listingId}`,
    );
    return data.data;
  },
  delete: async (reviewId: string) => {
    const { data } = await api.delete<ApiSuccessResponse<null>>(`/reviews/${reviewId}`);
    return data;
  },
  listAdmin: async (params: { page?: number; limit?: number; isApproved?: boolean } = {}) => {
    const { data } = await api.get<ApiSuccessResponse<Review[]>>('/admin/reviews', { params });
    return data as ApiSuccessResponse<Review[]> & { meta: ReviewListMeta };
  },
  moderate: async (reviewId: string, isApproved: boolean) => {
    const { data } = await api.patch<ApiSuccessResponse<Review>>(`/admin/reviews/${reviewId}`, {
      isApproved,
    });
    return data;
  },
};
