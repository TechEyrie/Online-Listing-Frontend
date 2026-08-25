import { cn } from '@/lib/utils';

interface PromotionBadgeProps {
  isFeatured?: boolean;
  featuredUntil?: string;
  className?: string;
}

export function PromotionBadge({ isFeatured, featuredUntil, className }: PromotionBadgeProps) {
  if (!isFeatured) return null;

  const expired = featuredUntil ? new Date(featuredUntil).getTime() < Date.now() : false;
  if (expired) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-foreground shadow-soft',
        className,
      )}
    >
      Featured
    </span>
  );
}
