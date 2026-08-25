'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { BrandLogo } from '@/components/layout/brand-logo';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/messages', label: 'Messages' },
  { href: '/my-listings', label: 'My listings' },
  { href: '/my-favorites', label: 'Saved' },
  { href: '/dashboard/transactions', label: 'Transactions' },
  { href: '/post', label: 'Post' },
  { href: '/profile', label: 'Profile' },
  { href: '/settings', label: 'Settings' },
];

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      logoutStore();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-app items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <BrandLogo size="md" />
            <nav className="hidden gap-1 text-sm lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-[10px] px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
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
            <NotificationBell />
            <span className="hidden max-w-[8rem] truncate text-sm font-medium text-muted-foreground xl:inline">
              {user?.name}
            </span>
            <Button type="button" variant="outline" size="sm" onClick={() => void handleLogout()}>
              Log out
            </Button>
          </div>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto border-t border-border px-4 py-2.5 lg:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'shrink-0 rounded-[10px] px-3 py-1.5 text-xs font-semibold text-muted-foreground',
                pathname === item.href && 'bg-primary-soft text-primary',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-app px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
