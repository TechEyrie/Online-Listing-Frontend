'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, useTransition } from 'react';
import { ArrowRight, ChevronDown, LayoutGrid, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { searchApi } from '@/lib/search-api';

const HERO_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'vehicles', name: 'Vehicles & Cars', slug: 'vehicles' },
  { id: 'property', name: 'Property & Rentals', slug: 'property' },
  { id: 'electronics', name: 'Electronics & Mobiles', slug: 'electronics' },
  { id: 'classifieds', name: 'Classifieds & Home', slug: 'classifieds' },
  { id: 'services', name: 'Services', slug: 'services' },
  { id: 'jobs', name: 'Jobs', slug: 'jobs' },
];

const HERO_CITIES = [
  'All Cities',
  'Doha',
  'Lusail',
  'Al Rayyan',
  'Al Wakrah',
  'Al Khor',
  'Umm Salal',
  'Al Daayen',
  'Al Shamal',
];

export function HeroBanner() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState(HERO_CATEGORIES[0]);
  const [selectedCity, setSelectedCity] = useState(HERO_CITIES[0]);
  const [catOpen, setCatOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [, startTransition] = useTransition();

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Suggestions search
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      void searchApi
        .suggestions(searchTerm.trim())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Outside click listener
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!catRef.current?.contains(target)) setCatOpen(false);
      if (!cityRef.current?.contains(target)) setCityOpen(false);
      if (!searchBoxRef.current?.contains(target)) setSuggestionsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSuggestionsOpen(false);
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (selectedCat.slug) params.set('category', selectedCat.slug);
    if (selectedCity && selectedCity !== 'All Cities') params.set('location', selectedCity);

    startTransition(() => {
      router.push(params.toString() ? `/search?${params.toString()}` : '/search');
    });
  };

  return (
    <section className="relative w-full px-4 pt-6 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        {/* Rounded Main Banner Card */}
        <div className="surface-hero relative overflow-hidden rounded-3xl bg-brand-subtle shadow-sm">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero-banner.jpg"
              alt="Buy, Sell, Find Jobs in Qatar"
              fill
              priority
              className="object-cover object-right sm:object-center"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
            {/* Smooth left gradient overlay to guarantee text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent sm:via-white/60 lg:w-3/5 dark:from-background/95 dark:via-background/80 dark:to-transparent sm:dark:via-background/55" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 flex min-h-[440px] flex-col justify-center px-6 py-16 sm:min-h-[520px] sm:px-14 lg:min-h-[580px] lg:px-20">
            <div className="max-w-xl">
              {/* Heading */}
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[50px] lg:leading-[1.18]">
                <span className="text-primary dark:text-foreground">Buy</span>{' '}
                <span className="font-light text-muted-foreground">|</span>{' '}
                <span className="text-primary dark:text-foreground">Sell</span>{' '}
                <span className="font-light text-muted-foreground">|</span>{' '}
                <span className="text-primary dark:text-foreground">Find Jobs</span>
                <br />
                <span className="text-foreground">All in one Place.</span>
              </h1>

              {/* Subheading */}
              <p className="mt-4 text-lg font-medium text-muted-foreground sm:text-xl">
                Post your ad <span className="font-bold text-accent">FREE</span>
                <br />
                <span className="text-base text-primary sm:text-lg dark:text-foreground/90">
                  fast, easy, no cost.
                </span>
              </p>

              {/* CTA Button */}
              <div className="mt-7">
                <Link
                  href="/post"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-md transition-all duration-200 hover:bg-accent-hover hover:shadow-lg active:scale-[0.98] active:bg-accent-hover"
                >
                  <span>Post Free Ad</span>
                  <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating 3-Part Search Bar overlapping the bottom of the banner */}
        <div className="relative -mt-8 z-20 px-3 sm:px-6">
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-5xl flex-col items-center rounded-2xl border border-border/90 bg-card p-2 shadow-xl md:flex-row md:rounded-full md:p-2"
          >
            {/* 1. Keyword search input with prompt icon */}
            <div ref={searchBoxRef} className="relative flex w-full flex-1 items-center px-3 py-2">
              <Search className="mr-3 h-5 w-5 shrink-0 text-accent" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSuggestionsOpen(true);
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setSuggestionsOpen(true);
                }}
                placeholder="Search for anything you need..."
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                }}
                className="hero-search-input w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
              />

              {/* Suggestions flyout */}
              {suggestionsOpen && suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-2xl animate-fade-up">
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-foreground transition hover:bg-accent-soft hover:text-foreground"
                        onClick={() => {
                          setSearchTerm(item);
                          setSuggestionsOpen(false);
                          const params = new URLSearchParams({ q: item });
                          if (selectedCat.slug) params.set('category', selectedCat.slug);
                          if (selectedCity && selectedCity !== 'All Cities')
                            params.set('location', selectedCity);
                          router.push(`/search?${params.toString()}`);
                        }}
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{item}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-[1px] bg-border md:block" />

            {/* 2. All Categories Dropdown */}
            <div ref={catRef} className="relative w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setCatOpen((v) => !v);
                  setCityOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground md:w-48"
              >
                <div className="flex items-center gap-2 truncate">
                  <LayoutGrid className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate font-medium">{selectedCat.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {catOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-56 overflow-y-auto rounded-xl border border-border bg-card py-1.5 shadow-2xl animate-fade-up">
                  {HERO_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCat(cat);
                        setCatOpen(false);
                      }}
                      className={cn(
                        'flex w-full px-4 py-2 text-left text-xs font-medium transition hover:bg-accent-soft hover:text-foreground',
                        selectedCat.id === cat.id
                          ? 'bg-accent font-bold text-accent-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-[1px] bg-border md:block" />

            {/* 3. All Cities / Locations Dropdown */}
            <div ref={cityRef} className="relative w-full md:w-auto">
              <button
                type="button"
                onClick={() => {
                  setCityOpen((v) => !v);
                  setCatOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-muted-foreground hover:text-foreground md:w-44"
              >
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate font-medium">{selectedCity}</span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>

              {cityOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 max-h-60 w-52 overflow-y-auto rounded-xl border border-border bg-card py-1.5 shadow-2xl animate-fade-up">
                  {HERO_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        setSelectedCity(city);
                        setCityOpen(false);
                      }}
                      className={cn(
                        'flex w-full px-4 py-2 text-left text-xs font-medium transition hover:bg-accent-soft hover:text-foreground',
                        selectedCity === city
                          ? 'bg-accent font-bold text-accent-foreground'
                          : 'text-foreground',
                      )}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Search submit */}
            <div className="w-full shrink-0 p-1 md:w-auto">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:bg-accent-hover active:bg-accent-hover md:rounded-full"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
