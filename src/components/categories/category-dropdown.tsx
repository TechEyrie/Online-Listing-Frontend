'use client';

import { useMemo } from 'react';

import type { CategoryTreeNode } from '@/types/category';

interface CategoryDropdownProps {
  tree: CategoryTreeNode[];
  value?: string;
  onChange: (categoryId: string) => void;
  includeEmpty?: boolean;
  className?: string;
}

interface FlatOption {
  id: string;
  label: string;
  depth: number;
}

const flatten = (nodes: CategoryTreeNode[], depth = 0): FlatOption[] => {
  const options: FlatOption[] = [];
  for (const node of nodes) {
    options.push({
      id: node._id,
      label: `${'— '.repeat(depth)}${node.name}`,
      depth,
    });
    if (node.children.length) {
      options.push(...flatten(node.children, depth + 1));
    }
  }
  return options;
};

export function CategoryDropdown({
  tree,
  value,
  onChange,
  includeEmpty = true,
  className,
}: CategoryDropdownProps) {
  const options = useMemo(() => flatten(tree), [tree]);

  return (
    <select
      className={
        className ??
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
      }
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {includeEmpty && <option value="">Select category</option>}
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
