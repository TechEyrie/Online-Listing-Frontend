'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchApi } from '@/lib/search-api';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  initialQuery?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ initialQuery = '', className, autoFocus }: SearchBarProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      void searchApi
        .suggestions(q.trim())
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const goSearch = (term: string) => {
    const query = term.trim();
    setOpen(false);
    startTransition(() => {
      router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
    });
  };

  return (
    <div ref={boxRef} className={cn('relative w-full', className)}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          goSearch(q);
        }}
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={q}
            autoFocus={autoFocus}
            placeholder="Search cars, phones, apartments..."
            className="pl-10"
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            aria-label="Search listings"
            aria-autocomplete="list"
            aria-expanded={open && suggestions.length > 0}
          />
        </div>
        <Button type="submit" className="shrink-0" variant="default">
          Search
        </Button>
      </form>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-elevated animate-fade-up">
          {suggestions.map((item) => (
            <li key={item}>
              <button
                type="button"
                className="w-full px-3.5 py-2.5 text-left text-sm font-medium transition-colors hover:bg-primary-soft hover:text-primary"
                onClick={() => {
                  setQ(item);
                  goSearch(item);
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
