import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ListingStatus } from '@/types/listing';

const STATUS_VARIANT: Record<
  ListingStatus,
  'success' | 'warning' | 'secondary' | 'info' | 'destructive'
> = {
  active: 'success',
  pending: 'warning',
  expired: 'secondary',
  sold: 'info',
  hidden: 'destructive',
};

interface ListingStatusBadgeProps {
  status: ListingStatus;
  className?: string;
}

export function ListingStatusBadge({ status, className }: ListingStatusBadgeProps) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn('capitalize', className)}>
      {status}
    </Badge>
  );
}
