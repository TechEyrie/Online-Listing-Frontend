'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { ListingForm } from '@/components/listings/listing-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listingApi } from '@/lib/listing-api';
import { useAuthStore } from '@/stores/auth-store';

export default function EditListingPage() {
  const params = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['listing-edit', params.id],
    queryFn: async () => {
      const res = await listingApi.getById(params.id);
      return res.data;
    },
    enabled: Boolean(params.id),
  });

  if (isLoading) return <p>Loading listing...</p>;
  if (isError || !data) return <p className="text-destructive">Listing not found</p>;

  const sellerId = typeof data.seller === 'object' ? data.seller._id : data.seller;
  if (user && sellerId !== user._id) {
    return <p className="text-destructive">You can only edit your own listings.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit listing</CardTitle>
        <CardDescription>Update details, attributes, or add more images.</CardDescription>
      </CardHeader>
      <CardContent>
        <ListingForm mode="edit" listing={data} />
      </CardContent>
    </Card>
  );
}
