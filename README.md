# Suqora Web

Next.js frontend for Suqora.

## Local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Point `API_PROXY_TARGET` at a running API (`http://127.0.0.1:5000/api`).

## Deploy (Vercel)

See root `DEPLOY.md`. Set Root Directory to `client` in a monorepo, or deploy this folder as its own repo.

Required production env:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL=/api`
- `API_PROXY_TARGET=https://YOUR_API.onrender.com/api`
- `API_INTERNAL_URL=https://YOUR_API.onrender.com/api`
