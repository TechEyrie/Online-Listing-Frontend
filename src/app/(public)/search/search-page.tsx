'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';

import { ActiveFilters, type ActiveFilterChip } from '@/components/search/active-filters';
import { FilterSidebar, type SearchFilterState } from '@/components/search/filter-sidebar';
import { ListingGrid } from '@/components/search/listing-grid';
import { NoResults } from '@/components/search/no-results';
import { Pagination } from '@/components/search/pagination';
import { SearchBar } from '@/components/search/search-bar';
import { SortDropdown } from '@/components/search/sort-dropdown';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryTree } from '@/hooks/use-categories';
import { searchApi } from '@/lib/search-api';
import type { SearchParams, SearchSort } from '@/types/search';

const RESERVED = new Set([
  'q',
  'category',
  'subcategory',
  'type',
  'condition',
  'priceMin',
  'priceMax',
  'city',
  'country',
  'sort',
  'page',
  'limit',
]);

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: tree = [] } = useCategoryTree();

  const params = useMemo(() => {
    const next: SearchParams = {
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      type: searchParams.get('type') || undefined,
      condition: searchParams.get('condition') || undefined,
      city: searchParams.get('city') || undefined,
      country: searchParams.get('country') || undefined,
      sort: (searchParams.get('sort') as SearchSort) || 'newest',
      page: Number(searchParams.get('page') || 1),
      limit: Number(searchParams.get('limit') || 12),
    };
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    if (priceMin) next.priceMin = Number(priceMin);
    if (priceMax) next.priceMax = Number(priceMax);

    searchParams.forEach((value, key) => {
      if (!RESERVED.has(key) && value) next[key] = value;
    });
    return next;
  }, [searchParams]);

  const filterState: SearchFilterState = {
    category: params.category || '',
    type: params.type || '',
    condition: params.condition || '',
    city: params.city || '',
    priceMin: params.priceMin !== undefined ? String(params.priceMin) : '',
    priceMax: params.priceMax !== undefined ? String(params.priceMax) : '',
    attributes: Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => !RESERVED.has(key) && typeof value === 'string' && value,
      ) as Array<[string, string]>,
    ),
  };

  const updateUrl = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        const shouldDelete =
          value === undefined ||
          value === null ||
          value === '' ||
          (key === 'sort' && value === 'newest') ||
          (key === 'page' && value === 1);
        if (shouldDelete) next.delete(key);
        else next.set(key, String(value));
      }
      const query = next.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname);
      });
    },
    [pathname, router, searchParams, startTransition],
  );

  const setFilters = (next: SearchFilterState) => {
    const patch: Record<string, string | number | undefined> = {
      category: next.category || undefined,
      type: next.type || undefined,
      condition: next.condition || undefined,
      city: next.city || undefined,
      priceMin: next.priceMin ? Number(next.priceMin) : undefined,
      priceMax: next.priceMax ? Number(next.priceMax) : undefined,
      page: 1,
    };

    searchParams.forEach((_value, key) => {
      if (!RESERVED.has(key)) patch[key] = undefined;
    });
    for (const [key, value] of Object.entries(next.attributes)) {
      patch[key] = value || undefined;
    }
    updateUrl(patch);
    setFiltersOpen(false);
  };

  const resultsQuery = useQuery({
    queryKey: ['search', params],
    queryFn: async () => searchApi.search(params),
  });

  const filtersQuery = useQuery({
    queryKey: ['search-filters', params.category],
    queryFn: async () => searchApi.filters(params.category),
  });

  const chips: ActiveFilterChip[] = [];
  if (params.q) chips.push({ key: 'q', label: `Search: ${params.q}` });
  if (params.category) chips.push({ key: 'category', label: `Category: ${params.category}` });
  if (params.city) chips.push({ key: 'city', label: `City: ${params.city}` });
  if (params.type) chips.push({ key: 'type', label: `Type: ${params.type}` });
  if (params.condition) chips.push({ key: 'condition', label: `Condition: ${params.condition}` });
  if (params.priceMin !== undefined) {
    chips.push({ key: 'priceMin', label: `Min: ${params.priceMin}` });
  }
  if (params.priceMax !== undefined) {
    chips.push({ key: 'priceMax', label: `Max: ${params.priceMax}` });
  }
  Object.entries(filterState.attributes).forEach(([key, value]) => {
    if (value) chips.push({ key, label: `${key}: ${value}` });
  });

  const meta = resultsQuery.data?.meta;
  const listings = resultsQuery.data?.data ?? [];

  const filterPanel = (
    <FilterSidebar
      tree={tree}
      options={filtersQuery.data}
      value={filterState}
      onChange={setFilters}
    />
  );

  return (
    <main className="mx-auto flex w-full max-w-app flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        eyebrow="Marketplace"
        title="Find what you need"
        description="Filter by category, price, location, and more."
      />

      <div className="max-w-2xl">
        <SearchBar initialQuery={params.q || ''} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="hidden lg:block">{filterPanel}</div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
            <p className="text-sm font-semibold tabular-nums text-foreground">
              {meta ? `${meta.total} result${meta.total === 1 ? '' : 's'}` : 'Searching…'}
            </p>
            <div className="flex items-center gap-2">
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button type="button" variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{filterPanel}</div>
                </SheetContent>
              </Sheet>
              <SortDropdown
                value={(params.sort as SearchSort) || 'newest'}
                onChange={(sort) => updateUrl({ sort, page: 1 })}
              />
            </div>
          </div>

          <ActiveFilters
            filters={chips}
            onRemove={(key) => updateUrl({ [key]: undefined, page: 1 })}
            onClear={() => router.push('/search')}
          />

          {resultsQuery.isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
              ))}
            </div>
          )}
          {resultsQuery.isError && (
            <p className="text-sm font-medium text-destructive">Could not load search results.</p>
          )}
          {!resultsQuery.isLoading && listings.length === 0 && <NoResults query={params.q} />}
          {listings.length > 0 && <ListingGrid listings={listings} />}

          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              hasNext={meta.hasNext}
              hasPrev={meta.hasPrev}
              onChange={(page) => updateUrl({ page })}
            />
          )}
        </section>
      </div>
    </main>
  );
}
