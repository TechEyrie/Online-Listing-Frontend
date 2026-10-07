'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CategoryBrowseCard } from '@/components/categories/category-browse-card';
import {
  STATIC_BROWSE_CATEGORIES,
  toBrowseItem,
  type CategoryBrowseItem,
} from '@/components/categories/category-browse-data';
import { useCategoryTree } from '@/hooks/use-categories';

const GAP = 14;
const EASE = 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';

function CategoryBrowseSkeleton() {
  return (
    <div
      className="w-full animate-pulse rounded-[1.75rem] bg-muted"
      style={{ aspectRatio: '3 / 5.1' }}
    />
  );
}

function visibleCardCount(width: number): number {
  if (width < 640) return 1.2;
  if (width < 900) return 2.15;
  if (width < 1200) return 2.9;
  return 3.55;
}

export function CategorySlider() {
  const { data: tree, isLoading } = useCategoryTree();

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isPointerDown = useRef(false);
  const rafRef = useRef(0);
  const pointerStartX = useRef(0);
  const offsetAtDragStart = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocity = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [cardWidth, setCardWidth] = useState(260);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [totalCards, setTotalCards] = useState(0);

  const categories: CategoryBrowseItem[] = tree?.length
    ? tree.map((c, i) => toBrowseItem(c, i))
    : STATIC_BROWSE_CATEGORIES;

  useEffect(() => {
    setTotalCards(categories.length);
  }, [categories.length]);

  const measureLayout = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const slides = visibleCardCount(window.innerWidth);
    const cw = (vp.clientWidth - GAP * Math.floor(slides)) / slides;
    setCardWidth(cw);
    setViewportWidth(vp.clientWidth);
  }, []);

  useLayoutEffect(() => {
    measureLayout();
    window.addEventListener('resize', measureLayout);
    return () => window.removeEventListener('resize', measureLayout);
  }, [measureLayout]);

  const maxOffset = useCallback(() => {
    if (!totalCards || !cardWidth || !viewportWidth) return 0;
    const trackWidth = totalCards * cardWidth + Math.max(0, totalCards - 1) * GAP;
    return Math.max(0, trackWidth - viewportWidth);
  }, [totalCards, cardWidth, viewportWidth]);

  const clamp = useCallback(
    (val: number) => Math.max(-maxOffset(), Math.min(0, val)),
    [maxOffset],
  );

  const snapNearest = useCallback(
    (rawOffset: number) => {
      const unit = cardWidth + GAP;
      if (unit <= 0) return rawOffset;
      return clamp(Math.round(rawOffset / unit) * unit);
    },
    [cardWidth, clamp],
  );

  const applyOffset = useCallback(
    (px: number, animate = false) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = animate ? EASE : 'none';
      track.style.transform = `translate3d(${px}px, 0, 0)`;
      offsetRef.current = px;
      setAtStart(px >= -1);
      setAtEnd(px <= -maxOffset() + 1);
    },
    [maxOffset],
  );

  const goLeft = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    applyOffset(clamp(offsetRef.current + (cardWidth + GAP)), true);
  }, [cardWidth, clamp, applyOffset]);

  const goRight = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    applyOffset(clamp(offsetRef.current - (cardWidth + GAP)), true);
  }, [cardWidth, clamp, applyOffset]);

  const runMomentum = useCallback(() => {
    const step = () => {
      velocity.current *= 0.93;
      if (Math.abs(velocity.current) < 0.35) {
        applyOffset(snapNearest(offsetRef.current), true);
        return;
      }
      const next = clamp(offsetRef.current + velocity.current * 16);
      applyOffset(next, false);
      if (next === offsetRef.current) {
        applyOffset(snapNearest(next), true);
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [clamp, snapNearest, applyOffset]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(rafRef.current);
    isPointerDown.current = true;
    isDraggingRef.current = false;
    pointerStartX.current = e.clientX;
    offsetAtDragStart.current = offsetRef.current;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    velocity.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (trackRef.current) trackRef.current.style.transition = 'none';
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown.current) return;
      const dx = e.clientX - pointerStartX.current;
      if (!isDraggingRef.current && Math.abs(dx) < 6) return;
      isDraggingRef.current = true;
      setIsDragging(true);

      const now = performance.now();
      const dt = now - lastPointerTime.current;
      if (dt > 0) {
        const instantV = (e.clientX - lastPointerX.current) / dt;
        velocity.current = velocity.current * 0.65 + instantV * 0.35;
      }
      lastPointerX.current = e.clientX;
      lastPointerTime.current = now;

      let raw = offsetAtDragStart.current + dx;
      const max = 0;
      const min = -maxOffset();
      if (raw > max) raw = max + (raw - max) * 0.22;
      if (raw < min) raw = min + (raw - min) * 0.22;
      applyOffset(raw, false);
    },
    [maxOffset, applyOffset],
  );

  const onPointerUp = useCallback(() => {
    isPointerDown.current = false;
    if (!isDraggingRef.current) {
      setIsDragging(false);
      return;
    }
    isDraggingRef.current = false;
    if (Math.abs(velocity.current) > 0.28) {
      velocity.current *= 16;
      runMomentum();
    } else {
      applyOffset(snapNearest(offsetRef.current), true);
    }
    setTimeout(() => setIsDragging(false), 80);
  }, [runMomentum, snapNearest, applyOffset]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={goLeft}
        aria-label="Previous categories"
        className="absolute -left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-black/5 bg-white text-[#111827] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-105 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:-left-4"
        style={{ opacity: atStart ? 0 : 1, pointerEvents: atStart ? 'none' : 'auto' }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={goRight}
        aria-label="Next categories"
        className="absolute -right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-black/5 bg-white text-[#111827] shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-200 hover:scale-105 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:-right-4"
        style={{ opacity: atEnd ? 0 : 1, pointerEvents: atEnd ? 'none' : 'auto' }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div
        ref={viewportRef}
        className="overflow-hidden"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="flex will-change-transform"
          style={{ gap: `${GAP}px`, touchAction: 'pan-y', paddingBlock: '6px' }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="shrink-0"
                  style={{ width: `${cardWidth}px`, minWidth: '240px' }}
                >
                  <CategoryBrowseSkeleton />
                </div>
              ))
            : categories.map((cat) => (
                <div
                  key={cat._id}
                  className="shrink-0"
                  style={{ width: `${cardWidth}px`, minWidth: '240px' }}
                >
                  <CategoryBrowseCard item={cat} isDragging={isDragging} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
