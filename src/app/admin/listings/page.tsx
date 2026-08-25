'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/admin-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

const STATUSES = ['active', 'pending', 'expired', 'sold', 'hidden'] as const;

export default function AdminListingsPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['admin-listings', search, status],
    queryFn: () =>
      adminApi.getListings({
        page: 1,
        limit: 50,
        search: search || undefined,
        status: status || undefined,
      }),
  });

  const mutate = useMutation({
    mutationFn: async ({
      id,
      action,
      nextStatus,
    }: {
      id: string;
      action: 'status' | 'feature' | 'delete';
      nextStatus?: string;
    }) => {
      if (action === 'status' && nextStatus) return adminApi.updateListingStatus(id, nextStatus);
      if (action === 'feature') return adminApi.featureListing(id, 7);
      return adminApi.deleteListing(id);
    },
    onSuccess: async (_data, vars) => {
      setMessage(`Listing ${vars.action} updated`);
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Action failed');
      setMessage(null);
    },
  });

  const listings = query.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-page-title">Listings</h1>
        <p className="text-sm text-muted-foreground">Moderate status, feature, or hide listings</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {query.isLoading && <p className="text-sm">Loading listings...</p>}

      <div className="overflow-x-auto rounded-lg border bg-background">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Seller</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Featured</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing._id} className="border-b align-top">
                <td className="px-3 py-2">
                  <Link href={`/listings/${listing.slug}`} className="font-medium underline">
                    {listing.title}
                  </Link>
                </td>
                <td className="px-3 py-2">{listing.seller?.name ?? '—'}</td>
                <td className="px-3 py-2 capitalize">{listing.status}</td>
                <td className="px-3 py-2">{listing.isFeatured ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <select
                      key={`${listing._id}-${listing.status}`}
                      className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      defaultValue={listing.status}
                      onChange={(e) =>
                        mutate.mutate({
                          id: listing._id,
                          action: 'status',
                          nextStatus: e.target.value,
                        })
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {isAdmin && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={mutate.isPending}
                          onClick={() => mutate.mutate({ id: listing._id, action: 'feature' })}
                        >
                          Feature 7d
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          disabled={mutate.isPending}
                          onClick={() => mutate.mutate({ id: listing._id, action: 'delete' })}
                        >
                          Hide
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
