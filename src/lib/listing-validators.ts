import { z } from 'zod';

import { isListingCurrency, type ListingCurrency } from '@/lib/location-currency';
import { isStructuredCountry } from '@/lib/location-data';

export const listingFormSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(120),
    description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
    price: z.number().min(0, 'Price must be 0 or more'),
    currency: z.custom<ListingCurrency>(
      (value): value is ListingCurrency => typeof value === 'string' && isListingCurrency(value),
      { message: 'Invalid currency' },
    ),
    priceType: z.enum(['fixed', 'negotiable', 'free', 'contact']),
    type: z.enum(['sale', 'rent', 'service', 'job', 'wanted']),
    category: z.string().min(1, 'Category is required'),
    subcategory: z.string().optional(),
    condition: z.enum(['new', 'used', 'refurbished']).optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  })
  .superRefine((data, ctx) => {
    if (isStructuredCountry(data.country) && !data.state?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'State / region is required',
        path: ['state'],
      });
    }
  });

export type ListingFormValues = z.infer<typeof listingFormSchema>;
