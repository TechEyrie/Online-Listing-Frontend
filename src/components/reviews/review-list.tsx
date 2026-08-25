'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ReviewCard } from '@/components/reviews/review-card';
import { Button } from '@/components/ui/button';
import { reviewApi } from '@/lib/review-api';

interface ReviewListProps {
  userId: string;
}

export function ReviewList({ userId }: ReviewListProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-reviews', userId, page],
    queryFn: () => reviewApi.getUserReviews(userId, { page, limit: 10 }),
    enabled: Boolean(userId),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading reviews...</p>;
  if (isError) return <p className="text-sm text-destructive">Could not load reviews.</p>;

  const reviews = data?.data ?? [];
  const meta = data?.meta;

  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
