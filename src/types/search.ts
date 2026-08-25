import type { CategoryAttribute } from '@/types/category';
import type { Listing, ListingListMeta } from '@/types/listing';

export type SearchSort = 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular';

export interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  type?: string;
  condition?: string;
  priceMin?: number;
  priceMax?: number;
  city?: string;
  country?: string;
  sort?: SearchSort;
  page?: number;
  limit?: number;
  featured?: boolean | string;
  [attribute: string]: string | number | boolean | undefined;
}

export interface SearchMeta extends ListingListMeta {
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterOptions {
  cities: string[];
  priceRange: { min: number; max: number };
  conditions: string[];
  types: string[];
  attributes: CategoryAttribute[];
}

export type SearchListing = Listing;
