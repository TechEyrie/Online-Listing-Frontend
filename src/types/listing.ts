export type ListingPriceType = 'fixed' | 'negotiable' | 'free' | 'contact';
export type ListingType = 'sale' | 'rent' | 'service' | 'job' | 'wanted';
export type ListingCondition = 'new' | 'used' | 'refurbished';
export type ListingStatus = 'active' | 'pending' | 'expired' | 'sold' | 'hidden';

export type { ListingCurrency } from '@/lib/location-currency';

export interface ListingImage {
  url: string;
  publicId: string;
  order: number;
}

export interface ListingLocation {
  city: string;
  state?: string;
  country: string;
}

export interface ListingSeller {
  _id: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: { city?: string; country?: string };
  createdAt?: string;
}

export interface ListingCategoryRef {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Listing {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency?: string;
  priceType: ListingPriceType;
  type: ListingType;
  category: ListingCategoryRef | string;
  subcategory?: ListingCategoryRef | string;
  seller: ListingSeller | string;
  images: ListingImage[];
  location: ListingLocation;
  attributes: Record<string, string | number | boolean | string[]>;
  condition?: ListingCondition;
  status: ListingStatus;
  isFeatured: boolean;
  featuredUntil?: string;
  bumpedAt?: string;
  viewCount: number;
  favoriteCount: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListingListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
