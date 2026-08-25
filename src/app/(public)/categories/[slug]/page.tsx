'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { CategoryBreadcrumb } from '@/components/categories/category-breadcrumb';
import { CategorySidebar } from '@/components/categories/category-sidebar';
import { ListingCard } from '@/components/listings/listing-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategoryBySlug, useCategoryTree } from '@/hooks/use-categories';
import { listingApi } from '@/lib/listing-api';
import type { CategoryTreeNode } from '@/types/category';

function findPath(
  nodes: CategoryTreeNode[],
  slug: string,
  trail: CategoryTreeNode[] = [],
): CategoryTreeNode[] | null {
  for (const node of nodes) {
    const next = [...trail, node];
    if (node.slug === slug) return next;
    const found = findPath(node.children, slug, next);
    if (found) return found;
  }
  return null;
}

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: category, isLoading, isError } = useCategoryBySlug(slug);
  const { data: tree = [] } = useCategoryTree();

  const path = useMemo(() => findPath(tree, slug) ?? [], [tree, slug]);
  const node = path[path.length - 1];
  const children = node?.children ?? [];
  const isRoot = Boolean(node && !node.parent);

  const listingsQuery = useQuery({
    queryKey: ['listings', 'category', slug, isRoot],
    queryFn: async () => {
      const res = await listingApi.list({
        category: isRoot ? slug : undefined,
        subcategory: isRoot ? undefined : slug,
        limit: 24,
      });
      return res;
    },
    enabled: Boolean(category),
    staleTime: 45_000,
  });

  return (
    <main className="mx-auto flex w-full max-w-app flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <CategoryBreadcrumb
        items={[
          { label: 'Categories', href: '/' },
          ...path.map((item, index) => ({
            label: item.name,
            href: index < path.length - 1 ? `/categories/${item.slug}` : undefined,
          })),
        ]}
      />

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <CategorySidebar tree={tree} activeSlug={slug} className="hidden md:block" />

        <div className="space-y-6">
          {isLoading && <p className="text-sm text-muted-foreground">Loading category...</p>}
          {isError && <p className="text-destructive">Category not found</p>}

          {category && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span aria-hidden>{category.icon}</span>
                  {category.name}
                </CardTitle>
                {category.description && (
                  <CardDescription>{category.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {children.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Subcategories</p>
                    <div className="flex flex-wrap gap-2">
                      {children.map((child) => (
                        <Link
                          key={child._id}
                          href={`/categories/${child.slug}`}
                          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition hover:border-primary/30 hover:bg-muted"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Listings</h2>
            {listingsQuery.isLoading && (
              <p className="text-sm text-muted-foreground">Loading listings...</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listingsQuery.data?.data?.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
            {!listingsQuery.isLoading && listingsQuery.data?.data?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active listings in this category yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
