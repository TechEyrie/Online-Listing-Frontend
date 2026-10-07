'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import type { CategoryBrowseItem } from '@/components/categories/category-browse-data';

interface CategoryBrowseCardProps {
  item: CategoryBrowseItem;
  isDragging: boolean;
}

export function CategoryBrowseCard({ item, isDragging }: CategoryBrowseCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/categories/${item.slug}`}
      draggable={false}
      className="group relative block h-full w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      aria-label={`Browse ${item.name}`}
    >
      <article
        className="relative h-full overflow-hidden rounded-[1.75rem] shadow-[0_4px_20px_rgba(28,48,44,0.08)] transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_32px_rgba(28,48,44,0.14)]"
        style={{ aspectRatio: '3 / 5.1', background: item.tint }}
      >
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 22vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            onError={() => setImgError(true)}
            draggable={false}
            unoptimized
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0) 100%)',
          }}
        />

        <div className="absolute inset-x-0 top-0 z-10 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <h3 className="max-w-[13ch] text-[1.5rem] font-bold leading-[1.12] tracking-tight text-[#111827] sm:text-[1.75rem]">
            {item.headline}
          </h3>
        </div>
      </article>
    </Link>
  );
}
