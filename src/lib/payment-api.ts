import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  CreateIntentResponse,
  PaymentTransaction,
  PricingPlan,
  PricingPlanId,
  RevenueStats,
} from '@/types/payment';

export interface TransactionListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const paymentApi = {
  getPlans: async () => {
    const { data } = await api.get<ApiSuccessResponse<PricingPlan[]>>('/payments/plans');
    return data.data;
  },
  createIntent: async (listingId: string, plan: PricingPlanId) => {
    const { data } = await api.post<ApiSuccessResponse<CreateIntentResponse>>(
      '/payments/create-intent',
      { listingId, plan },
    );
    return data.data;
  },
  confirmMock: async (paymentIntentId: string) => {
    const { data } = await api.post<ApiSuccessResponse<unknown>>('/payments/confirm-mock', {
      paymentIntentId,
    });
    return data;
  },
  confirm: async (paymentIntentId: string) => {
    const { data } = await api.post<ApiSuccessResponse<unknown>>('/payments/confirm', {
      paymentIntentId,
    });
    return data;
  },
  syncListing: async (listingId: string) => {
    const { data } = await api.post<
      ApiSuccessResponse<Array<{ paymentIntentId: string; applied: boolean; message: string }>>
    >(`/payments/sync-listing/${listingId}`);
    return data.data;
  },
  getTransactions: async (params: { page?: number; limit?: number } = {}) => {
    const { data } = await api.get<ApiSuccessResponse<PaymentTransaction[]>>(
      '/payments/transactions',
      { params },
    );
    return data as ApiSuccessResponse<PaymentTransaction[]> & { meta: TransactionListMeta };
  },
  getRevenueStats: async () => {
    const { data } = await api.get<ApiSuccessResponse<RevenueStats>>('/payments/admin/revenue');
    return data.data;
  },
};
