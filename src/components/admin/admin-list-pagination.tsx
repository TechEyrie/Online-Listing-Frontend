'use client';

import { Button } from '@/components/ui/button';
import type { AdminListMeta } from '@/types/admin';

interface AdminListPaginationProps {
  meta?: AdminListMeta;
  page: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  itemLabel?: string;
}

export function AdminListPagination({
  meta,
  page,
  onPageChange,
  isFetching = false,
  itemLabel = 'items',
}: AdminListPaginationProps) {
  if (!meta) return null;

  const label = meta.total === 1 ? itemLabel.replace(/s$/, '') : itemLabel;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground">
        Page {meta.page} of {meta.totalPages} · {meta.total.toLocaleString()} {label}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page <= 1 || isFetching}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page >= meta.totalPages || isFetching}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
