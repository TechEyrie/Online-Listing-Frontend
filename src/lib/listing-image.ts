/** Local fallback when a listing has no uploaded images. */
export const LISTING_PLACEHOLDER_SRC = '/listing-placeholder.svg';

export const getListingCoverUrl = (url?: string | null): string =>
  url?.trim() ? url.trim() : LISTING_PLACEHOLDER_SRC;

export const isListingPlaceholderSrc = (src: string): boolean => src === LISTING_PLACEHOLDER_SRC;
