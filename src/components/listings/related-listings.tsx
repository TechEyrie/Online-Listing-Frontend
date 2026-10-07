'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { MOSQUE_ARCH_CLIP_PATH } from '@/components/common/mosque-arch-clip';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { searchApi } from '@/lib/search-api';
import type { Listing } from '@/types/listing';

interface RelatedListingsProps {
  listingId: string;
  categorySlug?: string;
  subcategorySlug?: string;
}

export function RelatedListings({
  listingId,
  categorySlug,
  subcategorySlug,
}: RelatedListingsProps) {
  const browseHref = subcategorySlug
    ? `/categories/${subcategorySlug}`
    : categorySlug
      ? `/categories/${categorySlug}`
      : '/search';

  const related = useQuery({
    queryKey: ['listings', 'related', listingId, categorySlug, subcategorySlug],
    queryFn: async () => {
      const pick = (items: Listing[]) =>
        items.filter((item) => item._id !== listingId).slice(0, 4);

      if (subcategorySlug) {
        const subRes = await searchApi.search({
          subcategory: subcategorySlug,
          sort: 'newest',
          limit: 8,
        });
        const fromSub = pick(subRes.data);
        if (fromSub.length >= 2) return fromSub;
      }

      if (categorySlug) {
        const catRes = await searchApi.search({
          category: categorySlug,
          sort: 'newest',
          limit: 8,
        });
        return pick(catRes.data);
      }

      return [];
    },
    enabled: Boolean(categorySlug || subcategorySlug),
    staleTime: 60_000,
  });

  if (!categorySlug && !subcategorySlug) return null;

  if (related.isLoading) {
    return (
      <section className="space-y-5">
        <RelatedHeader browseHref={browseHref} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="listing-card">
              <Skeleton
                className="listing-card__arch w-full rounded-none"
                style={{
                  clipPath: MOSQUE_ARCH_CLIP_PATH,
                  aspectRatio: '3 / 4.25',
                }}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const items = related.data ?? [];
  if (!items.length) return null;

  return (
    <section className="space-y-5">
      <RelatedHeader browseHref={browseHref} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((listing) => (
          <ListingCard key={listing._id} listing={listing} />
        ))}
      </div>
    </section>
  );
}

function RelatedHeader({ browseHref }: { browseHref: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="page-eyebrow">More to explore</p>
        <h2 className="text-section-title mt-1">You may also like</h2>
        <p className="mt-1 text-sm text-muted-foreground">Similar listings in this category.</p>
      </div>
      <Button asChild variant="ghost" size="sm" className="shrink-0">
        <Link href={browseHref}>View all</Link>
      </Button>
    </div>
  );
}
