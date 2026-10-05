'use client';

import Image from 'next/image';
import Link from 'next/link';

import type { AssistantListingCard } from '@/types/assistant';

interface AssistantListingCardsProps {
  listings: AssistantListingCard[];
}

export function AssistantListingCards({ listings }: AssistantListingCardsProps) {
  if (!listings.length) return null;

  return (
    <ul className="mt-2 space-y-2">
      {listings.map((listing) => (
        <li key={listing.id}>
          <Link
            href={listing.href}
            className="flex gap-3 rounded-[12px] border border-border bg-background/80 p-2 transition hover:border-primary/40 hover:bg-muted/40"
          >
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px] bg-muted">
              {listing.imageUrl ? (
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : null}
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
      ))}
    </ul>
  );
}
