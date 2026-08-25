'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, ShieldCheck } from 'lucide-react';

import { RatingBadge } from '@/components/reviews/rating-badge';
import type { ListingSeller } from '@/types/listing';

interface SellerInfoProps {
  seller: ListingSeller;
}

export function SellerInfo({ seller }: SellerInfoProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-muted/40 p-4">
      <p className="page-eyebrow mb-3">Seller</p>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-primary-soft ring-2 ring-card">
          {seller.avatar ? (
            <Image src={seller.avatar} alt={seller.name} fill className="object-cover" unoptimized />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-primary">
              {seller.name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/users/${seller._id}`}
            className="inline-flex items-center gap-1 font-display text-base font-bold text-foreground hover:text-primary"
          >
            {seller.name}
            <ChevronRight className="h-4 w-4 opacity-50" aria-hidden />
          </Link>
          <div className="mt-0.5">
            <RatingBadge userId={seller._id} />
          </div>
          {seller.location?.city && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" aria-hidden />
              {seller.location.city}
              {seller.location.country ? `, ${seller.location.country}` : ''}
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
        Contact through the platform for safer deals
      </p>
    </div>
  );
}
