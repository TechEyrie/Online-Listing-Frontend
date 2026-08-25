'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from '@/types/category';

interface CategorySidebarProps {
  tree: CategoryTreeNode[];
  activeSlug?: string;
  className?: string;
}

export function CategorySidebar({ tree, activeSlug, className }: CategorySidebarProps) {
  return (
    <aside className={cn('space-y-2 text-sm', className)}>
      <p className="font-medium">Categories</p>
      <ul className="space-y-1">
        {tree.map((root) => (
          <li key={root._id}>
            <Link
              href={`/categories/${root.slug}`}
              className={cn(
                'block rounded px-2 py-1 hover:bg-muted',
                activeSlug === root.slug && 'bg-muted font-medium',
              )}
            >
              {root.icon ? `${root.icon} ` : ''}
              {root.name}
            </Link>
            {root.children.length > 0 && (
              <ul className="ml-3 space-y-1 border-l pl-2">
                {root.children.map((child) => (
                  <li key={child._id}>
                    <Link
                      href={`/categories/${child.slug}`}
                      className={cn(
                        'block rounded px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground',
                        activeSlug === child.slug && 'bg-muted font-medium text-foreground',
                      )}
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
