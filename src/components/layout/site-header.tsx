'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  ChevronDown,
  ChevronRight,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';

import { BrandLogo } from '@/components/layout/brand-logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { NotificationBell } from '@/components/notifications/notification-bell';
import { authApi } from '@/lib/auth-api';
import { searchApi } from '@/lib/search-api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const QATAR_CITIES = [
  'Doha',
  'Lusail',
  'Al Rayyan',
  'Al Wakrah',
  'Al Khor',
  'Umm Salal',
  'Al Daayen',
  'Al Shamal',
  'Madinat ash Shamal',
];

const SEARCH_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'vehicles', name: 'Vehicles', slug: 'vehicles' },
  { id: 'property', name: 'Property', slug: 'property' },
  { id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'services', name: 'Services', slug: 'services' },
  { id: 'jobs', name: 'Jobs', slug: 'jobs' },
];

const SUB_NAV_LINKS = [
  { label: 'Vehicles', href: '/categories/vehicles' },
  { label: 'Property', href: '/categories/property' },
  { label: 'Electronics', href: '/categories/electronics' },
  { label: 'Featured', href: '/search?featured=true' },
  { label: 'Services', href: '/search?type=service' },
  { label: 'Help', href: '/dashboard' },
  { label: 'Browse all', href: '/search' },
  { label: 'Sell', href: '/post' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);

  // Search state
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(SEARCH_CATEGORIES[0]);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Navigation & Dropdown states
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Qatar');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'AR'>('EN');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMounted, setDrawerMounted] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawerMounted(true);
  }, []);

  const closeDrawerAndNavigate = (href: string) => {
    setDrawerOpen(false);
    startTransition(() => {
      router.push(href);
    });
  };

  // Load saved city
  useEffect(() => {
    try {
      const saved = localStorage.getItem('suqora_deliver_city');
      if (saved) setSelectedCity(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    try {
      localStorage.setItem('suqora_deliver_city', city);
    } catch {
      // ignore
    }
    setLocationModalOpen(false);
  };

  // Close menus on route change
  useEffect(() => {
    setCategoryDropdownOpen(false);
    setSuggestionsOpen(false);
    setAccountMenuOpen(false);
    setLangMenuOpen(false);
    setDrawerOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!searchBoxRef.current?.contains(target)) {
        setSuggestionsOpen(false);
        setCategoryDropdownOpen(false);
      }
      if (!accountRef.current?.contains(target)) {
        setAccountMenuOpen(false);
      }
      if (!langRef.current?.contains(target)) {
        setLangMenuOpen(false);
      }
      if (!locationRef.current?.contains(target)) {
        setLocationModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions search query
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      void searchApi
        .suggestions(query.trim())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSuggestionsOpen(false);
    const q = query.trim();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (selectedCategory.slug) params.set('category', selectedCategory.slug);

    startTransition(() => {
      router.push(params.toString() ? `/search?${params.toString()}` : '/search');
    });
  };

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

  const drawerNavLinkClass =
    'flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10';

  const renderDrawerLink = (href: string, children: ReactNode, className?: string) => (
    <Link
      href={href}
      className={cn(drawerNavLinkClass, className)}
      onClick={(e) => {
        e.preventDefault();
        closeDrawerAndNavigate(href);
      }}
    >
      {children}
    </Link>
  );

  const drawerMenu =
    drawerOpen && drawerMounted
      ? createPortal(
          <div className="fixed inset-0 z-[200]">
            <button
              type="button"
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            />
            <div
              className="relative z-10 flex h-full w-[360px] max-w-[85vw] flex-col bg-white text-gray-900 shadow-2xl animate-fade-in dark:bg-[#1a222d] dark:text-gray-100"
              role="dialog"
              aria-modal="true"
              aria-label="Main menu"
            >
              <div className="flex h-14 items-center justify-between bg-primary px-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-base font-bold">
                    {user ? `Hello, ${user.name}` : 'Hello, Sign In'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded p-1 text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-sm">
                <div>
                  <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Trending
                  </p>
                  <div className="mt-2 space-y-1">
                    {renderDrawerLink(
                      '/search?featured=true',
                      <>
                        <span>Featured Listings</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/search?sort=newest',
                      <>
                        <span>New Arrivals</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-white/10" />

                <div>
                  <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Shop by Category
                  </p>
                  <div className="mt-2 space-y-1">
                    {renderDrawerLink(
                      '/categories/vehicles',
                      <>
                        <span>Vehicles & Cars</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/categories/property',
                      <>
                        <span>Property & Apartments</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/categories/electronics',
                      <>
                        <span>Electronics & Mobiles</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/search?type=service',
                      <>
                        <span>Services</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/search',
                      <>
                        <span>See All Categories</span>
                        <ChevronRight className="h-4 w-4" />
                      </>,
                      'font-semibold text-primary',
                    )}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-white/10" />

                <div>
                  <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Programs & Features
                  </p>
                  <div className="mt-2 space-y-1">
                    {renderDrawerLink(
                      '/post',
                      <>
                        <span>Post a Free Ad</span>
                        <ChevronRight className="h-4 w-4" />
                      </>,
                      'font-semibold text-accent',
                    )}
                    {renderDrawerLink(
                      '/my-favorites',
                      <>
                        <span>Your Saved Items</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                    {renderDrawerLink(
                      '/messages',
                      <>
                        <span>Direct Messages</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </>,
                    )}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-white/10" />

                <div>
                  <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Help & Settings
                  </p>
                  <div className="mt-2 space-y-1">
                    <Link
                      href="/profile"
                      className="block rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        closeDrawerAndNavigate('/profile');
                      }}
                    >
                      Your Account
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        closeDrawerAndNavigate('/dashboard');
                      }}
                    >
                      Help
                    </Link>
                    {user ? (
                      <button
                        type="button"
                        onClick={() => {
                          setDrawerOpen(false);
                          void handleLogout();
                        }}
                        className="block w-full rounded px-2 py-2 text-left font-semibold text-destructive hover:bg-destructive/10"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="block rounded px-2 py-2 font-semibold text-primary hover:bg-gray-100 dark:hover:bg-white/10"
                        onClick={(e) => {
                          e.preventDefault();
                          closeDrawerAndNavigate('/login');
                        }}
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="sticky top-0 z-50 w-full select-none">
      <div className="relative z-30 border-b border-border bg-card px-2 py-1.5 text-foreground sm:px-4 sm:py-2">
        <div className="mx-auto flex max-w-[1536px] items-center gap-1 sm:gap-2 lg:gap-3">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <div className="cursor-pointer rounded-[2px] border border-transparent p-1 transition-colors duration-fast hover:border-border">
              <BrandLogo href="/" variant="header" size="md" priority />
            </div>
          </div>

          {/* Deliver to Location Selector */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationModalOpen((v) => !v)}
              className="flex items-center rounded-[2px] border border-transparent px-2 py-1.5 text-left transition-colors duration-fast hover:border-border"
              aria-label={`Deliver to ${selectedCity}`}
            >
              <MapPin className="mr-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="leading-tight">
                <span className="block text-[11px] font-normal leading-tight text-muted-foreground">
                  Deliver to
                </span>
                <span className="block text-[13px] font-bold leading-tight text-foreground">
                  {selectedCity}
                </span>
              </div>
            </button>

            {locationModalOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-2xl animate-fade-up">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Choose your location
                  </p>
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Select a municipality in Qatar to see local listings and delivery options:
                </p>
                <div className="mt-2.5 max-h-56 space-y-1 overflow-y-auto pr-1">
                  {QATAR_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => handleSelectCity(city)}
                      className={cn(
                        'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors',
                        selectedCity === city
                          ? 'bg-accent font-bold text-accent-foreground'
                          : 'text-foreground hover:bg-muted',
                      )}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={searchBoxRef} className="relative mx-1 flex flex-1 items-center">
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                'flex h-10 w-full items-center rounded-md border border-border bg-card transition-all',
                searchFocused
                  ? 'ring-3 ring-accent ring-offset-0 shadow-[0_0_8px_hsl(var(--accent)/0.7)]'
                  : 'hover:ring-1 hover:ring-border',
              )}
            >
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((v) => !v)}
                  className="flex h-10 items-center gap-1 rounded-l-md border-r border-border bg-muted px-2.5 text-[12px] font-medium text-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none"
                  aria-expanded={categoryDropdownOpen}
                >
                  <span className="max-w-[70px] truncate sm:max-w-[100px]">
                    {selectedCategory.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                {categoryDropdownOpen && (
                  <ul className="absolute left-0 top-full z-50 mt-1 max-h-64 w-44 overflow-y-auto rounded-md border border-border bg-popover py-1 text-xs text-popover-foreground shadow-xl">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          className={cn(
                            'w-full px-3 py-1.5 text-left transition-colors hover:bg-accent hover:text-accent-foreground',
                            selectedCategory.id === cat.id && 'bg-muted font-bold',
                          )}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCategoryDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => {
                  setSearchFocused(true);
                  if (suggestions.length > 0) setSuggestionsOpen(true);
                }}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search Suqora..."
                className="h-10 flex-1 bg-transparent px-3 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                aria-label="Search listings"
              />

              <button
                type="submit"
                className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-md bg-accent transition-colors duration-fast hover:bg-accent-hover active:bg-accent-hover"
                aria-label="Submit Search"
              >
                <Search className="h-5 w-5 text-accent-foreground" />
              </button>
            </form>

            {suggestionsOpen && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-border bg-popover shadow-xl animate-fade-up">
                {suggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                      onClick={() => {
                        setQuery(item);
                        setSuggestionsOpen(false);
                        const params = new URLSearchParams({ q: item });
                        if (selectedCategory.slug) params.set('category', selectedCategory.slug);
                        router.push(`/search?${params.toString()}`);
                      }}
                    >
                      <Search className="h-3.5 w-3.5 text-gray-400" />
                      <span>{item}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            {/* Language / Region */}
            <div className="relative hidden md:block" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1 rounded-[2px] border border-transparent px-2 py-1.5 transition-colors duration-fast hover:border-border"
                aria-expanded={langMenuOpen}
                aria-label="Language selector"
              >
                <span className="flex h-4 w-5 items-center justify-center rounded-[2px] bg-primary text-[9px] font-bold text-primary-foreground shadow-sm">
                  QA
                </span>
                <span className="text-[13px] font-bold text-foreground">{currentLang}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-gray-200 bg-white p-2 text-gray-900 shadow-xl animate-fade-up">
                  <p className="px-2 py-1 text-[11px] font-bold uppercase text-gray-500">
                    Language settings
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang('EN');
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors',
                      currentLang === 'EN'
                        ? 'bg-accent font-bold text-accent-foreground'
                        : 'hover:bg-gray-100',
                    )}
                  >
                    <span>English - EN</span>
                    {currentLang === 'EN' && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang('AR');
                      setLangMenuOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded px-2.5 py-1.5 text-xs transition-colors',
                      currentLang === 'AR'
                        ? 'bg-accent font-bold text-accent-foreground'
                        : 'hover:bg-gray-100',
                    )}
                  >
                    <span>العربية - AR</span>
                    {currentLang === 'AR' && <Check className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Account & Lists */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="flex items-center rounded-[2px] border border-transparent px-2 py-1.5 text-left transition-colors duration-fast hover:border-border"
                aria-expanded={accountMenuOpen}
              >
                <div className="leading-tight">
                  <span className="block truncate text-[11px] font-normal leading-tight text-muted-foreground">
                    {user ? `Hello, ${user.name}` : 'Hello, sign in'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span className="block text-[13px] font-bold leading-tight text-foreground">
                      Account & Lists
                    </span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </div>
                </div>
              </button>

              {/* Rich Flyout Menu */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-md border border-gray-200 bg-white p-3 text-gray-900 shadow-2xl animate-fade-up">
                  {!user ? (
                    <div className="border-b border-gray-200 pb-3 text-center">
                      <Link
                        href="/login"
                        className="block w-full rounded-[4px] bg-accent py-1.5 text-center text-xs font-bold text-accent-foreground shadow-sm transition hover:bg-accent-hover"
                      >
                        Sign in
                      </Link>
                      <p className="mt-2 text-[11px] text-gray-600">
                        New customer?{' '}
                        <Link href="/register" className="text-primary hover:underline">
                          Start here.
                        </Link>
                      </p>
                    </div>
                  ) : (
                    <div className="border-b border-gray-200 pb-2">
                      <p className="text-xs font-bold text-gray-900">{user.name}</p>
                      <p className="truncate text-[11px] text-gray-500">{user.email}</p>
                      <span className="mt-1 inline-block rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        {user.role}
                      </span>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                      Your Account
                    </p>
                    <div className="mt-1 space-y-0.5 text-xs">
                      <Link
                        href="/dashboard"
                        className="block rounded px-2 py-1.5 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        Your Dashboard
                      </Link>
                      <Link
                        href="/my-listings"
                        className="block rounded px-2 py-1.5 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        Your Listings
                      </Link>
                      <Link
                        href="/my-favorites"
                        className="block rounded px-2 py-1.5 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        Saved & Favorites
                      </Link>
                      <Link
                        href="/messages"
                        className="block rounded px-2 py-1.5 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        Messages
                      </Link>
                      <Link
                        href="/profile"
                        className="block rounded px-2 py-1.5 text-gray-700 transition hover:bg-gray-100 hover:text-black"
                      >
                        Account Settings
                      </Link>
                      {user && (user.role === 'admin' || user.role === 'moderator') && (
                        <Link
                          href="/admin"
                          className="block rounded px-2 py-1.5 font-semibold text-primary transition hover:bg-primary-soft"
                        >
                          Admin Console
                        </Link>
                      )}
                      {user && (
                        <button
                          type="button"
                          onClick={() => void handleLogout()}
                          className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-destructive transition hover:bg-destructive/10"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Post Ad CTA Pill */}
            <Link
              href="/post"
              className="hidden items-center gap-1 rounded-[3px] bg-accent px-2.5 py-1.5 text-[13px] font-bold text-accent-foreground transition hover:bg-accent-hover active:bg-accent-hover xl:flex"
            >
              <Plus className="h-3.5 w-3.5 stroke-[3]" />
              <span>Post Ad</span>
            </Link>

            {/* Theme & Notifications */}
            {user && (
              <div className="hidden items-center gap-1 md:flex">
                <NotificationBell />
              </div>
            )}
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-hover px-2 text-primary-foreground sm:px-4">
        <div className="mx-auto flex h-[39px] max-w-[1536px] items-center justify-between text-[14px]">
          {/* Left links */}
          <div className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            {/* "All" button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center rounded-[2px] border border-transparent px-2 py-1 font-bold text-primary-foreground transition-colors duration-fast hover:border-primary-foreground/40"
            >
              <Menu className="mr-1 h-5 w-5" />
              <span>All</span>
            </button>

            {/* Sub-nav items */}
            {SUB_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[2px] border border-transparent px-2.5 py-1 text-[13px] text-primary-foreground transition-colors duration-fast hover:border-primary-foreground/40"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right banner / highlight */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <Link
              href="/post"
              className="flex items-center gap-1.5 rounded-[2px] border border-transparent px-2 py-1 text-[13px] font-bold text-accent dark:text-amber-200 transition hover:border-primary-foreground/40"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Ad Posting in Qatar</span>
            </Link>
          </div>
        </div>
      </div>

    </header>
      {drawerMenu}
    </>
  );
}
