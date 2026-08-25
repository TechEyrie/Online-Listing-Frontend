'use client';

import { ListingForm } from '@/components/listings/listing-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PostListingPage() {
  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <p className="page-eyebrow">Create</p>
        <CardTitle className="mt-1 text-2xl">Post a listing</CardTitle>
        <CardDescription>Add details, category attributes, and up to 10 images.</CardDescription>
      </CardHeader>
      <CardContent>
        <ListingForm mode="create" />
      </CardContent>
    </Card>
  );
}
