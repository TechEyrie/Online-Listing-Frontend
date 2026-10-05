'use client';

import { CATEGORY_ICON_OPTIONS } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

interface CategoryIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function CategoryIconPicker({ value, onChange }: CategoryIconPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted text-xl"
          aria-hidden
        >
          {value || '—'}
        </span>
        <p className="text-xs text-muted-foreground">
          {value ? `Selected: ${value}` : 'Pick an icon below (optional)'}
        </p>
        {value ? (
          <button
            type="button"
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => onChange('')}
          >
            Clear
          </button>
        ) : null}
      </div>
      <div
        className="grid max-h-44 grid-cols-8 gap-1.5 overflow-y-auto rounded-md border border-border bg-background p-2 sm:grid-cols-10"
        role="listbox"
        aria-label="Category icons"
      >
        {CATEGORY_ICON_OPTIONS.map((icon) => {
          const selected = value === icon;
          return (
            <button
              key={icon}
              type="button"
              role="option"
              aria-selected={selected}
              title={icon}
              className={cn(
                'flex h-9 w-full items-center justify-center rounded-md text-lg transition-colors hover:bg-muted',
                selected && 'bg-primary-soft ring-2 ring-primary',
              )}
              onClick={() => onChange(icon)}
            >
              {icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
