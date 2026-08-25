import Link from 'next/link';

import { BrandLogo } from '@/components/layout/brand-logo';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/80 bg-card/60">
      <div className="mx-auto grid max-w-app gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="max-w-md space-y-4">
          <BrandLogo size="lg" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Qatar-first marketplace to buy, sell, rent, and offer services — clear listings, trusted
            sellers, worldwide reach.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Explore</p>
            <Link href="/search" className="block text-sm text-muted-foreground hover:text-primary">
              Browse listings
            </Link>
            <Link href="/post" className="block text-sm text-muted-foreground hover:text-primary">
              Post a listing
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Account</p>
            <Link href="/login" className="block text-sm text-muted-foreground hover:text-primary">
              Sign in
            </Link>
            <Link href="/register" className="block text-sm text-muted-foreground hover:text-primary">
              Create account
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Trust</p>
            <p className="text-sm text-muted-foreground">Moderated listings</p>
            <p className="text-sm text-muted-foreground">Secure promotions</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Suqora. Built for local commerce.
      </div>
    </footer>
  );
}
