'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Home, PlusCircle, Search, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/post', label: 'Post', icon: PlusCircle, emphasize: true },
  { href: '/my-favorites', label: 'Saved', icon: Heart, auth: true },
  { href: '/dashboard', label: 'Account', icon: UserRound, auth: true },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {items.map((item) => {
          const href =
            'auth' in item && item.auth && !user
              ? `/login?redirect=${encodeURIComponent(item.href)}`
              : item.href;
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const emphasize = 'emphasize' in item && item.emphasize;

          return (
            <li key={item.href}>
              <Link
                href={href}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-[11px] font-semibold transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  emphasize && !active && 'text-accent',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-[10px]',
                    emphasize && 'bg-accent-soft text-accent',
                    active && !emphasize && 'bg-primary-soft',
                  )}
                >
                  <Icon className={cn('h-5 w-5', emphasize && 'h-5 w-5')} strokeWidth={active ? 2.25 : 1.85} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
