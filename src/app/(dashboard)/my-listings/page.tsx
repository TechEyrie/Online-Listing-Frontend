'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ListingCard } from '@/components/listings/listing-card';
import { Button } from '@/components/ui/button';
import { listingApi } from '@/lib/listing-api';
import type { ApiErrorResponse } from '@/types/api';
import type { ListingStatus } from '@/types/listing';

const STATUS_FILTERS: Array<ListingStatus | 'all'> = [
  'all',
  'active',
  'sold',
  'hidden',
  'pending',
  'expired',
];

export default function MyListingsPage() {
  const [status, setStatus] = useState<ListingStatus | 'all'>('all');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-listings', status],
    queryFn: async () => {
      const res = await listingApi.getMy({
        status: status === 'all' ? undefined : status,
        limit: 50,
      });
      return res;
    },
  });

  const soldMutation = useMutation({
    mutationFn: (id: string) => listingApi.markSold(id),
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not mark as sold');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => listingApi.remove(id),
    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not delete listing');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-page-title">My listings</h1>
          <p className="text-sm text-muted-foreground">
            {data?.meta?.total ?? 0} listing{(data?.meta?.total ?? 0) === 1 ? '' : 's'}
          </p>
        </div>
        <Button asChild>
          <Link href="/post">Post new</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((item) => (
          <Button
            key={item}
            type="button"
            size="sm"
            variant={status === item ? 'default' : 'outline'}
            onClick={() => setStatus(item)}
          >
            {item}
          </Button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {isLoading && <p className="text-sm">Loading...</p>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((listing) => (
          <div key={listing._id} className="space-y-2">
            <ListingCard listing={listing} showStatus />
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/edit-listing/${listing._id}`}>Edit</Link>
              </Button>
              {listing.status === 'active' && (
                <Button asChild size="sm">
                  <Link href={`/promote/${listing._id}`}>Promote</Link>
                </Button>
              )}
              {listing.status === 'active' && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={soldMutation.isPending}
                  onClick={() => soldMutation.mutate(listing._id)}
                >
                  Mark sold
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (window.confirm('Delete this listing?')) {
                    deleteMutation.mutate(listing._id);
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && data?.data?.length === 0 && (
        <p className="text-sm text-muted-foreground">No listings yet. Post your first ad.</p>
      )}
    </div>
  );
}
