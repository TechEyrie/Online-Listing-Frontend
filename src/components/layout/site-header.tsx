'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
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
  { label: 'Today’s Deals', href: '/search?featured=true' },
  { label: 'Services', href: '/search?type=service' },
  { label: 'Customer Service', href: '/dashboard' },
  { label: 'Registry', href: '/search' },
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="sticky top-0 z-50 w-full select-none text-white">
      {/* 1. MAIN TOP BAR (Amazon Dark Charcoal #131921) */}
      <div className="relative z-30 bg-[#131921] px-2 py-1.5 sm:px-4 sm:py-2">
        <div className="mx-auto flex max-w-[1536px] items-center gap-1 sm:gap-2 lg:gap-3">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <div className="cursor-pointer rounded-[2px] border border-transparent p-1 transition-colors duration-fast hover:border-white">
              <BrandLogo href="/" variant="header" size="md" priority forceDark />
            </div>
          </div>

          {/* Deliver to Location Selector */}
          <div className="relative hidden md:block" ref={locationRef}>
            <button
              type="button"
              onClick={() => setLocationModalOpen((v) => !v)}
              className="flex items-center rounded-[2px] border border-transparent px-2 py-1.5 text-left transition-colors duration-fast hover:border-white"
              aria-label={`Deliver to ${selectedCity}`}
            >
              <MapPin className="mr-1 h-4 w-4 shrink-0 text-white" aria-hidden />
              <div className="leading-tight">
                <span className="block text-[11px] font-normal leading-tight text-[#cccccc]">
                  Deliver to
                </span>
                <span className="block text-[13px] font-bold leading-tight text-white">
                  {selectedCity}
                </span>
              </div>
            </button>

            {/* Location selector dropdown / modal */}
            {locationModalOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-lg border border-[#333] bg-[#1a222d] p-3 text-white shadow-2xl animate-fade-up">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#febd69]">
                    Choose your location
                  </p>
                  <button
                    type="button"
                    onClick={() => setLocationModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-[12px] text-gray-300">
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
                          ? 'bg-[#febd69] font-bold text-[#131921]'
                          : 'text-gray-200 hover:bg-white/10',
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

          {/* Central Search Bar (Amazon 3-part layout) */}
          <div ref={searchBoxRef} className="relative mx-1 flex flex-1 items-center">
            <form
              onSubmit={handleSearchSubmit}
              className={cn(
                'flex h-10 w-full items-center rounded-[4px] bg-white transition-all',
                searchFocused
                  ? 'ring-3 ring-[#febd69] ring-offset-0 shadow-[0_0_8px_rgba(254,189,105,0.7)]'
                  : 'hover:ring-1 hover:ring-white/40',
              )}
            >
              {/* Category pill on left */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen((v) => !v)}
                  className="flex h-10 items-center gap-1 rounded-l-[4px] border-r border-[#cdcdcd] bg-[#e6e6e6] px-2.5 text-[12px] font-medium text-[#333333] transition-colors hover:bg-[#d8d8d8] focus-visible:outline-none"
                  aria-expanded={categoryDropdownOpen}
                >
                  <span className="max-w-[70px] truncate sm:max-w-[100px]">
                    {selectedCategory.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[#555]" />
                </button>

                {/* Categories menu */}
                {categoryDropdownOpen && (
                  <ul className="absolute left-0 top-full z-50 mt-1 max-h-64 w-44 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 text-xs text-gray-800 shadow-xl">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type="button"
                          className={cn(
                            'w-full px-3 py-1.5 text-left transition-colors hover:bg-[#febd69] hover:text-[#131921]',
                            selectedCategory.id === cat.id && 'font-bold bg-gray-100',
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

              {/* Main input */}
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
                className="h-10 flex-1 bg-transparent px-3 text-[14px] text-[#111111] placeholder:text-[#555555] focus:outline-none"
                aria-label="Search listings"
              />

              {/* Amber Search Submit Button */}
              <button
                type="submit"
                className="flex h-10 w-11 shrink-0 items-center justify-center rounded-r-[4px] bg-[#febd69] transition-colors duration-fast hover:bg-[#f3a847] active:bg-[#e77600]"
                aria-label="Submit Search"
              >
                <Search className="h-5 w-5 text-[#131921]" />
              </button>
            </form>

            {/* Suggestions flyout */}
            {suggestionsOpen && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl animate-fade-up">
                {suggestions.map((item) => (
                  <li key={item}>
                    <button
                      type="button"
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm text-[#111111] transition-colors hover:bg-gray-100"
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
                className="flex items-center gap-1 rounded-[2px] border border-transparent px-2 py-1.5 transition-colors duration-fast hover:border-white"
                aria-expanded={langMenuOpen}
                aria-label="Language selector"
              >
                <span className="flex h-4 w-5 items-center justify-center rounded-[2px] bg-[#8A1538] text-[9px] font-bold text-white shadow-sm">
                  QA
                </span>
                <span className="text-[13px] font-bold text-white">{currentLang}</span>
                <ChevronDown className="h-3 w-3 text-[#a7acb2]" />
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
                        ? 'bg-[#febd69] font-bold text-[#131921]'
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
                        ? 'bg-[#febd69] font-bold text-[#131921]'
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
                className="flex items-center rounded-[2px] border border-transparent px-2 py-1.5 text-left transition-colors duration-fast hover:border-white"
                aria-expanded={accountMenuOpen}
              >
                <div className="leading-tight">
                  <span className="block truncate text-[11px] font-normal leading-tight text-[#cccccc]">
                    {user ? `Hello, ${user.name}` : 'Hello, sign in'}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <span className="block text-[13px] font-bold leading-tight text-white">
                      Account & Lists
                    </span>
                    <ChevronDown className="h-3 w-3 text-[#a7acb2]" />
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
                        className="block w-full rounded-[4px] bg-[#febd69] py-1.5 text-center text-xs font-bold text-[#131921] shadow-sm transition hover:bg-[#f3a847]"
                      >
                        Sign in
                      </Link>
                      <p className="mt-2 text-[11px] text-gray-600">
                        New customer?{' '}
                        <Link href="/register" className="text-[#007185] hover:underline">
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

            {/* Returns & Orders (Links to My Listings / Dashboard) */}
            <Link
              href={user ? '/my-listings' : '/login'}
              className="hidden rounded-[2px] border border-transparent px-2 py-1.5 leading-tight transition-colors duration-fast hover:border-white sm:block"
            >
              <span className="block text-[11px] font-normal leading-tight text-[#cccccc]">
                Returns
              </span>
              <span className="block text-[13px] font-bold leading-tight text-white">
                & Orders
              </span>
            </Link>


            {/* Post Ad CTA Pill */}
            <Link
              href="/post"
              className="hidden items-center gap-1 rounded-[3px] bg-[#febd69] px-2.5 py-1.5 text-[13px] font-bold text-[#131921] transition hover:bg-[#f3a847] active:bg-[#e77600] xl:flex"
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

      {/* 2. SECONDARY SUB-NAVIGATION BAR (Amazon Dark Slate #232f3e) */}
      <div className="bg-[#232f3e] px-2 text-white sm:px-4">
        <div className="mx-auto flex h-[39px] max-w-[1536px] items-center justify-between text-[14px]">
          {/* Left links */}
          <div className="flex items-center space-x-1 overflow-x-auto whitespace-nowrap scrollbar-none">
            {/* "All" button */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center rounded-[2px] border border-transparent px-2 py-1 font-bold text-white transition-colors duration-fast hover:border-white"
            >
              <Menu className="mr-1 h-5 w-5" />
              <span>All</span>
            </button>

            {/* Sub-nav items */}
            {SUB_NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[2px] border border-transparent px-2.5 py-1 text-[13px] text-white transition-colors duration-fast hover:border-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right banner / highlight */}
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <Link
              href="/post"
              className="flex items-center gap-1.5 rounded-[2px] border border-transparent px-2 py-1 text-[13px] font-bold text-[#febd69] transition hover:border-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Free Ad Posting in Qatar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. AUTHENTIC AMAZON SIDE DRAWER ("All" Menu) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Slide-in panel */}
          <div className="relative z-10 flex h-full w-[360px] max-w-[85vw] flex-col bg-white text-gray-900 shadow-2xl animate-fade-in dark:bg-[#1a222d] dark:text-gray-100">
            {/* Header */}
            <div className="flex h-14 items-center justify-between bg-[#232f3e] px-6 text-white">
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

            {/* Scrollable drawer body */}
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4 text-sm">
              {/* Section: Trending */}
              <div>
                <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Trending
                </p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/search?featured=true"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Featured Listings</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/search?sort=newest"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>New Arrivals</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-white/10" />

              {/* Section: Shop By Category */}
              <div>
                <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Shop by Category
                </p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/categories/vehicles"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Vehicles & Cars</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/categories/property"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Property & Apartments</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/categories/electronics"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Electronics & Mobiles</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/search?type=service"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Services</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/search"
                    className="flex items-center justify-between rounded px-2 py-2 font-semibold text-[#007185] hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>See All Categories</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-white/10" />

              {/* Section: Programs & Features */}
              <div>
                <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Programs & Features
                </p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/post"
                    className="flex items-center justify-between rounded px-2 py-2 font-semibold text-[#f08804] hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Post a Free Ad</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/my-favorites"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Your Saved Items</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center justify-between rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <span>Direct Messages</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-white/10" />

              {/* Section: Help & Settings */}
              <div>
                <p className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Help & Settings
                </p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/profile"
                    className="block rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    Your Account
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block rounded px-2 py-2 hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    Customer Service
                  </Link>
                  {user ? (
                    <button
                      type="button"
                      onClick={() => void handleLogout()}
                      className="block w-full rounded px-2 py-2 text-left font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block rounded px-2 py-2 font-semibold text-[#007185] hover:bg-gray-100 dark:hover:bg-white/10"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
