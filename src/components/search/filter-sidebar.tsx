'use client';

import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

interface FilterSidebarProps {
  tree: CategoryTreeNode[];
  options?: FilterOptions;
  value: SearchFilterState;
  onChange: (next: SearchFilterState) => void;
  className?: string;
}

export function FilterSidebar({ tree, options, value, onChange, className }: FilterSidebarProps) {
  const setField = <K extends keyof SearchFilterState>(key: K, fieldValue: SearchFilterState[K]) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <aside className={`space-y-5 rounded-xl border border-border bg-card p-5 shadow-soft ${className ?? ''}`}>
      <div>
        <p className="page-eyebrow">Refine</p>
        <h2 className="mt-1 font-display text-lg font-semibold">Filters</h2>
      </div>

      <Field label="Category" htmlFor="filter-category">
        <Select
          id="filter-category"
          value={value.category}
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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Min price" htmlFor="priceMin">
          <Input
            id="priceMin"
            type="number"
            min={0}
            placeholder={String(options?.priceRange.min ?? 0)}
            value={value.priceMin}
            onChange={(e) => setField('priceMin', e.target.value)}
          />
        </Field>
        <Field label="Max price" htmlFor="priceMax">
          <Input
            id="priceMax"
            type="number"
            min={0}
            placeholder={String(options?.priceRange.max ?? 0)}
            value={value.priceMax}
            onChange={(e) => setField('priceMax', e.target.value)}
          />
        </Field>
      </div>

      <Field label="City" htmlFor="filter-city">
        <Select
          id="filter-city"
          value={value.city}
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

      <Field label="Type" htmlFor="filter-type">
        <Select
          id="filter-type"
          value={value.type}
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

      <Field label="Condition" htmlFor="filter-condition">
        <Select
          id="filter-condition"
          value={value.condition}
          onChange={(e) => setField('condition', e.target.value)}
        >
          <option value="">Any condition</option>
          {(options?.conditions?.length ? options.conditions : ['new', 'used', 'refurbished']).map(
            (condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ),
          )}
        </Select>
      </Field>

      {(options?.attributes ?? []).length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <p className="font-display text-sm font-semibold">Category details</p>
          {options!.attributes.map((attr) => {
            const id = `attr-${attr.name}`;
            const current = value.attributes[attr.name] ?? '';
            if (attr.type === 'select' && attr.options?.length) {
              return (
                <Field key={attr.name} label={attr.name} htmlFor={id}>
                  <Select
                    id={id}
                    value={current}
                    onChange={(e) =>
                      setField('attributes', {
                        ...value.attributes,
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
                      ...value.attributes,
                      [attr.name]: e.target.value,
                    })
                  }
                />
              </Field>
            );
          })}
        </div>
      )}
    </aside>
  );
}
