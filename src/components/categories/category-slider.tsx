'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategoryTree } from '@/hooks/use-categories';

/* ─── Fallback data ─── */
const STATIC_CATEGORIES = [
  {
    _id: 's1',
    name: 'Vehicles',
    slug: 'vehicles',
    description: 'Cars, bikes & more. Find your next ride or sell what you own.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
    accent: '#1a78c2',
  },
  {
    _id: 's2',
    name: 'Property',
    slug: 'property',
    description: 'Apartments, villas & plots. Buy, rent or list your property.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    accent: '#e07b29',
  },
  {
    _id: 's3',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Phones, laptops & gadgets. Best deals on tech in Qatar.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
    accent: '#00875a',
  },
  {
    _id: 's4',
    name: 'Services',
    slug: 'services',
    description: 'Hire skilled professionals or offer your expertise locally.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    accent: '#7c3aed',
  },
  {
    _id: 's5',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Discover top roles or post a vacancy and hire fast.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    accent: '#dc2626',
  },
  {
    _id: 's6',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing, shoes & accessories from top brands & local sellers.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    accent: '#be185d',
  },
  {
    _id: 's7',
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Furniture, décor & garden essentials for your perfect space.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
    accent: '#16a34a',
  },
  {
    _id: 's8',
    name: 'Sports',
    slug: 'sports',
    description: 'Equipment, gear & activewear for every sport and level.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80',
    accent: '#ca8a04',
  },
];

const ACCENTS = [
  '#1a78c2', '#e07b29', '#00875a', '#7c3aed',
  '#dc2626', '#be185d', '#16a34a', '#ca8a04',
  '#0891b2', '#e11d48',
];

/* ─────────────────────────────────────────────────────────────────
   Hidden SVG that defines the smooth arch clip-path using
   cubic Bézier curves.

   clipPathUnits="objectBoundingBox" means all coordinates are
   in the 0–1 range, so the clip scales to any card size.

   Path anatomy (mosque / pointed arch):
     M 0 1           → bottom-left corner
     L 0 0.42        → straight left side up to ~42% from top
     C 0 0.12,       → ctrl-pt 1: pull inward and upward
       0.36 0,       → ctrl-pt 2: approach the peak horizontally
       0.5  0        → peak (top-centre)
     C 0.64 0,       → ctrl-pt 1: leave peak horizontally (mirror)
       1    0.12,    → ctrl-pt 2: pull inward and downward
       1    0.42     → straight right side start
     L 1 1           → bottom-right corner
     Z

   The two symmetric cubics produce a perfectly smooth, sharp-
   tipped Islamic arch with zero polygon jaggedness.
──────────────────────────────────────────────────────────────── */
const ARCH_CLIP_ID = 'suqora-mosque-arch';

function ArchClipSVG() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: 'absolute', overflow: 'hidden' }}
    >
      <defs>
        {/*
          Pointed Islamic / mosque arch using two cubic Bézier curves.

          Key principle: for a SHARP POINTED top, the last control point
          of the left curve and the first control point of the right curve
          must sit almost directly BELOW the peak (0.5, 0).
          This makes both tangent vectors at the peak nearly vertical,
          producing a cusp-like point rather than a smooth round top.

          Left arc:  M(0,0.46) → cp1(0,0.13) cp2(0.49,0.04) → peak(0.5,0)
          Right arc: peak(0.5,0) → cp1(0.51,0.04) cp2(1,0.13) → M(1,0.46)

          Tangent at peak from left ∝ (0.5,0)−(0.49,0.04) = (0.01,−0.04) ≈ vertical ✓
          Tangent at peak from right ∝ (0.51,0.04)−(0.5,0) = (0.01,0.04)  ≈ vertical ✓
          → Sharp point at top, smooth curves into it.
        */}
        <clipPath id={ARCH_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path d="M 0 1 L 0 0.46 C 0 0.13, 0.49 0.04, 0.5 0 C 0.51 0.04, 1 0.13, 1 0.46 L 1 1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ─── Card item type ─── */
interface CardItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  accent: string;
}

/* ─── Single arch card ─── */
function ArchCard({ item, isDragging }: { item: CardItem; isDragging: boolean }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/categories/${item.slug}`}
      draggable={false}
      className="group relative block w-full select-none focus:outline-none"
      style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
      aria-label={`Browse ${item.name}`}
    >
      <div
        className="relative overflow-hidden transition-transform duration-500 ease-out will-change-transform group-hover:-translate-y-3"
        style={{
          clipPath: `url(#${ARCH_CLIP_ID})`,
          aspectRatio: '3 / 4.5',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        }}
      >
        {/* Background image */}
        {item.image && !imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => setImgError(true)}
            draggable={false}
            unoptimized
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(160deg, ${item.accent}cc 0%, ${item.accent} 100%)`,
            }}
          />
        )}

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 50%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* Accent tint on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
          style={{ background: item.accent }}
        />

        {/* Bottom text — moved up, no Browse label */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-16">
          <h3 className="text-xl font-bold leading-tight text-white drop-shadow-sm sm:text-2xl">
            {item.name}
          </h3>

          <p className="mt-2 text-[11px] font-normal leading-snug text-white/75 sm:text-xs">
            {item.description}
          </p>

          <div className="mt-3 flex items-center gap-2 overflow-hidden">
            <span
              className="block h-0.5 w-6 rounded-full transition-all duration-500 group-hover:w-12"
              style={{ background: item.accent }}
            />
            <span className="translate-x-4 text-xs font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
              Explore →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div
      className="w-full shrink-0 animate-pulse bg-muted"
      style={{
        clipPath: `url(#${ARCH_CLIP_ID})`,
        aspectRatio: '3 / 4.5',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────
   SMOOTH SLIDER
   
   Strategy: transform-based, not scroll-based.
   - trackRef: the moving strip
   - We maintain currentOffset (px) as a ref and targetOffset
   - Arrow clicks → smooth spring-style CSS transition to new snap
   - Drag: record pointer events, compute velocity on release,
     apply momentum via requestAnimationFrame with exponential decay,
     then snap to nearest card when motion settles.
───────────────────────────────────────────────────────────────── */
export function CategorySlider() {
  const { data: tree, isLoading } = useCategoryTree();

  /* Refs */
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* Slider state */
  const offsetRef = useRef(0);          // current real offset (px)
  const targetOffsetRef = useRef(0);    // where we're animating to
  const isDraggingRef = useRef(false);
  const isPointerDown = useRef(false);  // true only while a button is held
  const rafRef = useRef<number>(0);

  /* Drag bookkeeping */
  const pointerStartX = useRef(0);
  const offsetAtDragStart = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocity = useRef(0);          // px/ms at release

  /* React state (only for UI redraws that matter) */
  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [totalCards, setTotalCards] = useState(0);

  /* Build category list */
  const categories: CardItem[] = tree?.length
    ? tree.map((c, i) => ({
        _id: c._id,
        name: c.name,
        slug: c.slug,
        description:
          STATIC_CATEGORIES[i % STATIC_CATEGORIES.length]?.description ??
          'Explore the best listings in this category.',
        image: c.image || STATIC_CATEGORIES[i % STATIC_CATEGORIES.length]?.image,
        accent: ACCENTS[i % ACCENTS.length],
      }))
    : STATIC_CATEGORIES;

  useEffect(() => {
    setTotalCards(categories.length);
  }, [categories.length]);

  /* ── Layout measurement ── */
  const measureLayout = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const gap = 16; // gap-4 = 1rem = 16px
    const count = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : window.innerWidth < 1280 ? 3 : 4;
    const cw = (vp.clientWidth - gap * (count - 1)) / count;
    setCardWidth(cw);
    setVisibleCount(count);
  }, []);

  useLayoutEffect(() => {
    measureLayout();
    window.addEventListener('resize', measureLayout);
    return () => window.removeEventListener('resize', measureLayout);
  }, [measureLayout]);

  /* ── Clamp offset to valid range ── */
  const clamp = useCallback(
    (val: number) => {
      const maxOffset = Math.max(0, (totalCards - visibleCount) * (cardWidth + 16));
      return Math.max(-maxOffset, Math.min(0, val));
    },
    [totalCards, visibleCount, cardWidth],
  );

  /* ── Snap to nearest card boundary ── */
  const snapNearest = useCallback(
    (rawOffset: number) => {
      const unit = cardWidth + 16;
      if (unit <= 0) return rawOffset;
      const snapped = Math.round(rawOffset / unit) * unit;
      return clamp(snapped);
    },
    [cardWidth, clamp],
  );

  /* ── Apply offset to DOM (no React re-render) ── */
  const applyOffset = useCallback((px: number, animate = false) => {
    const track = trackRef.current;
    if (!track) return;
    if (animate) {
      track.style.transition = 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(${px}px)`;
    offsetRef.current = px;

    // Update edge indicators
    setAtStart(px >= 0);
    setAtEnd(px <= -Math.max(0, (totalCards - visibleCount) * (cardWidth + 16)) + 1);
  }, [totalCards, visibleCount, cardWidth]);

  /* ── Arrow navigation ── */
  const goLeft = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const unit = cardWidth + 16;
    const newOffset = clamp(offsetRef.current + unit);
    applyOffset(newOffset, true);
  }, [cardWidth, clamp, applyOffset]);

  const goRight = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const unit = cardWidth + 16;
    const newOffset = clamp(offsetRef.current - unit);
    applyOffset(newOffset, true);
  }, [cardWidth, clamp, applyOffset]);

  /* ── Momentum animation loop ── */
  const runMomentum = useCallback(() => {
    const FRICTION = 0.92;       // velocity multiplier per frame
    const SNAP_THRESHOLD = 0.4;  // px/ms — below this, snap

    const step = () => {
      velocity.current *= FRICTION;

      if (Math.abs(velocity.current) < SNAP_THRESHOLD) {
        // Snap to nearest card
        const snapped = snapNearest(offsetRef.current);
        applyOffset(snapped, true);
        return;
      }

      const next = clamp(offsetRef.current + velocity.current * 16); // ~16ms per frame
      applyOffset(next, false);

      // Hit a wall — stop and snap
      if (next === offsetRef.current) {
        const snapped = snapNearest(next);
        applyOffset(snapped, true);
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [clamp, snapNearest, applyOffset]);

  /* ─── Pointer events (mouse + touch unified) ─── */
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only respond to primary button (left click / touch / stylus)
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      cancelAnimationFrame(rafRef.current);
      isPointerDown.current = true;
      isDraggingRef.current = false;

      pointerStartX.current = e.clientX;
      offsetAtDragStart.current = offsetRef.current;
      lastPointerX.current = e.clientX;
      lastPointerTime.current = performance.now();
      velocity.current = 0;

      // Capture pointer so we get move/up even outside element
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      // Disable CSS transition during drag
      if (trackRef.current) trackRef.current.style.transition = 'none';
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      // GUARD: ignore hover — only process when button is actually held
      if (!isPointerDown.current) return;

      const dx = e.clientX - pointerStartX.current;

      // Only engage drag after 6px threshold (prevents accidental micro-drags)
      if (!isDraggingRef.current && Math.abs(dx) < 6) return;
      isDraggingRef.current = true;
      setIsDragging(true);

      // Velocity: px/ms
      const now = performance.now();
      const dt = now - lastPointerTime.current;
      if (dt > 0) {
        // Exponential moving average for smooth velocity
        const instantV = (e.clientX - lastPointerX.current) / dt;
        velocity.current = velocity.current * 0.7 + instantV * 0.3;
      }
      lastPointerX.current = e.clientX;
      lastPointerTime.current = performance.now();

      // Rubber-band resistance at edges
      let raw = offsetAtDragStart.current + dx;
      const max = 0;
      const min = -Math.max(0, (totalCards - visibleCount) * (cardWidth + 16));
      if (raw > max) raw = max + (raw - max) * 0.25;
      if (raw < min) raw = min + (raw - min) * 0.25;

      applyOffset(raw, false);
    },
    [totalCards, visibleCount, cardWidth, applyOffset],
  );

  const onPointerUp = useCallback(() => {
    // Always clear pointer-down, even if no drag happened
    isPointerDown.current = false;

    if (!isDraggingRef.current) {
      setIsDragging(false);
      return;
    }

    isDraggingRef.current = false;

    // If fast swipe → momentum, else snap immediately
    if (Math.abs(velocity.current) > 0.3) {
      // Convert px/ms → px/frame (16ms)
      velocity.current = velocity.current * 16;
      runMomentum();
    } else {
      const snapped = snapNearest(offsetRef.current);
      applyOffset(snapped, true);
    }

    // Delay resetting isDragging so links don't fire
    setTimeout(() => setIsDragging(false), 80);
  }, [runMomentum, snapNearest, applyOffset]);

  return (
    <div className="relative">
      {/* Hidden SVG that defines the smooth bezier arch clip-path */}
      <ArchClipSVG />

      {/* Left arrow */}
      <button
        type="button"
        onClick={goLeft}
        aria-label="Previous"
        className="absolute -left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white/95 text-foreground shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary active:scale-95 focus:outline-none"
        style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? 'none' : 'auto' }}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right arrow */}
      <button
        type="button"
        onClick={goRight}
        aria-label="Next"
        className="absolute -right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white/95 text-foreground shadow-xl backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-primary hover:text-white hover:border-primary active:scale-95 focus:outline-none"
        style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? 'none' : 'auto' }}
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Viewport (clips the moving track) */}
      <div
        ref={viewportRef}
        className="overflow-hidden"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {/* Moving track */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex py-4 will-change-transform"
          style={{ gap: '16px', touchAction: 'pan-y' }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ width: `${cardWidth}px`, flexShrink: 0, minWidth: '220px' }}>
                  <SkeletonCard />
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id}
                  style={{ width: `${cardWidth}px`, flexShrink: 0, minWidth: '220px' }}
                >
                  <ArchCard item={cat} isDragging={isDragging} />
                </div>
              ))}
        </div>
      </div>

      {/* Dot indicators */}
      {!isLoading && totalCards > visibleCount && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: Math.ceil(totalCards / visibleCount) }).map((_, i) => {
            const active = Math.round(Math.abs(offsetRef.current) / ((cardWidth + 16) * visibleCount)) === i;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  cancelAnimationFrame(rafRef.current);
                  const newOffset = clamp(-i * visibleCount * (cardWidth + 16));
                  applyOffset(newOffset, true);
                }}
                className="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                style={{
                  width: active ? '32px' : '8px',
                  background: active ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
