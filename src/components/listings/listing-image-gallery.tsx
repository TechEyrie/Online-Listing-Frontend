'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';

import { cloudinaryImageUrl } from '@/lib/cloudinary';
import { cn } from '@/lib/utils';
import type { ListingImage } from '@/types/listing';

interface ListingImageGalleryProps {
  images: ListingImage[];
  title: string;
}

export function ListingImageGallery({ images, title }: ListingImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);
  const total = sorted.length;
  const current = sorted[active];

  const go = useCallback(
    (dir: -1 | 1) => {
      if (total < 2) return;
      setActive((i) => (i + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!total) {
    return (
      <div className="flex aspect-[16/11] items-center justify-center rounded-2xl border border-border/80 bg-muted text-sm text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="group relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted shadow-elevated">
        <Image
          src={cloudinaryImageUrl(current.url, { width: 1600 })}
          alt={`${title} — photo ${active + 1} of ${total}`}
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 1024px) 100vw, 62vw"
          priority
          key={current.url}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/20 bg-card/90 text-foreground opacity-100 shadow-soft backdrop-blur-sm transition hover:bg-card sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-white/20 bg-card/90 text-foreground opacity-100 shadow-soft backdrop-blur-sm transition hover:bg-card sm:opacity-0 sm:group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-card/95 px-2.5 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur-sm">
          <Images className="h-3.5 w-3.5 text-primary" aria-hidden />
          {active + 1} / {total}
        </span>
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
          {sorted.map((img, index) => (
            <button
              key={`${img.publicId}-${index}`}
              type="button"
              aria-label={`Show photo ${index + 1}`}
              aria-current={active === index}
              onClick={() => setActive(index)}
              className={cn(
                'relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition duration-fast sm:h-20 sm:w-20',
                active === index
                  ? 'border-primary shadow-soft'
                  : 'border-transparent opacity-75 hover:opacity-100',
              )}
            >
              <Image
                src={cloudinaryImageUrl(img.url, { width: 160, height: 160 })}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
