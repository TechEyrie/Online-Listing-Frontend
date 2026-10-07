'use client';

import { useEffect, useState } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { CategoryTreeNode } from '@/types/category';
import type { FilterOptions } from '@/types/search';

export interface SearchFilterState {
  category: string;
  type: string;
  condition: string;
  city: string;
  priceMin: string;
  priceMax: string;
  attributes: Record<string, string>;
}

const EMPTY_STATE: SearchFilterState = {
  category: '',
  type: '',
  condition: '',
  city: '',
  priceMin: '',
  priceMax: '',
  attributes: {},
};

interface FilterSidebarProps {
  tree: CategoryTreeNode[];
  options?: FilterOptions;
  /** The currently-applied filter state (from URL). Used to sync draft on external changes. */
  value: SearchFilterState;
  /** Called only when the user clicks "Apply Filters". */
  onChange: (next: SearchFilterState) => void;
  className?: string;
}

export function FilterSidebar({ tree, options, value, onChange, className }: FilterSidebarProps) {
  // ── Local draft — NOT synced to URL until Apply is clicked ──────────────
  const [draft, setDraft] = useState<SearchFilterState>(value);

  // Keep draft in sync when filters change from outside (e.g. user removes an
  // active-filter chip, or navigates via category link)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  // ── Derived: has anything in draft changed from the applied URL value? ───
  const isDirty =
    draft.category !== value.category ||
    draft.type !== value.type ||
    draft.condition !== value.condition ||
    draft.city !== value.city ||
    draft.priceMin !== value.priceMin ||
    draft.priceMax !== value.priceMax ||
    JSON.stringify(draft.attributes) !== JSON.stringify(value.attributes);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const setField = <K extends keyof SearchFilterState>(
    key: K,
    fieldValue: SearchFilterState[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: fieldValue }));
  };

  const handleApply = () => {
    onChange(draft);
  };

  const handleReset = () => {
    const empty = { ...EMPTY_STATE };
    setDraft(empty);
    onChange(empty);
  };

  // ── Active filter count badge ────────────────────────────────────────────
  const activeCount = [
    value.category,
    value.type,
    value.condition,
    value.city,
    value.priceMin,
    value.priceMax,
    ...Object.values(value.attributes),
  ].filter(Boolean).length;

  return (
    <aside
      className={`space-y-5 rounded-xl border border-border bg-card p-5 shadow-soft ${className ?? ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="page-eyebrow">Refine</p>
          <h2 className="mt-0.5 font-display text-lg font-semibold">
            Filters
            {activeCount > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </h2>
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive"
            aria-label="Clear all filters"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        )}
      </div>

      {/* ── Category ── */}
      <Field label="Category" htmlFor="filter-category">
        <Select
          id="filter-category"
          value={draft.category}
          onChange={(e) => setField('category', e.target.value)}
        >
          <option value="">All categories</option>
          {tree.map((root) => (
            <optgroup key={root._id} label={root.name}>
              <option value={root.slug}>{root.name}</option>
              {root.children.map((child) => (
                <option key={child._id} value={child.slug}>
                  {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Field>

      {/* ── Price range ── */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price" htmlFor="priceMin">
          <Input
            id="priceMin"
            type="number"
            min={0}
            placeholder={String(options?.priceRange.min ?? 0)}
            value={draft.priceMin}
            onChange={(e) => setField('priceMin', e.target.value)}
          />
        </Field>
        <Field label="Max price" htmlFor="priceMax">
          <Input
            id="priceMax"
            type="number"
            min={0}
            placeholder={String(options?.priceRange.max ?? 0)}
            value={draft.priceMax}
            onChange={(e) => setField('priceMax', e.target.value)}
          />
        </Field>
      </div>

      {/* ── City ── */}
      <Field label="City" htmlFor="filter-city">
        <Select
          id="filter-city"
          value={draft.city}
          onChange={(e) => setField('city', e.target.value)}
        >
          <option value="">All cities</option>
          {(options?.cities ?? []).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </Field>

      {/* ── Type ── */}
      <Field label="Type" htmlFor="filter-type">
        <Select
          id="filter-type"
          value={draft.type}
          onChange={(e) => setField('type', e.target.value)}
        >
          <option value="">Any type</option>
          {(options?.types?.length ? options.types : ['sale', 'rent', 'service', 'job', 'wanted']).map(
            (type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ),
          )}
        </Select>
      </Field>

      {/* ── Condition ── */}
      <Field label="Condition" htmlFor="filter-condition">
        <Select
          id="filter-condition"
          value={draft.condition}
          onChange={(e) => setField('condition', e.target.value)}
        >
          <option value="">Any condition</option>
          {(options?.conditions?.length
            ? options.conditions
            : ['new', 'used', 'refurbished']
          ).map((condition) => (
            <option key={condition} value={condition}>
              {condition}
            </option>
          ))}
        </Select>
      </Field>

      {/* ── Dynamic category attributes ── */}
      {(options?.attributes ?? []).length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="font-display text-sm font-semibold">Category details</p>
          {options!.attributes.map((attr) => {
            const id = `attr-${attr.name}`;
            const current = draft.attributes[attr.name] ?? '';
            if (attr.type === 'select' && attr.options?.length) {
              return (
                <Field key={attr.name} label={attr.name} htmlFor={id}>
                  <Select
                    id={id}
                    value={current}
                    onChange={(e) =>
                      setField('attributes', {
                        ...draft.attributes,
                        [attr.name]: e.target.value,
                      })
                    }
                  >
                    <option value="">Any</option>
                    {attr.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Select>
                </Field>
              );
            }
            return (
              <Field key={attr.name} label={attr.name} htmlFor={id}>
                <Input
                  id={id}
                  type={attr.type === 'number' ? 'number' : 'text'}
                  value={current}
                  onChange={(e) =>
                    setField('attributes', {
                      ...draft.attributes,
                      [attr.name]: e.target.value,
                    })
                  }
                />
              </Field>
            );
          })}
        </div>
      )}

      {/* ── Apply button ─────────────────────────────────────────────────── */}
      <div className="border-t border-border pt-4">
        <Button
          id="apply-filters-btn"
          type="button"
          onClick={handleApply}
          className="w-full gap-2"
          disabled={!isDirty}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {isDirty ? 'Apply Filters' : 'Filters Applied'}
        </Button>
      </div>
    </aside>
  );
}
