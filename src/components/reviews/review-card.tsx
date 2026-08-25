'use client';

import Link from 'next/link';

import { StarRating } from '@/components/reviews/star-rating';
import type { Review, ReviewListingRef, ReviewUserRef } from '@/types/review';

interface ReviewCardProps {
  review: Review;
  onDelete?: (reviewId: string) => void;
  showDelete?: boolean;
}

export function ReviewCard({ review, onDelete, showDelete = false }: ReviewCardProps) {
  const reviewer =
    typeof review.reviewer === 'object' ? (review.reviewer as ReviewUserRef) : null;
  const listing =
    typeof review.listing === 'object' ? (review.listing as ReviewListingRef) : null;

  return (
    <article className="space-y-2 rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{reviewer?.name ?? 'Anonymous'}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
        <StarRating value={review.rating} readOnly size="sm" />
      </div>
      <p className="text-sm leading-relaxed">{review.comment}</p>
      {listing && (
        <p className="text-xs text-muted-foreground">
          For{' '}
          <Link href={`/listings/${listing.slug}`} className="underline">
            {listing.title}
          </Link>
        </p>
      )}
      {showDelete && onDelete && (
        <button
          type="button"
          className="text-xs text-destructive underline"
          onClick={() => onDelete(review._id)}
        >
          Delete review
        </button>
      )}
    </article>
  );
}
