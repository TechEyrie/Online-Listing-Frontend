import { ListingCard } from '@/components/listings/listing-card';
import type { Listing } from '@/types/listing';

interface ListingGridProps {
  listings: Listing[];
  columns?: '3' | '4';
}

export function ListingGrid({ listings, columns = '3' }: ListingGridProps) {
  return (
    <div
      className={
        columns === '4'
          ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
      }
    >
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div>
  );
}
