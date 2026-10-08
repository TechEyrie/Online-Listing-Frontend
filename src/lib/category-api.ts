import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  Category,
  CategoryTreeNode,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/types/category';

export const categoryApi = {
  getAll: async () => {
    const { data } = await api.get<ApiSuccessResponse<Category[]>>('/categories');
    return data;
  },
  getTree: async () => {
    const { data } = await api.get<ApiSuccessResponse<CategoryTreeNode[]>>('/categories/tree');
    return data;
  },
  getListingCounts: async () => {
    const { data } = await api.get<ApiSuccessResponse<Record<string, number>>>('/categories/counts');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get<ApiSuccessResponse<Category>>(`/categories/${id}`);
    return data;
  },
  getBySlug: async (slug: string) => {
    const { data } = await api.get<ApiSuccessResponse<Category>>(`/categories/slug/${slug}`);
    return data;
  },
  create: async (payload: CreateCategoryInput) => {
    const { data } = await api.post<ApiSuccessResponse<Category>>('/categories', payload);
    return data;
  },
  update: async (id: string, payload: UpdateCategoryInput) => {
    const { data } = await api.put<ApiSuccessResponse<Category>>(`/categories/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/categories/${id}`);
  },
};
