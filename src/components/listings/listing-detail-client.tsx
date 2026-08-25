'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { CalendarDays, Eye, MapPin, MessageSquare, Package, Tag } from 'lucide-react';

import { ContactSellerButton } from '@/components/messages/contact-seller-button';
import { Container } from '@/components/layout/container';
import { FactChip } from '@/components/listings/fact-chip';
import { ListingImageGallery } from '@/components/listings/listing-image-gallery';
import { ListingStatusBadge } from '@/components/listings/listing-status-badge';
import { PriceDisplay } from '@/components/listings/price-display';
import { RelatedListings } from '@/components/listings/related-listings';
import { SellerInfo } from '@/components/listings/seller-info';
import { ReportForm } from '@/components/reports/report-form';
import { ReviewForm } from '@/components/reviews/review-form';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { listingApi } from '@/lib/listing-api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { Listing, ListingCategoryRef, ListingSeller } from '@/types/listing';

interface ListingDetailClientProps {
  slug: string;
  initialListing?: Listing | null;
}

export function ListingDetailClient({ slug, initialListing = null }: ListingDetailClientProps) {
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listing', slug],
    queryFn: async () => {
      const res = await listingApi.getBySlug(slug, { track: false });
      return res.data;
    },
    initialData: initialListing ?? undefined,
    staleTime: 30_000,
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (!slug) return;
    void listingApi.recordView(slug).catch(() => undefined);
  }, [slug]);

  if (isLoading && !initialListing) {
    return (
      <Container className="grid gap-8 py-8 lg:grid-cols-[1.55fr_1fr]">
        <Skeleton className="aspect-[16/11] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container className="py-12">
        <EmptyState
          title="Listing not found"
          description="It may have been removed or the link is incorrect."
          actionLabel="Back home"
          actionHref="/"
        />
      </Container>
    );
  }

  const seller = typeof data.seller === 'object' ? (data.seller as ListingSeller) : null;
  const category =
    typeof data.category === 'object' ? (data.category as ListingCategoryRef) : null;
  const subcategory =
    typeof data.subcategory === 'object' ? (data.subcategory as ListingCategoryRef) : null;
  const isOwner = Boolean(user && seller && user._id === seller._id);
  const showContact = !isOwner && data.status === 'active';
  const location = [data.location?.city, data.location?.state, data.location?.country]
    .filter(Boolean)
    .join(', ');
  const posted = new Date(data.createdAt).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const attrs = Object.entries(data.attributes || {});

  return (
    <>
      <Container className="pb-28 pt-5 sm:pt-8 lg:pb-12">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm">
          <Link href="/search" className="font-medium text-muted-foreground hover:text-primary">
            Marketplace
          </Link>
          {category && (
            <>
              <span className="text-border" aria-hidden>
                /
              </span>
              <Link
                href={`/categories/${category.slug}`}
                className="font-medium text-muted-foreground hover:text-primary"
              >
                {category.name}
              </Link>
            </>
          )}
          {subcategory && (
            <>
              <span className="text-border" aria-hidden>
                /
              </span>
              <Link
                href={`/categories/${subcategory.slug}`}
                className="font-medium text-muted-foreground hover:text-primary"
              >
                {subcategory.name}
              </Link>
            </>
          )}
        </nav>

        {/* Gallery + copy on left; sticky buy box on right (no dead gap under photos) */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] lg:gap-x-10 lg:gap-y-0">
          <ListingImageGallery images={data.images} title={data.title} />

          <aside className="lg:sticky lg:top-24 lg:row-span-2 lg:self-start">
            <div
              className={cn(
                'overflow-hidden rounded-2xl border border-border/80 bg-card shadow-premium',
                data.isFeatured && 'ring-1 ring-accent/30',
              )}
            >
              {data.isFeatured && (
                <div className="bg-accent px-5 py-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-accent-foreground">
                  Featured listing
                </div>
              )}

              <div className="space-y-5 p-5 sm:p-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <ListingStatusBadge status={data.status} />
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {data.type}
                    </span>
                  </div>
                  <h1 className="font-display text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[1.65rem]">
                    {data.title}
                  </h1>
                </div>

                <div>
                  <p className="page-eyebrow mb-1">Price</p>
                  <PriceDisplay
                    price={data.price}
                    priceType={data.priceType}
                    currency={data.currency}
                    className="!text-3xl !font-bold text-primary sm:!text-4xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FactChip icon={MapPin} label="Location" value={location || '—'} />
                  <FactChip
                    icon={Package}
                    label="Condition"
                    value={data.condition || 'Not specified'}
                  />
                  <FactChip icon={Tag} label="Type" value={data.type} />
                  <FactChip icon={Eye} label="Views" value={String(data.viewCount ?? 0)} />
                </div>

                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Posted {posted}
                </p>

                {isOwner && (
                  <div className="rounded-2xl border border-primary/25 bg-primary-soft/80 p-4">
                    <p className="text-sm font-bold text-primary">You own this listing</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href={`/edit-listing/${data._id}`}>Edit</Link>
                      </Button>
                      <Button asChild size="sm" variant="accent">
                        <Link href={`/promote/${data._id}`}>Promote</Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link href="/my-listings">Manage</Link>
                      </Button>
                    </div>
                  </div>
                )}

                {showContact && seller && (
                  <div className="hidden lg:block">
                    <ContactSellerButton listingId={data._id} sellerId={seller._id} />
                  </div>
                )}

                {seller && <SellerInfo seller={seller} />}

                {!isOwner && (
                  <div className="border-t border-border/80 pt-4">
                    <ReportForm targetType="listing" targetId={data._id} />
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="space-y-8 pt-2 lg:pt-6">
            <section className="space-y-3">
              <h2 className="text-section-title">About this listing</h2>
              <div className="whitespace-pre-wrap rounded-2xl border border-border/80 bg-card p-5 text-[15px] leading-relaxed text-foreground/90 shadow-soft sm:p-6">
                {data.description}
              </div>
            </section>

            {attrs.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-section-title">Specifications</h2>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {attrs.map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-2xl border border-border/80 bg-card px-4 py-3.5 shadow-soft"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        {key}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section className="space-y-3">
              <h2 className="text-section-title">Reviews</h2>
              {seller && <ReviewForm revieweeId={seller._id} listingId={data._id} />}
            </section>
          </div>
        </div>

        <div className="mt-12 border-t border-border/70 pt-10 lg:mt-14 lg:pt-12">
          <RelatedListings
            listingId={data._id}
            categorySlug={category?.slug}
            subcategorySlug={subcategory?.slug}
          />
        </div>
      </Container>

      {showContact && seller && (
        <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/80 bg-card/95 p-3 shadow-premium backdrop-blur-md md:bottom-0 lg:hidden">
          <div className="mx-auto flex max-w-app items-center gap-3 px-1">
            <div className="min-w-0 flex-1">
              <PriceDisplay
                price={data.price}
                priceType={data.priceType}
                currency={data.currency}
                className="truncate !text-xl !font-bold text-primary"
              />
              <p className="truncate text-xs text-muted-foreground">{data.title}</p>
            </div>
            <ContactSellerButton
              listingId={data._id}
              sellerId={seller._id}
              size="default"
              className="w-auto shrink-0 [&_button]:w-auto"
            />
            <Button asChild variant="outline" size="icon" aria-label="Open messages">
              <Link href="/messages">
                <MessageSquare className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
