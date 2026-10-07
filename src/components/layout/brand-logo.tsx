'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface BrandLogoProps {
  href?: string | null;
  className?: string;
  /** Image height in pixels (CSS). */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** `header` is denser for the nav bar. */
  variant?: 'default' | 'header';
  priority?: boolean;
  forceDark?: boolean;
}

/** Transparent cropped mark — icon + wordmark only (no black plate). */
const MARK = {
  light: { src: '/suqora-mark.png', width: 650, height: 192 },
  dark: { src: '/suqora-mark-dark.png', width: 650, height: 192 },
} as const;

const sizeClass: Record<'default' | 'header', Record<NonNullable<BrandLogoProps['size']>, string>> = {
  default: {
    sm: 'h-10 sm:h-11',
    md: 'h-11 sm:h-12',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20 lg:h-24',
  },
  header: {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-10',
    lg: 'h-9 sm:h-10 lg:h-11',
    xl: 'h-10 sm:h-11',
  },
};

export function BrandLogo({
  href = '/',
  className,
  size = 'md',
  variant = 'default',
  priority = false,
  forceDark = false,
}: BrandLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const useDark = forceDark || (mounted && resolvedTheme === 'dark');
  const asset = useDark ? MARK.dark : MARK.light;

  const image = (
    <Image
      src={asset.src}
      alt="Suqora"
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes={
        variant === 'header'
          ? '(max-width: 640px) 180px, 240px'
          : '(max-width: 640px) 220px, (max-width: 1024px) 320px, 400px'
      }
      className={cn('w-auto max-w-none object-contain', sizeClass[variant][size])}
    />
  );

  if (href === null) {
    return <span className={cn('inline-flex items-center', className)}>{image}</span>;
  }

  return (
    <Link
      href={href}
      className={cn('inline-flex shrink-0 items-center focus-visible:outline-none', className)}
      aria-label="Suqora home"
    >
      {image}
    </Link>
  );
}
