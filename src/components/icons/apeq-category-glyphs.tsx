import type { SVGProps } from 'react';

type GlyphProps = SVGProps<SVGSVGElement>;

const strokeProps = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.65,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

/** Shared Apeq glyph style: rounded strokes, 24×24, meant on maroon/gold tiles. */
export function ApeqVehiclesIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M4 14h16l-1.2-4.2a2 2 0 0 0-1.9-1.3H7.1a2 2 0 0 0-1.9 1.3L4 14z" />
      <path d="M6.5 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M17.5 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M4 14v2.5M20 14v2.5" />
    </svg>
  );
}

export function ApeqPropertyIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M4.5 10.5 12 4l7.5 6.5V20a1 1 0 0 1-1 1h-5v-6H10.5v6h-5a1 1 0 0 1-1-1v-9.5z" />
      <path d="M12 4v3.5" />
    </svg>
  );
}

export function ApeqElectronicsIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <path d="M9 9h6M9 12h4M9 15h5" />
      <circle cx="16.5" cy="15" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ApeqMobilesIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <rect x="8" y="3.5" width="8" height="17" rx="2" />
      <path d="M11 6.5h2" />
      <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ApeqHomeGardenIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M12 20V10" />
      <path d="M8 12c0-3.5 2-6.5 4-8 2 1.5 4 4.5 4 8" />
      <path d="M6 20h12" />
      <ellipse cx="12" cy="9" rx="4" ry="2.5" />
    </svg>
  );
}

export function ApeqServicesIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M14.5 6.5 18 3l3 3-3.5 3.5" />
      <path d="M16 8 11 13 8 14l1-3 5-5z" />
      <path d="M19 10.5 21 12.5 12.5 21 8 21l-1-4.5" />
    </svg>
  );
}

export function ApeqBusinessIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M5 20V8l7-4 7 4v12" />
      <path d="M9 20v-6h6v6" />
      <path d="M9 10h6M9 13h6" />
    </svg>
  );
}

export function ApeqJobsIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V6.5A2.5 2.5 0 0 1 11.5 4h1A2.5 2.5 0 0 1 15 6.5V8" />
      <path d="M12 12v3" />
    </svg>
  );
}

export function ApeqAnimalsIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <ellipse cx="8.5" cy="8" rx="1.6" ry="2" />
      <ellipse cx="15.5" cy="8" rx="1.6" ry="2" />
      <ellipse cx="6" cy="12.5" rx="1.5" ry="2" />
      <ellipse cx="18" cy="12.5" rx="1.5" ry="2" />
      <path d="M10 19c1.2-2.5 3.8-2.5 5 0" />
    </svg>
  );
}

export function ApeqHobbyIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <circle cx="9" cy="15" r="4.5" />
      <path d="M13 11 20 4" />
      <path d="M17 4h3v3" />
    </svg>
  );
}

export function ApeqFashionIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M8 6 12 3l4 3" />
      <path d="M6 6h12l-1.5 14h-9L6 6z" />
      <path d="M12 6v3" />
    </svg>
  );
}

export function ApeqEducationIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5z" />
      <path d="M7 11v5.5L12 20l5-3.5V11" />
      <path d="M20 9v6" />
    </svg>
  );
}

export function ApeqEssentialsIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M6 9h12l-1 10H7L6 9z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function ApeqAgricultureIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M12 20V10" />
      <path d="M8 14c2-4 8-4 8 0" />
      <path d="M6 20c2-6 10-6 12 0" />
      <path d="M4 20h16" />
    </svg>
  );
}

export function ApeqOtherIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <rect x="5" y="5" width="6" height="6" rx="1.2" />
      <rect x="13" y="5" width="6" height="6" rx="1.2" />
      <rect x="5" y="13" width="6" height="6" rx="1.2" />
      <rect x="13" y="13" width="6" height="6" rx="1.2" />
    </svg>
  );
}

export function ApeqDefaultIcon(props: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" {...strokeProps} {...props}>
      <path d="M12 3c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z" />
      <path d="M8.5 14.5h7" />
    </svg>
  );
}