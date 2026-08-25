'use client';

import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { useCategoryTree } from '@/hooks/use-categories';

export function CategoryNav() {
  const { data: tree, isLoading, isError } = useCategoryTree();

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !tree?.length) {
    return <p className="text-sm text-muted-foreground">No categories yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {tree.map((category) => (
        <Link
          key={category._id}
          href={`/categories/${category.slug}`}
          className="group flex items-start gap-3.5 rounded-2xl border border-border/80 bg-card p-4 shadow-soft transition duration-slow hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated"
        >
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-xl transition-colors group-hover:bg-accent-soft"
            aria-hidden
          >
            {category.icon || '•'}
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-bold group-hover:text-primary">
              {category.name}
            </p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {category.children.length} subcategor{category.children.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
