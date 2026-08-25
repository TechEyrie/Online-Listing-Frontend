import { Heart } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

export default function MyFavoritesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Saved listings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Favorites will appear here once save-to-favorites is enabled for your account.
        </p>
      </div>
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="No saved listings yet"
        description="Browse the marketplace and keep an eye out for listings you love. You can manage your own ads from My listings."
        actionLabel="Browse listings"
        actionHref="/search"
      />
    </div>
  );
}
