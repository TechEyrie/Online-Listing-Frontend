import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  AdminListMeta,
  AdminListing,
  AdminReport,
  AdminTransaction,
  AdminUser,
  AdminUserDetail,
  DashboardStats,
  ReportReason,
  ReportTargetType,
} from '@/types/admin';

type ListResponse<T> = ApiSuccessResponse<T[]> & { meta: AdminListMeta };

export const adminApi = {
  getStats: async () => {
    const { data } = await api.get<ApiSuccessResponse<DashboardStats>>('/admin/stats');
    return data.data;
  },
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    banned?: boolean;
  } = {}) => {
    const { data } = await api.get<ListResponse<AdminUser>>('/admin/users', {
      params: {
        ...params,
        banned: params.banned === undefined ? undefined : String(params.banned),
      },
    });
    return data;
  },
  getUser: async (id: string) => {
    const { data } = await api.get<ApiSuccessResponse<AdminUserDetail>>(`/admin/users/${id}`);
    return data.data;
  },
  banUser: async (id: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AdminUser>>(`/admin/users/${id}/ban`);
    return data;
  },
  unbanUser: async (id: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AdminUser>>(`/admin/users/${id}/unban`);
    return data;
  },
  deleteUser: async (id: string) => {
    const { data } = await api.delete<ApiSuccessResponse<AdminUser>>(`/admin/users/${id}`);
    return data;
  },
  getListings: async (
    params: { page?: number; limit?: number; status?: string; search?: string } = {},
  ) => {
    const { data } = await api.get<ListResponse<AdminListing>>('/admin/listings', { params });
    return data;
  },
  updateListingStatus: async (id: string, status: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AdminListing>>(
      `/admin/listings/${id}/status`,
      { status },
    );
    return data;
  },
  featureListing: async (id: string, days = 7) => {
    const { data } = await api.patch<ApiSuccessResponse<AdminListing>>(
      `/admin/listings/${id}/feature`,
      { days },
    );
    return data;
  },
  deleteListing: async (id: string) => {
    const { data } = await api.delete<ApiSuccessResponse<AdminListing>>(`/admin/listings/${id}`);
    return data;
  },
  getReports: async (
    params: { page?: number; limit?: number; status?: string; targetType?: string } = {},
  ) => {
    const { data } = await api.get<ListResponse<AdminReport>>('/admin/reports', { params });
    return data;
  },
  resolveReport: async (id: string, action: 'resolve' | 'dismiss', resolution: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AdminReport>>(`/admin/reports/${id}`, {
      action,
      resolution,
    });
    return data;
  },
  getTransactions: async (params: { page?: number; limit?: number; status?: string } = {}) => {
    const { data } = await api.get<ListResponse<AdminTransaction>>('/admin/transactions', {
      params,
    });
    return data;
  },
};

export const reportApi = {
  create: async (payload: {
    targetType: ReportTargetType;
    targetId: string;
    reason: ReportReason;
    description?: string;
  }) => {
    const { data } = await api.post('/reports', payload);
    return data;
  },
};
