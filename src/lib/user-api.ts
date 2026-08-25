import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { AuthUser, DashboardStats, PublicProfile, UpdateProfileInput } from '@/types/user';

export const userApi = {
  getMe: async () => {
    const { data } = await api.get<ApiSuccessResponse<AuthUser>>('/users/me');
    return data;
  },
  getStats: async () => {
    const { data } = await api.get<ApiSuccessResponse<DashboardStats>>('/users/me/stats');
    return data;
  },
  updateProfile: async (payload: UpdateProfileInput) => {
    const { data } = await api.put<ApiSuccessResponse<AuthUser>>('/users/me/update', payload);
    return data;
  },
  updateAvatar: async (file: File) => {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.put<ApiSuccessResponse<{ avatar: string }>>(
      '/users/me/avatar',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  },
  changePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.put<ApiSuccessResponse<null>>('/users/me/change-password', payload);
    return data;
  },
  deleteAccount: async (password: string) => {
    const { data } = await api.delete<ApiSuccessResponse<null>>('/users/me/delete', {
      data: { password },
    });
    return data;
  },
  getPublicProfile: async (id: string) => {
    const { data } = await api.get<ApiSuccessResponse<PublicProfile>>(`/users/${id}`);
    return data;
  },
};
