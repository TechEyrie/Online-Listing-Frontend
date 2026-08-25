'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ReviewCard } from '@/components/reviews/review-card';
import { StarRating } from '@/components/reviews/star-rating';
import { Button } from '@/components/ui/button';
import { reviewApi } from '@/lib/review-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';
import type { Review, ReviewUserRef } from '@/types/review';

export default function AdminReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isApproved =
    filter === 'approved' ? true : filter === 'hidden' ? false : undefined;

  const reviewsQuery = useQuery({
    queryKey: ['admin-reviews', filter],
    queryFn: () => reviewApi.listAdmin({ page: 1, limit: 50, isApproved }),
    enabled: user?.role === 'admin',
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, approved }: { id: string; approved: boolean }) =>
      reviewApi.moderate(id, approved),
    onSuccess: async (_data, vars) => {
      setMessage(vars.approved ? 'Review approved' : 'Review hidden');
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      await queryClient.invalidateQueries({ queryKey: ['user-reviews'] });
      await queryClient.invalidateQueries({ queryKey: ['user-rating'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Moderation failed');
      setMessage(null);
    },
  });

  if (user?.role !== 'admin') {
    return <p className="text-sm text-destructive">Admin access required for reviews.</p>;
  }

  const reviews = reviewsQuery.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-page-title">Reviews</h1>
        <p className="text-sm text-muted-foreground">Approve or hide seller reviews</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'approved', 'hidden'] as const).map((key) => (
          <Button
            key={key}
            type="button"
            size="sm"
            variant={filter === key ? 'default' : 'outline'}
            onClick={() => setFilter(key)}
          >
            {key}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {reviewsQuery.isLoading && <p className="text-sm">Loading reviews...</p>}

      <ul className="space-y-3">
        {reviews.map((review: Review) => {
          const reviewer =
            typeof review.reviewer === 'object' ? (review.reviewer as ReviewUserRef) : null;
          const reviewee =
            typeof review.reviewee === 'object' ? (review.reviewee as ReviewUserRef) : null;
          return (
            <li key={review._id} className="space-y-3 rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{reviewer?.name ?? 'Reviewer'}</span>
                    {' → '}
                    <span className="font-medium">{reviewee?.name ?? 'Seller'}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {review.isApproved ? 'Approved' : 'Hidden'} ·{' '}
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
                <StarRating value={review.rating} readOnly size="sm" />
              </div>
              <ReviewCard review={review} />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={moderateMutation.isPending || review.isApproved}
                  onClick={() => moderateMutation.mutate({ id: review._id, approved: true })}
                >
                  Approve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={moderateMutation.isPending || !review.isApproved}
                  onClick={() => moderateMutation.mutate({ id: review._id, approved: false })}
                >
                  Hide
                </Button>
              </div>
            </li>
          );
        })}
        {!reviewsQuery.isLoading && reviews.length === 0 && (
          <li className="text-sm text-muted-foreground">No reviews in this filter.</li>
        )}
      </ul>
    </div>
  );
}
