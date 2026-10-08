'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Building2,
  Car,
  Cpu,
  GraduationCap,
  Hammer,
  Home,
  Landmark,
  Package,
  PawPrint,
  Phone,
  Shirt,
  ShoppingBag,
  Tractor,
  TreePalm,
  Watch,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useCategoryTree } from '@/hooks/use-categories';
import { categoryApi } from '@/lib/category-api';
import { cn } from '@/lib/utils';

interface CategoryVisual {
  icon: LucideIcon;
  from: string;
  to: string;
}

const VISUALS: Record<string, CategoryVisual> = {
  vehicles: { icon: Car, from: '#1d9bf0', to: '#0ea5e9' },
  property: { icon: Home, from: '#f97316', to: '#fb7185' },
  electronics: { icon: Cpu, from: '#6366f1', to: '#8b5cf6' },
  mobiles: { icon: Phone, from: '#0ea5e9', to: '#22d3ee' },
  'home-garden': { icon: TreePalm, from: '#10b981', to: '#34d399' },
  services: { icon: Hammer, from: '#f59e0b', to: '#fbbf24' },
  'business-industry': { icon: Landmark, from: '#475569', to: '#64748b' },
  jobs: { icon: Briefcase, from: '#2563eb', to: '#3b82f6' },
  animals: { icon: PawPrint, from: '#d97706', to: '#f59e0b' },
  'hobby-sport-kids': { icon: ShoppingBag, from: '#14b8a6', to: '#22c55e' },
  'fashion-beauty': { icon: Shirt, from: '#e11d48', to: '#fb7185' },
  education: { icon: GraduationCap, from: '#7c3aed', to: '#a78bfa' },
  agriculture: { icon: Tractor, from: '#ca8a04', to: '#eab308' },
  essentials: { icon: Watch, from: '#059669', to: '#34d399' },
  other: { icon: Package, from: '#78716c', to: '#a8a29e' },
};

const FALLBACK: CategoryVisual = { icon: Building2, from: '#131921', to: '#374151' };

function formatAdCount(count: number): string {
  return `${count.toLocaleString()} ad${count === 1 ? '' : 's'}`;
}

export function CategoryBrowseGrid() {
  const { data: tree, isLoading: treeLoading } = useCategoryTree();
  const { data: counts, isLoading: countsLoading } = useQuery({
    queryKey: ['categories', 'counts'],
    queryFn: async () => {
      const res = await categoryApi.getListingCounts();
      return res.data;
    },
    staleTime: 60_000,
  });

  const loading = treeLoading || countsLoading;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <header className="mb-10 max-w-2xl sm:mb-12">
        <p className="page-eyebrow">Marketplace</p>
        <h2 className="text-section-title mt-2">Browse items by category</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          Jump straight into what you need — vehicles, property, gadgets, and more.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-border/50 px-4 py-4"
            >
              <div className="h-[3.25rem] w-[3.25rem] shrink-0 animate-pulse rounded-2xl bg-muted" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : !tree?.length ? null : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {tree.map((category) => {
            const visual = VISUALS[category.slug] ?? FALLBACK;
            const Icon = visual.icon;
            const adCount = counts?.[category.slug] ?? 0;

            return (
              <Link
                key={category._id}
                href={`/categories/${category.slug}`}
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-3.5 py-3.5',
                  'outline-none transition-all duration-300',
                  'hover:-translate-y-0.5 hover:bg-card hover:shadow-[0_14px_32px_rgba(19,25,33,0.10)]',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                <span
                  className="relative flex h-[3.35rem] w-[3.35rem] shrink-0 items-center justify-center rounded-2xl text-white shadow-[0_10px_22px_rgba(19,25,33,0.18)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"
                  style={{
                    background: `linear-gradient(145deg, ${visual.from} 0%, ${visual.to} 100%)`,
                  }}
                  aria-hidden
                >
                  <Icon className="h-[1.35rem] w-[1.35rem] stroke-[2.2]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold leading-snug text-foreground">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-[13px] font-medium tabular-nums leading-none text-muted-foreground">
                    {formatAdCount(adCount)}
                  </span>
                </span>
                <span
                  className="mr-0.5 text-xl font-light text-muted-foreground/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
