/**
 * Browser calls should use a same-origin `/api` path (Vercel rewrite → Render).
 * Server-side fetch (sitemap, metadata) needs an absolute upstream URL.
 */
export function getClientApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || '/api';
}

export function getServerApiBase(): string {
  return (
    process.env.API_INTERNAL_URL ||
    process.env.API_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:5000/api'
  ).replace(/\/$/, '');
}
