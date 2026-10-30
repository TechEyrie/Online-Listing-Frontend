import { ImageResponse } from 'next/og';

import { BRAND_COLORS } from '@/lib/brand-colors';

export const alt = 'Suqora — Buy & Sell Anything';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 72,
          background: `linear-gradient(145deg, ${BRAND_COLORS.maroon} 0%, ${BRAND_COLORS.maroonMid} 45%, ${BRAND_COLORS.gold} 100%)`,
          color: 'white',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: -1 }}>Suqora</div>
        <div style={{ marginTop: 18, fontSize: 34, opacity: 0.95 }}>
          Buy & sell anything — Qatar & beyond
        </div>
      </div>
    ),
    { ...size },
  );
}
