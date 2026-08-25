import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { Listing, ListingListMeta, ListingStatus } from '@/types/listing';

export interface ListingListParams {
  page?: number;
  limit?: number;
  status?: ListingStatus;
  category?: string;
  subcategory?: string;
  seller?: string;
}

export const listingApi = {
  list: async (params: ListingListParams = {}) => {
    const { data } = await api.get<ApiSuccessResponse<Listing[]>>('/listings', { params });
    return data as ApiSuccessResponse<Listing[]> & { meta: ListingListMeta };
  },
  getMy: async (params: ListingListParams = {}) => {
    const { data } = await api.get<ApiSuccessResponse<Listing[]>>('/listings/my', { params });
    return data as ApiSuccessResponse<Listing[]> & { meta: ListingListMeta };
  },
  getBySlug: async (slug: string, options?: { track?: boolean }) => {
    const track = options?.track === false ? '0' : undefined;
    const { data } = await api.get<ApiSuccessResponse<Listing>>(`/listings/${slug}`, {
      params: track ? { track } : undefined,
    });
    return data;
  },
  recordView: async (slug: string) => {
    await api.post(`/listings/${slug}/view`);
  },
  getById: async (id: string) => {
    const { data } = await api.get<ApiSuccessResponse<Listing>>(`/listings/id/${id}`);
    return data;
  },
  create: async (formData: FormData) => {
    const { data } = await api.post<ApiSuccessResponse<Listing>>('/listings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  update: async (id: string, formData: FormData) => {
    const { data } = await api.put<ApiSuccessResponse<Listing>>(`/listings/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  markSold: async (id: string) => {
    const { data } = await api.put<ApiSuccessResponse<Listing>>(`/listings/${id}/sold`);
    return data;
  },
  remove: async (id: string) => {
    await api.delete(`/listings/${id}`);
  },
};
