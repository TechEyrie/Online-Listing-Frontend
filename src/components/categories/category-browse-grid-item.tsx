'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { getApeqCategoryVisual } from '@/components/icons/apeq-category-icon';
import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from '@/types/category';

function formatAdCount(count: number): string {
  return `${count.toLocaleString()} ad${count === 1 ? '' : 's'}`;
}

interface CategoryBrowseGridItemProps {
  category: CategoryTreeNode;
  parentAdCount?: number;
  counts?: Record<string, number>;
  countsPending: boolean;
  countsReady: boolean;
}

export function CategoryBrowseGridItem({
  category,
  parentAdCount,
  counts,
  countsPending,
  countsReady,
}: CategoryBrowseGridItemProps) {
  const [open, setOpen] = useState(false);
  const hasChildren = category.children.length > 0;
  const visual = getApeqCategoryVisual(category.slug);
  const Icon = visual.Icon;
  const subListId = `category-subs-${category._id}`;

  return (
    <div className="flex min-w-0 flex-col rounded-2xl transition-colors hover:bg-card/80">
      <div className="flex w-full min-w-0 items-center gap-2 py-2.5 pl-2 pr-1.5 sm:gap-3 sm:py-3 sm:pl-3 sm:pr-2">
        <Link
          href={`/categories/${category.slug}`}
          className={cn(
            'group/link flex min-w-0 flex-1 items-center gap-3 sm:gap-3.5',
            'rounded-xl outline-none transition-all duration-300',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'hover:-translate-y-0.5',
          )}
        >
          <span
            className={cn(
              'relative flex h-[3.35rem] w-[3.35rem] shrink-0 items-center justify-center rounded-2xl text-white',
              'bg-[linear-gradient(145deg,#6B0F2A_0%,#A61E45_100%)]',
              'shadow-[0_4px_14px_rgba(139,21,56,0.35)] ring-1 ring-white/20',
              'transition-all duration-300 group-hover/link:scale-110 group-hover/link:rotate-[-4deg] group-hover/link:ring-accent/45',
            )}
            aria-hidden
          >
            <Icon className="h-[1.4rem] w-[1.4rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold leading-snug text-foreground">
              {category.name}
            </span>
            {countsPending ? (
              <span className="mt-1.5 block h-3 w-14 animate-pulse rounded bg-muted" />
            ) : parentAdCount !== undefined ? (
              <span className="mt-1 block text-[13px] font-medium tabular-nums leading-none text-muted-foreground">
                {formatAdCount(parentAdCount)}
              </span>
            ) : null}
          </span>
        </Link>

        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={subListId}
            aria-label={open ? `Hide ${category.name} subcategories` : `Show ${category.name} subcategories`}
            onClick={() => setOpen((value) => !value)}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-foreground shadow-sm',
              'transition-colors hover:border-primary/25 hover:bg-primary/5',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            <ChevronDown
              className={cn('h-5 w-5 transition-transform duration-200', open && 'rotate-180')}
              aria-hidden
            />
          </button>
        ) : null}
      </div>

      {hasChildren && open ? (
        <ul
          id={subListId}
          className="mb-2 space-y-0.5 border-t border-border/50 px-3 pb-2 pt-2 sm:px-3.5"
        >
          {category.children.map((child) => {
            const childCount = countsReady && counts ? (counts[child.slug] ?? 0) : undefined;

            return (
              <li key={child._id}>
                <Link
                  href={`/categories/${child.slug}`}
                  className={cn(
                    'flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm',
                    'text-foreground/90 transition-colors hover:bg-muted/80 hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <span className="min-w-0 truncate font-medium">{child.name}</span>
                  {countsPending ? (
                    <span className="h-3 w-10 shrink-0 animate-pulse rounded bg-muted" />
                  ) : childCount !== undefined ? (
                    <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                      {formatAdCount(childCount)}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}