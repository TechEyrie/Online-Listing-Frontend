'use client';

import { useQuery } from '@tanstack/react-query';

import { StarRating } from '@/components/reviews/star-rating';
import { reviewApi } from '@/lib/review-api';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  userId: string;
  className?: string;
}

export function RatingBadge({ userId, className }: RatingBadgeProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-rating', userId],
    queryFn: () => reviewApi.getUserRating(userId),
    enabled: Boolean(userId),
  });

  if (isLoading) {
    return <p className={cn('text-xs text-muted-foreground', className)}>Loading rating...</p>;
  }

  const average = data?.average ?? 0;
  const count = data?.count ?? 0;

  if (count === 0) {
    return <p className={cn('text-xs text-muted-foreground', className)}>No reviews yet</p>;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StarRating value={average} readOnly size="sm" />
      <span className="text-sm font-medium">{average.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count} reviews)</span>
    </div>
  );
}
