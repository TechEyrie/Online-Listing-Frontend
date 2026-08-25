'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { RevenueChart } from '@/components/admin/revenue-chart';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin-api';
import { useAuthStore } from '@/stores/auth-store';

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
    enabled: user?.role === 'admin',
  });

  if (user?.role === 'moderator') {
    return (
      <div className="space-y-4">
        <h1 className="text-page-title">Moderator home</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You can moderate listings and reports. Full stats are admin-only.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/admin/listings">Listings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reports">Reports</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="page-eyebrow">Control center</p>
        <h1 className="text-page-title mt-1">Admin overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Platform-wide health and monetization</p>
      </div>

      {isLoading && <p className="text-sm">Loading stats...</p>}
      {isError && <p className="text-sm text-destructive">Could not load dashboard stats.</p>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={String(data.totalUsers)} />
            <StatCard label="Total listings" value={String(data.totalListings)} />
            <StatCard
              label="Revenue"
              value={`$${data.revenue.total.toFixed(2)}`}
              hint={`${data.revenue.transactions} completed payments`}
            />
            <StatCard label="Pending reports" value={String(data.pendingReports)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-3 font-display font-semibold">Users by role</h2>
              <ul className="space-y-1 text-sm">
                {Object.entries(data.users).map(([role, count]) => (
                  <li key={role} className="flex justify-between border-b border-border py-2">
                    <span className="capitalize font-medium">{role}</span>
                    <span className="tabular-nums font-semibold text-primary">{count}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
              <h2 className="mb-3 font-display font-semibold">Listings by status</h2>
              <ul className="space-y-1 text-sm">
                {Object.entries(data.listings).map(([status, count]) => (
                  <li key={status} className="flex justify-between border-b border-border py-2">
                    <span className="capitalize font-medium">{status}</span>
                    <span className="tabular-nums font-semibold text-primary">{count}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <RevenueChart points={data.revenueTrend} />
        </>
      )}
    </div>
  );
}
