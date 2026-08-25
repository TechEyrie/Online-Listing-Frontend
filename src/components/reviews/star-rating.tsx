'use client';

import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
  className?: string;
  readOnly?: boolean;
}

export function StarRating({
  value,
  onChange,
  size = 'md',
  className,
  readOnly = false,
}: StarRatingProps) {
  const interactive = Boolean(onChange) && !readOnly;
  const starSize = size === 'sm' ? 'text-base' : 'text-2xl';

  return (
    <div className={cn('flex items-center gap-1', className)} role={interactive ? 'radiogroup' : undefined}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(value);
        const label = `${star} star${star === 1 ? '' : 's'}`;
        if (!interactive) {
          return (
            <span
              key={star}
              aria-hidden="true"
              className={cn(starSize, filled ? 'text-amber-500' : 'text-muted-foreground/40')}
            >
              ★
            </span>
          );
        }
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={label}
            className={cn(
              starSize,
              'rounded transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              filled ? 'text-amber-500' : 'text-muted-foreground/40',
            )}
            onClick={() => onChange?.(star)}
          >
            ★
          </button>
        );
      })}
      <span className="sr-only">{value} out of 5 stars</span>
    </div>
  );
}
