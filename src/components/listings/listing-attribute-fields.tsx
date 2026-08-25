'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CategoryAttribute } from '@/types/category';

interface ListingAttributeFieldsProps {
  attributes: CategoryAttribute[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function ListingAttributeFields({
  attributes,
  values,
  onChange,
}: ListingAttributeFieldsProps) {
  if (!attributes.length) {
    return <p className="text-sm text-muted-foreground">No extra attributes for this category.</p>;
  }

  return (
    <div className="space-y-4">
      {attributes.map((attr) => {
        const id = `attr-${attr.name}`;
        const value = values[attr.name] ?? '';

        if (attr.type === 'boolean') {
          return (
            <label key={attr.name} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => onChange(attr.name, e.target.checked ? 'true' : 'false')}
              />
              <span>
                {attr.name}
                {attr.required ? ' *' : ''}
              </span>
            </label>
          );
        }

        if (attr.type === 'select' && attr.options?.length) {
          return (
            <div key={attr.name} className="space-y-2">
              <Label htmlFor={id}>
                {attr.name}
                {attr.required ? ' *' : ''}
              </Label>
              <select
                id={id}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={value}
                onChange={(e) => onChange(attr.name, e.target.value)}
              >
                <option value="">Select...</option>
                {attr.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={attr.name} className="space-y-2">
            <Label htmlFor={id}>
              {attr.name}
              {attr.required ? ' *' : ''}
            </Label>
            <Input
              id={id}
              type={attr.type === 'number' ? 'number' : 'text'}
              placeholder={attr.placeholder}
              value={value}
              onChange={(e) => onChange(attr.name, e.target.value)}
            />
          </div>
        );
      })}
    </div>
  );
}
