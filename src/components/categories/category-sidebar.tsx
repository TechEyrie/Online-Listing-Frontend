'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from '@/types/category';

interface CategorySidebarProps {
  tree: CategoryTreeNode[];
  activeSlug?: string;
  className?: string;
}

function collectAncestorIdsForSlug(nodes: CategoryTreeNode[], slug: string): Set<string> {
  const expanded = new Set<string>();

  const walk = (list: CategoryTreeNode[], ancestors: string[]): boolean => {
    for (const node of list) {
      if (node.slug === slug) {
        ancestors.forEach((id) => expanded.add(id));
        return true;
      }
      if (node.children.length > 0 && walk(node.children, [...ancestors, node._id])) {
        expanded.add(node._id);
        return true;
      }
    }
    return false;
  };

  walk(nodes, []);
  return expanded;
}

export function CategorySidebar({ tree, activeSlug, className }: CategorySidebarProps) {
  const autoExpanded = useMemo(
    () => (activeSlug ? collectAncestorIdsForSlug(tree, activeSlug) : new Set<string>()),
    [tree, activeSlug],
  );

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(autoExpanded));

  useEffect(() => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      autoExpanded.forEach((id) => next.add(id));
      return next;
    });
  }, [autoExpanded]);

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className={cn('rounded-2xl border border-border/80 bg-card p-4 shadow-soft', className)}>
      <p className="mb-3 text-sm font-bold text-foreground">Categories</p>
      <ul className="space-y-1">
        {tree.map((root) => {
          const hasChildren = root.children.length > 0;
          const isOpen = expandedIds.has(root._id);
          const subListId = `category-nav-subs-${root._id}`;

          return (
            <li key={root._id}>
              <div className="flex items-center gap-1">
                <Link
                  href={`/categories/${root.slug}`}
                  className={cn(
                    'min-w-0 flex-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    activeSlug === root.slug ? 'bg-primary/10 text-primary' : 'text-foreground',
                  )}
                >
                  <span className="truncate">
                    {root.icon ? `${root.icon} ` : ''}
                    {root.name}
                  </span>
                </Link>
                {hasChildren ? (
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={subListId}
                    aria-label={
                      isOpen ? `Hide ${root.name} subcategories` : `Show ${root.name} subcategories`
                    }
                    onClick={() => toggle(root._id)}
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60',
                      'bg-background text-foreground transition-colors hover:bg-muted',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    )}
                  >
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                ) : null}
              </div>

              {hasChildren && isOpen ? (
                <ul id={subListId} className="ml-2 mt-1 space-y-0.5 border-l border-border/70 pl-2.5">
                  {root.children.map((child) => (
                    <li key={child._id}>
                      <Link
                        href={`/categories/${child.slug}`}
                        className={cn(
                          'block rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                          'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          activeSlug === child.slug
                            ? 'bg-muted font-semibold text-foreground'
                            : 'font-medium text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}