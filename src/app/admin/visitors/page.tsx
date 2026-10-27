'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { AdminListPagination } from '@/components/admin/admin-list-pagination';
import { BreakdownBars } from '@/components/admin/breakdown-bars';
import { StatCard } from '@/components/admin/stat-card';
import { TrendChart } from '@/components/admin/trend-chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/admin-api';

const SORTS = [
  { id: 'recent' as const, label: 'Recent' },
  { id: 'hits' as const, label: 'Most hits' },
  { id: '429' as const, label: 'Most 429s' },
];

const PAGE_SIZES = [20, 50, 100] as const;

function formatWindow(ms: number): string {
  const min = Math.round(ms / 60000);
  if (min >= 60) return `${Math.round(min / 60)}h`;
  return `${min}m`;
}

export default function AdminVisitorsPage() {
  const [sort, setSort] = useState<(typeof SORTS)[number]['id']>('recent');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<(typeof PAGE_SIZES)[number]>(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(handle);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sort, limit]);

  const statsQuery = useQuery({
    queryKey: ['admin-visitor-stats'],
    queryFn: () => adminApi.getVisitorStats(),
  });

  const listQuery = useQuery({
    queryKey: ['admin-visitors', sort, page, limit, debouncedSearch],
    queryFn: () =>
      adminApi.getVisitors({
        page,
        limit,
        sort,
        search: debouncedSearch || undefined,
      }),
  });

  const stats = statsQuery.data;
  const visitors = listQuery.data?.data ?? [];
  const meta = listQuery.data?.meta;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="page-eyebrow">Traffic</p>
          <h1 className="text-page-title mt-1">Visitors</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            IP addresses, linked accounts, API volume, and rate-limit (429) signals
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to overview</Link>
        </Button>
      </div>

      {statsQuery.isLoading && <p className="text-sm">Loading stats...</p>}
      {statsQuery.isError && (
        <p className="text-sm text-destructive">Could not load visitor stats.</p>
      )}

      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Unique visitors" value={stats.uniqueVisitors.toLocaleString()} />
            <StatCard label="Total API hits" value={stats.totalVisits.toLocaleString()} />
            <StatCard label="Active (24h)" value={stats.activeLast24h.toLocaleString()} />
            <StatCard
              label="429 responses"
              value={stats.status429Total.toLocaleString()}
              hint={`Global limit: ${stats.rateLimitHint.maxRequests} / ${formatWindow(stats.rateLimitHint.windowMs)} per IP`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <TrendChart title="API hits (30 days)" points={stats.visitsTrend} mode="count" />
            <BreakdownBars
              title="Top API paths (30d)"
              rows={stats.topPaths.map((p) => ({ label: p.path, value: p.count }))}
            />
          </div>

          {stats.top429.length > 0 && (
            <div className="rounded-lg border border-border p-4">
              <h2 className="text-sm font-semibold">Highest 429 counts</h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {stats.top429.map((row) => (
                  <li key={row.visitorId} className="flex flex-wrap justify-between gap-2">
                    <span>
                      <span className="font-mono text-foreground">{row.visitorId}</span>
                      {row.ipAddress ? ` · ${row.ipAddress}` : ''}
                      {!row.ipAddress && row.ipPrefix ? ` · ${row.ipPrefix}` : ''}
                    </span>
                    <span>
                      {row.status429Count} blocked · {row.visitCount} hits
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="min-w-[220px] flex-1 space-y-1">
            <label htmlFor="visitor-search" className="text-xs font-medium text-muted-foreground">
              Search IP, email, path, or visitor id
            </label>
            <Input
              id="visitor-search"
              placeholder="e.g. 203.0.113.9 or user@email.com"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {SORTS.map((s) => (
              <Button
                key={s.id}
                size="sm"
                variant={sort === s.id ? 'default' : 'outline'}
                onClick={() => setSort(s.id)}
              >
                {s.label}
              </Button>
            ))}
          </div>
          <div className="space-y-1">
            <label htmlFor="visitor-limit" className="text-xs font-medium text-muted-foreground">
              Per page
            </label>
            <select
              id="visitor-limit"
              className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value) as (typeof PAGE_SIZES)[number])}
            >
              {PAGE_SIZES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {listQuery.isLoading && <p className="text-sm">Loading visitors...</p>}
        {listQuery.isError && (
          <p className="text-sm text-destructive">Could not load visitor list.</p>
        )}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Visitor</th>
                <th className="px-3 py-2 font-medium">IP address</th>
                <th className="px-3 py-2 font-medium">Account</th>
                <th className="px-3 py-2 font-medium">Hits</th>
                <th className="px-3 py-2 font-medium">429</th>
                <th className="px-3 py-2 font-medium">Last path</th>
                <th className="px-3 py-2 font-medium">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v._id} className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono text-xs">{v.visitorId}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {v.ipAddress || v.ipPrefix || '—'}
                  </td>
                  <td className="px-3 py-2">
                    {v.user?.email ? (
                      <span className="text-xs">{v.user.email}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Guest</span>
                    )}
                  </td>
                  <td className="px-3 py-2 tabular-nums">{v.visitCount}</td>
                  <td className="px-3 py-2 tabular-nums">{v.status429Count}</td>
                  <td className="max-w-[200px] truncate px-3 py-2" title={v.lastPath}>
                    {v.lastPath}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                    {new Date(v.lastSeen).toLocaleString()}
                  </td>
                </tr>
              ))}
              {visitors.length === 0 && !listQuery.isLoading && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    {debouncedSearch ? 'No visitors match this search.' : 'No visitors recorded yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminListPagination
          meta={meta}
          page={page}
          onPageChange={setPage}
          isFetching={listQuery.isFetching}
          itemLabel="visitors"
        />
      </section>
    </div>
  );
}
