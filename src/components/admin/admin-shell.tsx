'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { BrandLogo } from '@/components/layout/brand-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const NAV = [
  { href: '/admin', label: 'Overview', roles: ['admin'] },
  { href: '/admin/users', label: 'Users', roles: ['admin'] },
  { href: '/admin/listings', label: 'Listings', roles: ['admin', 'moderator'] },
  { href: '/admin/reports', label: 'Reports', roles: ['admin', 'moderator'] },
  { href: '/admin/reviews', label: 'Reviews', roles: ['admin'] },
  { href: '/admin/categories', label: 'Categories', roles: ['admin'] },
  { href: '/admin/transactions', label: 'Revenue', roles: ['admin'] },
  { href: '/admin/assistant', label: 'Assistant', roles: ['admin'] },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }
    if (user.role !== 'admin' && user.role !== 'moderator') {
      router.replace('/');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-sm text-muted-foreground">
        Checking admin access...
      </div>
    );
  }

  const links = NAV.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-app flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <BrandLogo href="/" size="md" />
            <Link href="/admin" className="font-display text-lg font-bold tracking-tight text-foreground">
              Admin
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[10px] px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                    pathname === item.href && 'bg-primary-soft font-semibold text-primary',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="text-sm font-medium text-muted-foreground">
              {user.name} · {user.role}
            </span>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Site</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-app px-4 py-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
