import type { Metadata } from 'next';

import { ListingDetailClient } from '@/components/listings/listing-detail-client';
import { getServerApiBase } from '@/lib/api-base';
import type { Listing } from '@/types/listing';

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

const apiBase = getServerApiBase();
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function fetchListing(slug: string): Promise<Listing | null> {
  try {
    const res = await fetch(`${apiBase}/listings/${slug}?track=0`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Listing };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await fetchListing(slug);

  if (!listing) {
    return {
      title: 'Listing not found',
      robots: { index: false, follow: false },
    };
  }

  const description = listing.description.slice(0, 160);
  const images = (listing.images || []).slice(0, 3).map((img) => ({
    url: img.url,
  }));

  return {
    title: listing.title,
    description,
    alternates: { canonical: `${appUrl}/listings/${slug}` },
    openGraph: {
      title: listing.title,
      description,
      url: `${appUrl}/listings/${slug}`,
      images: images.length > 0 ? images : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description,
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const initialListing = await fetchListing(slug);
  return <ListingDetailClient slug={slug} initialListing={initialListing} />;
}
