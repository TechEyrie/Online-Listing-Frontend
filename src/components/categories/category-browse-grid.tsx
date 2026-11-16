'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { getSuqoraCategoryVisual } from '@/components/icons/suqora-category-icon';
import { useCategoryTree } from '@/hooks/use-categories';
import { categoryApi } from '@/lib/category-api';
import { cn } from '@/lib/utils';

function formatAdCount(count: number): string {
  return `${count.toLocaleString()} ad${count === 1 ? '' : 's'}`;
}

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

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <header className="mb-10 max-w-2xl sm:mb-12">
        <p className="page-eyebrow">Marketplace</p>
        <h2 className="text-section-title mt-2">Browse items by category</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          Jump straight into what you need — vehicles, property, gadgets, and more.
        </p>
      </header>

      {treeLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {tree.map((category) => {
            const visual = getSuqoraCategoryVisual(category.slug);
            const Icon = visual.Icon;
            const adCount = countsSuccess ? (counts[category.slug] ?? 0) : undefined;

            return (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-3.5 py-3.5',
                  'outline-none transition-all duration-300',
                  'hover:-translate-y-0.5 hover:bg-card hover:shadow-[0_14px_32px_rgba(19,25,33,0.10)]',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                <span
                  className={cn(
                    'relative flex h-[3.35rem] w-[3.35rem] shrink-0 items-center justify-center rounded-2xl text-white',
                    'bg-[linear-gradient(145deg,#6B0F2A_0%,#A61E45_100%)]',
                    'shadow-[0_4px_14px_rgba(139,21,56,0.35)] ring-1 ring-white/20',
                    'transition-all duration-300 group-hover:scale-110 group-hover:rotate-[-4deg] group-hover:ring-accent/45',
                  )}
                  aria-hidden
                >
                  <Icon className="h-[1.4rem] w-[1.4rem]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold leading-snug text-foreground">
                    {category.name}
                  </span>
                  {countsPending ? (
                    <span className="mt-1.5 block h-3 w-14 animate-pulse rounded bg-muted" />
                  ) : adCount !== undefined ? (
                    <span className="mt-1 block text-[13px] font-medium tabular-nums leading-none text-muted-foreground">
                      {formatAdCount(adCount)}
                    </span>
                  ) : null}
                </span>
                <span
                  className="mr-0.5 text-xl font-light text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
