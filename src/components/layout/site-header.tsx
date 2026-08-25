'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  UserRound,
  X,
} from 'lucide-react';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { BrandLogo } from '@/components/layout/brand-logo';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { SearchBar } from '@/components/search/search-bar';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/auth-api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const browseLinks = [
  { href: '/search', label: 'All listings' },
  { href: '/categories/vehicles', label: 'Vehicles' },
  { href: '/categories/property', label: 'Property' },
  { href: '/categories/electronics', label: 'Electronics' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const browseRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setBrowseOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!browseRef.current?.contains(event.target as Node)) setBrowseOpen(false);
      if (!accountRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

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
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border/70 bg-card/85 text-foreground backdrop-blur-md transition-shadow duration-normal dark:text-white',
        scrolled && 'shadow-soft',
      )}
    >
      <div className="grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8 xl:px-10">
        {/* Left — logo + browse */}
        <div className="flex min-w-0 items-center gap-2 justify-self-start lg:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden dark:text-white dark:hover:text-white"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <BrandLogo variant="header" size="lg" priority />

          <div className="relative hidden shrink-0 lg:block" ref={browseRef}>
            <Button
              type="button"
              variant="ghost"
              className="gap-1 font-semibold dark:text-white dark:hover:text-white"
              aria-expanded={browseOpen}
              onClick={() => setBrowseOpen((v) => !v)}
            >
              Browse
              <ChevronDown className="h-4 w-4" />
            </Button>
            {browseOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-elevated animate-fade-up">
                {browseLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-[10px] px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary-soft hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Middle — compact search, centered */}
        <div className="hidden w-[min(100vw-24rem,22rem)] justify-self-center md:block lg:w-[24rem]">
          <SearchBar />
        </div>

        {/* Right — actions */}
        <div className="flex items-center justify-end gap-1 justify-self-end sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden dark:text-white dark:hover:text-white"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {user && (
            <>
              <Button
                asChild
                variant="ghost"
                size="icon"
                aria-label="Messages"
                className="dark:text-white dark:hover:text-white"
              >
                <Link href="/messages">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <NotificationBell />
            </>
          )}

          <Button asChild className="hidden sm:inline-flex" size="sm" variant="accent">
            <Link href="/post">Post listing</Link>
          </Button>

          {user ? (
            <div className="relative" ref={accountRef}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 dark:border-white/25 dark:bg-transparent dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((v) => !v)}
              >
                <UserRound className="h-4 w-4" />
                <span className="hidden max-w-[7rem] truncate lg:inline">{user.name}</span>
              </Button>
              {accountOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-card p-1.5 shadow-elevated animate-fade-up">
                  {[
                    { href: '/dashboard', label: 'Dashboard' },
                    { href: '/my-listings', label: 'My listings' },
                    { href: '/profile', label: 'Profile' },
                    { href: '/settings', label: 'Settings' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-[10px] px-3 py-2 text-sm font-medium hover:bg-primary-soft hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                  {(user.role === 'admin' || user.role === 'moderator') && (
                    <Link
                      href="/admin"
                      className="block rounded-[10px] px-3 py-2 text-sm font-medium hover:bg-primary-soft hover:text-primary"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                    onClick={() => void handleLogout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex dark:text-white dark:hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Join</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card/90 px-4 py-3 md:hidden">
          <SearchBar autoFocus />
        </div>
      )}

      {mobileOpen && (
        <nav className="border-t border-border bg-card/95 px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {browseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[10px] px-3 py-2.5 text-sm font-semibold dark:text-white hover:bg-primary-soft hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/post"
              className="rounded-[10px] px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent-soft"
            >
              Post listing
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
