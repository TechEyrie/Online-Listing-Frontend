export interface CategoryBrowseItem {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  image?: string;
  tint: string;
}

/** Homepage “Browse by need” — only images from `public/slides/` (order = card order). */
const BROWSE_NEED_SLIDE_FILENAMES = [
  'Glossy Red Supercar on Burgundy Reflection.webp',
  'Maroon Sky Villa Façade.webp',
  'Modern Tech Collection on Burgundy.webp',
  'Smartphone and Laptop on Burgundy Surface.webp',
  'Burgundy Fashion Shopper with Bags.webp',
  'Toddler’s Colourful Toytime Adventure.webp',
  'Burgundy Reading Nook with Mustard Chair.webp',
  'Modern Checkout with Contactless Payment.webp',
  'Qatari Collaborator at Work.webp',
  'Business Book Stack on Burgundy.webp',
  'Maroon Serenity_ Cat and Puppy Cuddle.webp',
  'Vibrant Supermarket Produce Display.webp',
] as const;

export const BROWSE_NEED_SLIDE_IMAGES: readonly string[] = BROWSE_NEED_SLIDE_FILENAMES.map(
  (file) => `/slides/${encodeURI(file)}`,
);

export const BROWSE_NEED_SLIDE_COUNT = BROWSE_NEED_SLIDE_IMAGES.length;

const CATALOG: Record<string, { headline: string; tint: string }> = {
  vehicles: {
    headline: 'Find your next ride',
    tint: '#dbeafe',
  },
  property: {
    headline: 'A place to call home',
    tint: '#ffedd5',
  },
  electronics: {
    headline: 'Level up your tech',
    tint: '#f3e8ff',
  },
  mobiles: {
    headline: 'Phones that fit your life',
    tint: '#e0e7ff',
  },
  'fashion-beauty': {
    headline: 'Start looking sharp',
    tint: '#fce7f3',
  },
  'hobby-sport-kids': {
    headline: 'Toys for little ones',
    tint: '#e0f2fe',
  },
  'home-garden': {
    headline: 'Make home feel right',
    tint: '#dcfce7',
  },
  services: {
    headline: 'Help when you need it',
    tint: '#fef3c7',
  },
  jobs: {
    headline: 'Work that works for you',
    tint: '#fee2e2',
  },
  'business-industry': {
    headline: 'Tools for growing work',
    tint: '#e2e8f0',
  },
  animals: {
    headline: 'Care for every companion',
    tint: '#fce7f3',
  },
  essentials: {
    headline: 'Everyday essentials nearby',
    tint: '#ecfccb',
  },
};

const FALLBACK_ORDER = [
  'vehicles',
  'property',
  'electronics',
  'mobiles',
  'fashion-beauty',
  'hobby-sport-kids',
  'home-garden',
  'services',
  'jobs',
  'business-industry',
  'animals',
  'essentials',
] as const;

const TINTS = [
  '#dbeafe',
  '#ffedd5',
  '#f3e8ff',
  '#e0e7ff',
  '#fce7f3',
  '#e0f2fe',
  '#dcfce7',
  '#fef3c7',
  '#fee2e2',
  '#e2e8f0',
  '#fce7f3',
  '#ecfccb',
];

export const STATIC_BROWSE_CATEGORIES: CategoryBrowseItem[] = BROWSE_NEED_SLIDE_FILENAMES.map(
  (_, i) => {
    const slug = FALLBACK_ORDER[i] ?? 'vehicles';
    const entry = CATALOG[slug] ?? CATALOG.vehicles;
    return {
      _id: `static-${slug}`,
      name: slug
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      slug,
      headline: entry.headline,
      image: BROWSE_NEED_SLIDE_IMAGES[i],
      tint: entry.tint || TINTS[i % TINTS.length],
    };
  },
);

export function toBrowseItem(
  category: { _id: string; name: string; slug: string },
  index: number,
): CategoryBrowseItem {
  const entry = CATALOG[category.slug];
  return {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    headline: entry?.headline ?? category.name,
    image: BROWSE_NEED_SLIDE_IMAGES[index],
    tint: entry?.tint || TINTS[index % TINTS.length],
  };
}