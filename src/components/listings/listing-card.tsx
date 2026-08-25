'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Images, MapPin } from 'lucide-react';

import { ListingStatusBadge } from '@/components/listings/listing-status-badge';
import { PriceDisplay } from '@/components/listings/price-display';
import { PromotionBadge } from '@/components/payments/promotion-badge';
import { cloudinaryImageUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import type { Listing, ListingCategoryRef } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  showStatus?: boolean;
  className?: string;
}

export function ListingCard({ listing, showStatus = false, className }: ListingCardProps) {
  const image = listing.images?.[0]?.url;
  const imageCount = listing.images?.length ?? 0;
  const category =
    typeof listing.category === 'object' ? (listing.category as ListingCategoryRef) : null;
  const location = [listing.location?.city, listing.location?.state].filter(Boolean).join(', ');

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={cn(
        'listing-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        listing.isFeatured && 'listing-card--featured',
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={cloudinaryImageUrl(image, { width: 800 })}
            alt={listing.title}
            fill
            className="object-cover transition duration-slow group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        <PromotionBadge
          isFeatured={listing.isFeatured}
          featuredUntil={listing.featuredUntil}
          className="absolute left-3 top-3 z-10"
        />

        {showStatus && (
          <div className="absolute right-3 top-3 z-10">
            <ListingStatusBadge status={listing.status} />
          </div>
        )}

        {imageCount > 1 && (
          <span
            className={cn(
              'absolute z-10 inline-flex items-center gap-1 rounded-lg bg-card/95 px-2 py-1 text-[11px] font-semibold text-foreground shadow-soft backdrop-blur-sm',
              showStatus ? 'bottom-[3.25rem] right-3' : 'right-3 top-3',
            )}
          >
            <Images className="h-3 w-3" aria-hidden />
            {imageCount}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5">
          <PriceDisplay
            price={listing.price}
            priceType={listing.priceType}
            currency={listing.currency}
            className="!text-lg !font-bold !text-white drop-shadow-sm [&_span]:!text-white/85"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5 pt-3">
        <h3 className="text-card-title line-clamp-2 group-hover:text-primary">{listing.title}</h3>

        <div className="mt-auto flex items-center gap-1.5 pt-0.5 text-meta">
          {location ? (
            <span className="inline-flex min-w-0 items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0 text-primary/70" aria-hidden />
              <span className="truncate">{location}</span>
            </span>
          ) : null}
          {location && category ? <span className="text-border" aria-hidden>
            ·
          </span> : null}
          {category ? <span className="truncate">{category.name}</span> : null}
          {listing.condition ? (
            <>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <span className="capitalize truncate">{listing.condition}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
