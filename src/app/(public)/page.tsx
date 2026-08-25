'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Sparkles, Store } from 'lucide-react';

import { CategoryNav } from '@/components/categories/category-nav';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Container } from '@/components/layout/container';
import { ListingCard } from '@/components/listings/listing-card';
import { SearchBar } from '@/components/search/search-bar';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { listingApi } from '@/lib/listing-api';
import { searchApi } from '@/lib/search-api';

function ListingSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="listing-card">
          <Skeleton className="aspect-[5/4] w-full rounded-none" />
          <div className="space-y-2 p-3.5">
            <Skeleton className="h-4 w-4/5 max-w-[85%]" />
            <Skeleton className="h-3 w-32" />
          </div>
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
    <main>
      <section className="relative overflow-hidden border-b border-border surface-hero">
        <Container className="relative py-14 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <div className="flex justify-center">
              <BrandLogo href={null} size="xl" priority />
            </div>
            <h1 className="mt-5 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-[2.5rem]">
              Buy, sell, and rent with confidence
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground">
              Qatar-first marketplace for vehicles, property, electronics, and services.
            </p>
            <div className="mx-auto mt-8 max-w-2xl text-left">
              <SearchBar />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/search">Browse listings</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/post">Post a listing</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container className="space-y-16 py-14 sm:py-16">
        <section className="grid gap-5 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Trusted moderation',
              body: 'Listings and reports are reviewed so buyers and sellers can trade with clarity.',
            },
            {
              icon: Sparkles,
              title: 'Optional promotions',
              body: 'Bump or feature your ad when you need reach — never required to sell.',
            },
            {
              icon: Store,
              title: 'Built for local trade',
              body: 'Search by category, price, and location to find what matters nearby.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-soft transition duration-normal hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-elevated"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-base font-bold">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-eyebrow">Categories</p>
              <h2 className="text-section-title mt-1">Browse by need</h2>
              <p className="mt-1 text-sm text-muted-foreground">Start with what you need.</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/search">View all</Link>
            </Button>
          </div>
          <CategoryNav />
        </section>

        {featured.data && featured.data.length > 0 && (
          <section className="space-y-6">
            <div>
              <p className="page-eyebrow">Spotlight</p>
              <h2 className="text-section-title mt-1">Featured listings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Highlighted by sellers for extra visibility.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.data.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="page-eyebrow">Just in</p>
              <h2 className="text-section-title mt-1">Latest listings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Fresh posts from across the marketplace.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/search">See more</Link>
            </Button>
          </div>
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
