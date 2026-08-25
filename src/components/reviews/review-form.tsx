'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';

import { StarRating } from '@/components/reviews/star-rating';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { reviewApi } from '@/lib/review-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

interface ReviewFormProps {
  listingId: string;
  revieweeId: string;
}

export function ReviewForm({ listingId, revieweeId }: ReviewFormProps) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const eligibilityQuery = useQuery({
    queryKey: ['review-eligibility', listingId],
    queryFn: () => reviewApi.getEligibility(listingId),
    enabled: Boolean(user && listingId),
  });

  const mutation = useMutation({
    mutationFn: () =>
      reviewApi.create({
        reviewee: revieweeId,
        listing: listingId,
        rating,
        comment,
      }),
    onSuccess: async () => {
      setSuccess('Review submitted. Thank you!');
      setError(null);
      setComment('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['review-eligibility', listingId] }),
        queryClient.invalidateQueries({ queryKey: ['user-reviews', revieweeId] }),
        queryClient.invalidateQueries({ queryKey: ['user-rating', revieweeId] }),
      ]);
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not submit review');
      setSuccess(null);
    },
  });

  if (!user) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-5 text-sm shadow-soft">
        <p className="text-muted-foreground">
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>{' '}
          to leave a review for this seller.
        </p>
      </div>
    );
  }

  if (eligibilityQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">Checking review eligibility...</p>;
  }

  if (eligibilityQuery.data && !eligibilityQuery.data.canReview) {
    const reason =
      eligibilityQuery.data.reason === 'already_reviewed'
        ? 'You already reviewed this listing.'
        : eligibilityQuery.data.reason === 'own_listing'
          ? 'You cannot review your own listing.'
          : 'You cannot review this listing.';
    return <p className="text-sm text-muted-foreground">{reason}</p>;
  }

  return (
    <form
      className="space-y-4 rounded-2xl border border-border/80 bg-card p-5 shadow-soft sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (comment.trim().length < 10) {
          setError('Comment must be at least 10 characters');
          return;
        }
        mutation.mutate();
      }}
    >
      <div>
        <h3 className="font-display text-base font-bold">Rate this seller</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Share your experience with this listing.
        </p>
      </div>
      <div className="space-y-2">
        <Label>Rating</Label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-comment">Comment</Label>
        <textarea
          id="review-comment"
          className="field-control min-h-24 resize-none py-3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          placeholder="Describe your experience (at least 10 characters)"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Submitting…' : 'Submit review'}
      </Button>
    </form>
  );
}
