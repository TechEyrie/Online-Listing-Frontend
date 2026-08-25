'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, hasNext, hasPrev, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, page - 3),
    Math.min(totalPages, page + 2),
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button type="button" variant="outline" size="sm" disabled={!hasPrev} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          type="button"
          size="sm"
          variant={p === page ? 'default' : 'outline'}
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button type="button" variant="outline" size="sm" disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
