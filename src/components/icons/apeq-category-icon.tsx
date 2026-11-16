import type { ComponentType, SVGProps } from 'react';

import { BRAND_COLORS } from '@/lib/brand-colors';

import {
  ApeqAgricultureIcon,
  ApeqAnimalsIcon,
  ApeqBusinessIcon,
  ApeqDefaultIcon,
  ApeqEducationIcon,
  ApeqElectronicsIcon,
  ApeqEssentialsIcon,
  ApeqFashionIcon,
  ApeqHobbyIcon,
  ApeqHomeGardenIcon,
  ApeqJobsIcon,
  ApeqMobilesIcon,
  ApeqOtherIcon,
  ApeqPropertyIcon,
  ApeqServicesIcon,
  ApeqVehiclesIcon,
} from '@/components/icons/apeq-category-glyphs';

export type ApeqCategoryGlyph = ComponentType<SVGProps<SVGSVGElement>>;

/** Shared tile gradient for every marketplace category. */
export const APEQ_CATEGORY_TILE_GRADIENT = {
  from: BRAND_COLORS.maroonDark,
  to: BRAND_COLORS.maroonMid,
} as const;

export const APEQ_CATEGORY_TILE_GRADIENT_HOVER = {
  from: BRAND_COLORS.maroon,
  to: BRAND_COLORS.maroonMid,
} as const;

export interface ApeqCategoryVisual {
  Icon: ApeqCategoryGlyph;
  from: string;
  to: string;
}

const APEQ_CATEGORY_GLYPHS: Record<string, ApeqCategoryGlyph> = {
  vehicles: ApeqVehiclesIcon,
  property: ApeqPropertyIcon,
  electronics: ApeqElectronicsIcon,
  mobiles: ApeqMobilesIcon,
  'home-garden': ApeqHomeGardenIcon,
  services: ApeqServicesIcon,
  'business-industry': ApeqBusinessIcon,
  jobs: ApeqJobsIcon,
  animals: ApeqAnimalsIcon,
  'hobby-sport-kids': ApeqHobbyIcon,
  'fashion-beauty': ApeqFashionIcon,
  education: ApeqEducationIcon,
  essentials: ApeqEssentialsIcon,
  agriculture: ApeqAgricultureIcon,
  other: ApeqOtherIcon,
};

export const APEQ_CATEGORY_FALLBACK: ApeqCategoryVisual = {
  Icon: ApeqDefaultIcon,
  ...APEQ_CATEGORY_TILE_GRADIENT,
};

export function getApeqCategoryVisual(slug: string): ApeqCategoryVisual {
  const Icon = APEQ_CATEGORY_GLYPHS[slug] ?? ApeqDefaultIcon;
  return {
    Icon,
    ...APEQ_CATEGORY_TILE_GRADIENT,
  };
}