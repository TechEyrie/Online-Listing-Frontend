import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { AppNotification } from '@/types/notification';

export const notificationApi = {
  list: async (params: { page?: number; limit?: number } = {}) => {
    const { data } = await api.get<ApiSuccessResponse<AppNotification[]>>('/notifications', {
      params,
    });
    return data as ApiSuccessResponse<AppNotification[]> & {
      meta: { page: number; limit: number; total: number; totalPages: number; unreadCount: number };
    };
  },
  unreadCount: async () => {
    const { data } = await api.get<ApiSuccessResponse<{ count: number }>>(
      '/notifications/unread-count',
    );
    return data.data.count;
  },
  markRead: async (id: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AppNotification>>(
      `/notifications/${id}/read`,
    );
    return data.data;
  },
  markAllRead: async () => {
    const { data } = await api.patch<ApiSuccessResponse<{ updated: number }>>(
      '/notifications/read-all',
    );
    return data.data;
  },
};
