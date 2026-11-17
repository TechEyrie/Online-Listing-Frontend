'use client';

import { useQuery } from '@tanstack/react-query';

import { CategoryBrowseGridItem } from '@/components/categories/category-browse-grid-item';
import { HomeSectionHeader } from '@/components/layout/home-section-header';
import { useCategoryTree } from '@/hooks/use-categories';
import { categoryApi } from '@/lib/category-api';

export function CategoryBrowseGrid() {
  const { data: tree, isLoading: treeLoading, isError: treeError } = useCategoryTree();
  const {
    data: counts,
    isPending: countsPending,
    isSuccess: countsSuccess,
  } = useQuery({
    queryKey: ['categories', 'counts'],
    queryFn: async () => {
      const res = await categoryApi.getListingCounts();
      if (!res.success || !res.data || typeof res.data !== 'object' || Array.isArray(res.data)) {
        throw new Error('Invalid category counts response');
      }
      return res.data;
    },
    staleTime: 60_000,
    retry: 1,
  });

  const gridClassName =
    'grid w-full grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2 md:grid-cols-3 md:gap-x-5 md:gap-y-2 xl:grid-cols-4';

  return (
    <section className="space-y-6 md:space-y-8">
      <HomeSectionHeader
        eyebrow="Marketplace"
        title="Browse items by category"
        description="Jump straight into what you need — vehicles, property, gadgets, and more."
      />

      {treeLoading ? (
        <div className={gridClassName}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-border/50 px-4 py-4"
            >
              <div className="h-[3.25rem] w-[3.25rem] shrink-0 animate-pulse rounded-2xl bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : treeError || !tree?.length ? null : (
        <div className={gridClassName}>
          {tree.map((category) => (
            <CategoryBrowseGridItem
              key={category._id}
              category={category}
              parentAdCount={countsSuccess ? (counts[category.slug] ?? 0) : undefined}
              counts={counts}
              countsPending={countsPending}
              countsReady={countsSuccess}
            />
          ))}
        </div>
      )}
    </section>
  );
}