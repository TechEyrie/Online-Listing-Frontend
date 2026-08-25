import type { MetadataRoute } from 'next';

import { getServerApiBase } from '@/lib/api-base';

const apiBase = getServerApiBase();
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    {
      url: `${appUrl}/listings`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const [listingsRes, categoriesRes] = await Promise.all([
      fetch(`${apiBase}/listings/sitemap`, { next: { revalidate: 3600 } }),
      fetch(`${apiBase}/categories`, { next: { revalidate: 3600 } }),
    ]);

    const listingsJson = listingsRes.ok
      ? ((await listingsRes.json()) as ApiEnvelope<Array<{ slug: string; updatedAt?: string }>>)
      : { data: [] };
    const categoriesJson = categoriesRes.ok
      ? ((await categoriesRes.json()) as ApiEnvelope<Array<{ slug: string }>>)
      : { data: [] };

    const categoryRoutes: MetadataRoute.Sitemap = (categoriesJson.data || []).map((cat) => ({
      url: `${appUrl}/categories/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const listingRoutes: MetadataRoute.Sitemap = (listingsJson.data || []).map((listing) => ({
      url: `${appUrl}/listings/${listing.slug}`,
      lastModified: listing.updatedAt ? new Date(listing.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
  } catch {
    return staticRoutes;
  }
}
