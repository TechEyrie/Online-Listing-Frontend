export interface CategoryBrowseItem {
  _id: string;
  name: string;
  slug: string;
  headline: string;
  image?: string;
  tint: string;
}

type BrowseNeedSlide = {
  file: string;
  headline: string;
  slug: string;
  categoryLabel: string;
  tint: string;
};

/** One row per file in `public/slides/` — headline + link match the creative, not API sort order. */
const BROWSE_NEED_SLIDES: readonly BrowseNeedSlide[] = [
  {
    file: 'Glossy Red Supercar on Burgundy Reflection.webp',
    headline: 'Find your next ride',
    slug: 'vehicles',
    categoryLabel: 'Vehicles',
    tint: '#6B0F2A',
  },
  {
    file: 'Maroon Sky Villa Façade.webp',
    headline: 'A place to call home',
    slug: 'property',
    categoryLabel: 'Property',
    tint: '#8B1538',
  },
  {
    file: 'Modern Tech Collection on Burgundy.webp',
    headline: 'Level up your tech',
    slug: 'electronics',
    categoryLabel: 'Electronics',
    tint: '#7A1A3C',
  },
  {
    file: 'Smartphone and Laptop on Burgundy Surface.webp',
    headline: 'Phones & laptops',
    slug: 'mobiles',
    categoryLabel: 'Mobiles',
    tint: '#6B0F2A',
  },
  {
    file: 'Burgundy Fashion Shopper with Bags.webp',
    headline: 'Style that stands out',
    slug: 'fashion-beauty',
    categoryLabel: 'Fashion & Beauty',
    tint: '#8B1538',
  },
  {
    file: 'Toddler’s Colourful Toytime Adventure.webp',
    headline: 'Toys for little ones',
    slug: 'hobby-sport-kids',
    categoryLabel: 'Kids & Hobbies',
    tint: '#7A1A3C',
  },
  {
    file: 'Burgundy Reading Nook with Mustard Chair.webp',
    headline: 'Make home feel right',
    slug: 'home-garden',
    categoryLabel: 'Home & Garden',
    tint: '#6B0F2A',
  },
  {
    file: 'Modern Checkout with Contactless Payment.webp',
    headline: 'Pay the easy way',
    slug: 'services',
    categoryLabel: 'Services',
    tint: '#8B1538',
  },
  {
    file: 'Qatari Collaborator at Work.webp',
    headline: 'Work that fits you',
    slug: 'jobs',
    categoryLabel: 'Jobs',
    tint: '#7A1A3C',
  },
  {
    file: 'Business Book Stack on Burgundy.webp',
    headline: "Books you'll love",
    slug: 'education',
    categoryLabel: 'Education',
    tint: '#6B0F2A',
  },
  {
    file: 'Maroon Serenity_ Cat and Puppy Cuddle.webp',
    headline: 'Pets & companions',
    slug: 'animals',
    categoryLabel: 'Animals',
    tint: '#8B1538',
  },
  {
    file: 'Vibrant Supermarket Produce Display.webp',
    headline: 'Fresh everyday picks',
    slug: 'essentials',
    categoryLabel: 'Essentials',
    tint: '#7A1A3C',
  },
];

function slideImagePath(file: string): string {
  return `/slides/${encodeURI(file)}`;
}

export const BROWSE_NEED_SLIDE_IMAGES: readonly string[] = BROWSE_NEED_SLIDES.map((s) =>
  slideImagePath(s.file),
);

export const BROWSE_NEED_SLIDE_COUNT = BROWSE_NEED_SLIDES.length;

export function buildBrowseNeedItems(
  categories: { _id: string; name: string; slug: string }[] | undefined,
): CategoryBrowseItem[] {
  return BROWSE_NEED_SLIDES.map((slide) => {
    const fromApi = categories?.find((c) => c.slug === slide.slug);
    return {
      _id: fromApi?._id ?? `static-${slide.slug}`,
      name: fromApi?.name ?? slide.categoryLabel,
      slug: slide.slug,
      headline: slide.headline,
      image: slideImagePath(slide.file),
      tint: slide.tint,
    };
  });
}

/** Static fallback when category API has not loaded yet. */
export const STATIC_BROWSE_CATEGORIES: CategoryBrowseItem[] = buildBrowseNeedItems(undefined);