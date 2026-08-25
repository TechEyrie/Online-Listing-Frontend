'use client';

import { Select } from '@/components/ui/select';
import type { SearchSort } from '@/types/search';

interface SortDropdownProps {
  value: SearchSort;
  onChange: (value: SearchSort) => void;
}

const OPTIONS: Array<{ value: SearchSort; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'popular', label: 'Most viewed' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select
      aria-label="Sort results"
      className="w-auto min-w-[11rem]"
      value={value}
      onChange={(e) => onChange(e.target.value as SearchSort)}
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Select>
  );
}
