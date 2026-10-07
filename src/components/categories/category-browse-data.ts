export interface CategoryBrowseItem {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  image?: string;
  tint: string;
}

/** Marketing headlines + lifestyle imagery for the homepage browse slider. */
const CATALOG: Record<string, { headline: string; image: string; tint: string }> = {
  vehicles: {
    headline: 'Find your next ride',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
    tint: '#dbeafe',
  },
  property: {
    headline: 'A place to call home',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    tint: '#ffedd5',
  },
  electronics: {
    headline: 'Level up your tech',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    tint: '#f3e8ff',
  },
  mobiles: {
    headline: 'Phones that fit your life',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    tint: '#e0e7ff',
  },
  'home-garden': {
    headline: 'Make home feel right',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    tint: '#dcfce7',
  },
  services: {
    headline: 'Help when you need it',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
    tint: '#fef3c7',
  },
  'business-industry': {
    headline: 'Tools for growing work',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    tint: '#e2e8f0',
  },
  jobs: {
    headline: 'Work that works for you',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    tint: '#fee2e2',
  },
  animals: {
    headline: 'Care for every companion',
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    tint: '#fce7f3',
  },
  'hobby-sport-kids': {
    headline: 'Toys for little ones',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    tint: '#e0f2fe',
  },
  'fashion-beauty': {
    headline: 'Start looking sharp',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    tint: '#fce7f3',
  },
  education: {
    headline: "Books you can't put down",
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    tint: '#f1f5f9',
  },
  essentials: {
    headline: 'Everyday essentials nearby',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    tint: '#ecfccb',
  },
  agriculture: {
    headline: 'Grow with the season',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3856?w=800&q=80',
    tint: '#d9f99d',
  },
  other: {
    headline: 'Discover something new',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tint: '#e5e7eb',
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
] as const;

const TINTS = [
  '#dbeafe',
  '#ffedd5',
  '#f3e8ff',
  '#e0e7ff',
  '#dcfce7',
  '#fef3c7',
  '#fce7f3',
  '#e0f2fe',
];

export const STATIC_BROWSE_CATEGORIES: CategoryBrowseItem[] = FALLBACK_ORDER.map((slug, i) => {
  const entry = CATALOG[slug];
  return {
    _id: `static-${slug}`,
    name: slug
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' '),
    slug,
    headline: entry.headline,
    image: entry.image,
    tint: entry.tint || TINTS[i % TINTS.length],
  };
});

export function toBrowseItem(
  category: { _id: string; name: string; slug: string; image?: string },
  index: number,
): CategoryBrowseItem {
  const entry = CATALOG[category.slug];
  const fallback = STATIC_BROWSE_CATEGORIES[index % STATIC_BROWSE_CATEGORIES.length];

  return {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    headline: entry?.headline ?? category.name,
    image: category.image || entry?.image || fallback.image,
    tint: entry?.tint || TINTS[index % TINTS.length],
  };
}
