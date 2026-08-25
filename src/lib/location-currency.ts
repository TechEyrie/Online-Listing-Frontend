/** Shared listing currency constants for the Next.js client (mirrors server). */
export const LISTING_CURRENCIES = [
  'QAR',
  'USD',
  'EUR',
  'GBP',
  'AED',
  'SAR',
  'KWD',
  'BHD',
  'OMR',
  'INR',
  'LKR',
  'PKR',
  'BDT',
  'EGP',
  'TRY',
  'CAD',
  'AUD',
] as const;

export type ListingCurrency = (typeof LISTING_CURRENCIES)[number];

export const DEFAULT_LISTING_CURRENCY: ListingCurrency = 'QAR';

export const CURRENCY_LOCALES: Record<ListingCurrency, string> = {
  QAR: 'en-QA',
  USD: 'en-US',
  EUR: 'en-IE',
  GBP: 'en-GB',
  AED: 'en-AE',
  SAR: 'en-SA',
  KWD: 'en-KW',
  BHD: 'en-BH',
  OMR: 'en-OM',
  INR: 'en-IN',
  LKR: 'en-LK',
  PKR: 'en-PK',
  BDT: 'en-BD',
  EGP: 'en-EG',
  TRY: 'tr-TR',
  CAD: 'en-CA',
  AUD: 'en-AU',
};

export const isListingCurrency = (value: string): value is ListingCurrency =>
  (LISTING_CURRENCIES as readonly string[]).includes(value);

/** Common countries for listing location select (Qatar first). */
export const LISTING_COUNTRIES = [
  'Qatar',
  'United Arab Emirates',
  'Saudi Arabia',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Sri Lanka',
  'India',
  'Pakistan',
  'Bangladesh',
  'Egypt',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Turkey',
  'Other',
] as const;

/** Popular cities by country for datalist suggestions (any city still allowed as free text). */
export const CITIES_BY_COUNTRY: Record<string, string[]> = {
  Qatar: [
    'Doha',
    'Al Rayyan',
    'Al Wakrah',
    'Al Khor',
    'Umm Salal',
    'Lusail',
    'Al Daayen',
    'Madinat ash Shamal',
    'Mesaieed',
  ],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah'],
  'Saudi Arabia': ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar'],
  Kuwait: ['Kuwait City', 'Hawalli', 'Salmiya', 'Jahra'],
  Bahrain: ['Manama', 'Riffa', 'Muharraq'],
  Oman: ['Muscat', 'Salalah', 'Sohar'],
  'Sri Lanka': ['Colombo', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Kurunegala'],
  India: ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Edinburgh'],
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'],
};
