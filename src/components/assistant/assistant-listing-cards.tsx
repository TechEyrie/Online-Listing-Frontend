'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cloudinaryImageUrl } from '@/lib/cloudinary';
import { getListingCoverUrl, isListingPlaceholderSrc, LISTING_PLACEHOLDER_SRC } from '@/lib/listing-image';
import type { AssistantListingCard } from '@/types/assistant';

interface AssistantListingCardsProps {
  listings: AssistantListingCard[];
}

export function AssistantListingCards({ listings }: AssistantListingCardsProps) {
  if (!listings.length) return null;

  return (
    <ul className="mt-2 space-y-2">
      {listings.map((listing) => {
        const coverRaw = getListingCoverUrl(listing.imageUrl);
        const thumbSrc = isListingPlaceholderSrc(coverRaw)
          ? LISTING_PLACEHOLDER_SRC
          : cloudinaryImageUrl(coverRaw, { width: 112, height: 112 });
        return (
        <li key={listing.id}>
          <Link
            href={listing.href}
            className="flex gap-3 rounded-[12px] border border-border bg-background/80 p-2 transition hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-muted">
              <Image
                src={thumbSrc}
                alt={listing.imageUrl ? listing.title : `${listing.title} — no photo`}
                fill
                className={listing.imageUrl ? 'object-cover' : 'object-contain p-1'}
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{listing.title}</p>
              <p className="text-xs font-medium text-primary">
                {listing.currency} {listing.price.toLocaleString()}
                {listing.location?.city ? ` · ${listing.location.city}` : ''}
              </p>
              {listing.reason ? (
                <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                  {listing.reason}
                </p>
              ) : null}
            </div>
          </Link>
        </li>
        );
      })}
    </ul>
  );
}
