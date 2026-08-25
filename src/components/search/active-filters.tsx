'use client';

import { Button } from '@/components/ui/button';

export interface ActiveFilterChip {
  key: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilterChip[];
  onRemove: (key: string) => void;
  onClear: () => void;
}

export function ActiveFilters({ filters, onRemove, onClear }: ActiveFiltersProps) {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          className="rounded-full border px-3 py-1 text-xs hover:bg-muted"
          onClick={() => onRemove(filter.key)}
        >
          {filter.label} ×
        </button>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        Clear all
      </Button>
    </div>
  );
}
