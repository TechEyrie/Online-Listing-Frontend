import fs from 'fs';
import path from 'path';

import type { NextConfig } from 'next';
import { loadEnvConfig } from '@next/env';

// Standalone client repo: load env from this package.
loadEnvConfig(__dirname);
// Monorepo local dev: also allow root `.env` when present.
const monorepoRoot = path.resolve(__dirname, '..');
if (fs.existsSync(path.join(monorepoRoot, '.env')) || fs.existsSync(path.join(monorepoRoot, '.env.local'))) {
  loadEnvConfig(monorepoRoot);
}

/** Upstream Express API (no trailing slash required). Used only for Next rewrites / SSR. */
const apiProxyTarget = (process.env.API_PROXY_TARGET || 'http://127.0.0.1:5000/api').replace(
  /\/$/,
  '',
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Suqora',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

export default nextConfig;
