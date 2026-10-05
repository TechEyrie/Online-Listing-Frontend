'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { AdminAnalyticsDashboard } from '@/components/admin/admin-analytics-dashboard';
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
          You can moderate listings and reports. Full analytics are admin-only.
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
    <div className="space-y-6">
      {isLoading && <p className="text-sm text-muted-foreground">Loading analytics...</p>}
      {isError && (
        <p className="text-sm text-destructive">Could not load platform analytics.</p>
      )}
      {data && <AdminAnalyticsDashboard data={data} />}
    </div>
  );
}
