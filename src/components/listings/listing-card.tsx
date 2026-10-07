'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Images, MapPin } from 'lucide-react';

import { MOSQUE_ARCH_CLIP_PATH } from '@/components/common/mosque-arch-clip';
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
  const metaParts = [
    location || null,
    category?.name || null,
    listing.condition ? listing.condition : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={cn(
        'listing-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        listing.isFeatured && 'listing-card--featured',
        className,
      )}
      aria-label={listing.title}
    >
      <div
        className="listing-card__arch relative overflow-hidden transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-3"
        style={{
          clipPath: MOSQUE_ARCH_CLIP_PATH,
          aspectRatio: '3 / 4.25',
        }}
      >
        {image ? (
          <Image
            src={cloudinaryImageUrl(image, { width: 800 })}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-sm text-muted-foreground">
            No image
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-90"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.42) 48%, rgba(0,0,0,0.06) 100%)',
          }}
        />

        {showStatus && (
          <div className="absolute right-5 top-[50%] z-10 sm:right-6">
            <ListingStatusBadge status={listing.status} />
          </div>
        )}

        {imageCount > 1 && (
          <span
            className={cn(
              'absolute z-10 inline-flex items-center gap-1 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm',
              showStatus ? 'right-5 top-[60%] sm:right-6' : 'right-5 top-[50%] sm:right-6',
            )}
          >
            <Images className="h-3 w-3" aria-hidden />
            {imageCount}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-7 pt-14 sm:px-5 sm:pb-8">
          <PromotionBadge
            isFeatured={listing.isFeatured}
            featuredUntil={listing.featuredUntil}
            className="mb-2"
          />

          <PriceDisplay
            price={listing.price}
            priceType={listing.priceType}
            currency={listing.currency}
            className="!text-lg !font-bold !text-white drop-shadow-sm sm:!text-xl [&_span]:!text-white/85"
          />

          <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug text-white drop-shadow-sm sm:text-lg">
            {listing.title}
          </h3>

          {metaParts.length > 0 ? (
            <p className="mt-2 flex min-w-0 items-center gap-1 text-[11px] font-normal leading-snug text-white/75 sm:text-xs">
              {location ? <MapPin className="h-3 w-3 shrink-0 text-white/70" aria-hidden /> : null}
              <span className="truncate capitalize">{metaParts.join(' · ')}</span>
            </p>
          ) : null}

          <div className="mt-3 flex items-center gap-2 overflow-hidden">
            <span className="block h-0.5 w-6 rounded-full bg-primary transition-all duration-500 group-hover:w-12" />
            <span className="translate-x-4 text-xs font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
