import type { ComponentType, SVGProps } from 'react';

import { BRAND_COLORS } from '@/lib/brand-colors';

import {
  SuqoraAgricultureIcon,
  SuqoraAnimalsIcon,
  SuqoraBusinessIcon,
  SuqoraDefaultIcon,
  SuqoraEducationIcon,
  SuqoraElectronicsIcon,
  SuqoraEssentialsIcon,
  SuqoraFashionIcon,
  SuqoraHobbyIcon,
  SuqoraHomeGardenIcon,
  SuqoraJobsIcon,
  SuqoraMobilesIcon,
  SuqoraOtherIcon,
  SuqoraPropertyIcon,
  SuqoraServicesIcon,
  SuqoraVehiclesIcon,
} from '@/components/icons/suqora-category-glyphs';

export type SuqoraCategoryGlyph = ComponentType<SVGProps<SVGSVGElement>>;

/** Shared tile gradient for every marketplace category. */
export const SUQORA_CATEGORY_TILE_GRADIENT = {
  from: BRAND_COLORS.maroonDark,
  to: BRAND_COLORS.maroonMid,
} as const;

export const SUQORA_CATEGORY_TILE_GRADIENT_HOVER = {
  from: BRAND_COLORS.maroon,
  to: BRAND_COLORS.maroonMid,
} as const;

export interface SuqoraCategoryVisual {
  Icon: SuqoraCategoryGlyph;
  from: string;
  to: string;
}

const SUQORA_CATEGORY_GLYPHS: Record<string, SuqoraCategoryGlyph> = {
  vehicles: SuqoraVehiclesIcon,
  property: SuqoraPropertyIcon,
  electronics: SuqoraElectronicsIcon,
  mobiles: SuqoraMobilesIcon,
  'home-garden': SuqoraHomeGardenIcon,
  services: SuqoraServicesIcon,
  'business-industry': SuqoraBusinessIcon,
  jobs: SuqoraJobsIcon,
  animals: SuqoraAnimalsIcon,
  'hobby-sport-kids': SuqoraHobbyIcon,
  'fashion-beauty': SuqoraFashionIcon,
  education: SuqoraEducationIcon,
  essentials: SuqoraEssentialsIcon,
  agriculture: SuqoraAgricultureIcon,
  other: SuqoraOtherIcon,
};

export const SUQORA_CATEGORY_FALLBACK: SuqoraCategoryVisual = {
  Icon: SuqoraDefaultIcon,
  ...SUQORA_CATEGORY_TILE_GRADIENT,
};

export function getSuqoraCategoryVisual(slug: string): SuqoraCategoryVisual {
  const Icon = SUQORA_CATEGORY_GLYPHS[slug] ?? SuqoraDefaultIcon;
  return {
    Icon,
    ...SUQORA_CATEGORY_TILE_GRADIENT,
  };
}