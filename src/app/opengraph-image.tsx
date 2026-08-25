import { ImageResponse } from 'next/og';

export const runtime = 'edge';
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
          background: 'linear-gradient(145deg, #0d7377 0%, #14919b 40%, #22c55e 100%)',
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
