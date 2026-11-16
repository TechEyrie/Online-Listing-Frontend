/** Public product name — override with NEXT_PUBLIC_APP_NAME in env. */
export const APP_DISPLAY_NAME =
  process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'Apeq';

export const APP_STORAGE_PREFIX = 'apeq';
export const LEGACY_APP_STORAGE_PREFIX = 'suqora';