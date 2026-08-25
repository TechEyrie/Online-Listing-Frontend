'use client';

import { Suspense } from 'react';

import SearchPage from './search-page';

export default function SearchRoutePage() {
  return (
    <Suspense fallback={<main className="p-8 text-sm">Loading search...</main>}>
      <SearchPage />
    </Suspense>
  );
}
