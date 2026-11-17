'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';

import { CategoryBrowseGrid } from '@/components/categories/category-browse-grid';
import { CategorySlider } from '@/components/categories/category-slider';
import { MOSQUE_ARCH_CLIP_PATH } from '@/components/common/mosque-arch-clip';
import { HeroBanner } from '@/components/layout/hero-banner';
import { Container } from '@/components/layout/container';
import { HomeSectionHeader } from '@/components/layout/home-section-header';
import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { listingApi } from '@/lib/listing-api';
import { searchApi } from '@/lib/search-api';

function ListingSkeletonGrid() {
  return (
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
  );
}

export default function Home() {
  const recent = useQuery({
    queryKey: ['listings', 'recent'],
    queryFn: async () => {
      const res = await listingApi.list({ limit: 8 });
      return res.data;
    },
    staleTime: 45_000,
  });

  const featured = useQuery({
    queryKey: ['listings', 'featured-home'],
    queryFn: async () => {
      const res = await searchApi.search({ featured: true, sort: 'newest', limit: 4 });
      return res.data;
    },
    staleTime: 60_000,
  });

  return (
    <main className="min-h-screen">
      <HeroBanner />

      <Container className="space-y-12 py-8 sm:space-y-14 sm:py-10 md:space-y-16 md:py-12">
        <CategoryBrowseGrid />

        <section className="space-y-6 md:space-y-8">
          <HomeSectionHeader
            eyebrow="Categories"
            title="Browse by need"
            description="Start with what you need."
            actions={
              <Button asChild variant="accent" size="default" className="font-bold">
                <Link href="/search">
                  View all
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            }
          />
          <CategorySlider />
        </section>

        {featured.data && featured.data.length > 0 && (
          <section className="space-y-6 md:space-y-8">
            <HomeSectionHeader
              eyebrow="Spotlight"
              title="Featured listings"
              description="Highlighted by sellers for extra visibility."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.data.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6 md:space-y-8">
          <HomeSectionHeader
            eyebrow="Just in"
            title="Latest listings"
            description="Fresh posts from across the marketplace."
            actions={
              <Button asChild variant="ghost" size="sm">
                <Link href="/search">See more</Link>
              </Button>
            }
          />
          {recent.isLoading && <ListingSkeletonGrid />}
          {recent.isError && (
            <EmptyState
              title="Couldn’t load listings"
              description="Please try again in a moment."
              actionLabel="Retry"
              onAction={() => void recent.refetch()}
            />
          )}
          {!recent.isLoading && !recent.isError && recent.data?.length === 0 && (
            <EmptyState
              title="No listings yet"
              description="Be the first to post something people will love."
              actionLabel="Post a listing"
              actionHref="/post"
            />
          )}
          {recent.data && recent.data.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recent.data.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
