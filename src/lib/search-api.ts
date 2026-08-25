import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { FilterOptions, SearchMeta, SearchParams, SearchListing } from '@/types/search';

export const searchApi = {
  search: async (params: SearchParams = {}) => {
    const cleaned: Record<string, string | number | boolean> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === '') continue;
      cleaned[key] = value;
    }
    const { data } = await api.get<ApiSuccessResponse<SearchListing[]>>('/listings/search', {
      params: cleaned,
    });
    return data as ApiSuccessResponse<SearchListing[]> & { meta: SearchMeta };
  },
  suggestions: async (q: string) => {
    const { data } = await api.get<ApiSuccessResponse<string[]>>('/listings/suggestions', {
      params: { q },
    });
    return data.data;
  },
  filters: async (category?: string) => {
    const { data } = await api.get<ApiSuccessResponse<FilterOptions>>('/listings/filters', {
      params: category ? { category } : undefined,
    });
    return data.data;
  },
};
