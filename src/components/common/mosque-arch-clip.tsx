/**
 * Shared pointed Islamic / mosque arch clip-path for category + listing cards.
 *
 * clipPathUnits="objectBoundingBox" → coordinates are 0–1 and scale to any size.
 *
 * Path: two cubic Béziers meet at a sharp peak (0.5, 0) with near-vertical
 * tangents so the tip stays pointed rather than rounded.
 */
export const MOSQUE_ARCH_CLIP_ID = 'suqora-mosque-arch';

export const MOSQUE_ARCH_CLIP_PATH = `url(#${MOSQUE_ARCH_CLIP_ID})`;

const ARCH_PATH =
  'M 0 1 L 0 0.46 C 0 0.13, 0.49 0.04, 0.5 0 C 0.51 0.04, 1 0.13, 1 0.46 L 1 1 Z';

export function MosqueArchClip() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden
      focusable="false"
      style={{ position: 'absolute', overflow: 'hidden' }}
    >
      <defs>
        <clipPath id={MOSQUE_ARCH_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path d={ARCH_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}
