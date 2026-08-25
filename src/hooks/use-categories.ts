'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '@/lib/category-api';

const TREE_STALE_MS = 5 * 60 * 1000;

export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: async () => {
      const res = await categoryApi.getTree();
      return res.data;
    },
    staleTime: TREE_STALE_MS,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories', 'list'],
    queryFn: async () => {
      const res = await categoryApi.getAll();
      return res.data;
    },
    staleTime: TREE_STALE_MS,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['categories', 'slug', slug],
    queryFn: async () => {
      const res = await categoryApi.getBySlug(slug);
      return res.data;
    },
    enabled: Boolean(slug),
    staleTime: TREE_STALE_MS,
  });
}
