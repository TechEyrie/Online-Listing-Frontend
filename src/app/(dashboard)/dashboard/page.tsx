'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { DashboardStatsCards } from '@/components/profile/dashboard-stats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userApi } from '@/lib/user-api';
import { useAuthStore } from '@/stores/auth-store';
import type { DashboardStats } from '@/types/user';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await userApi.getStats();
        if (!cancelled) setStats(res.data);
      } catch {
        if (!cancelled) setError('Could not load dashboard stats');
      }
    };
    if (!isLoading) {
      void load();
    }
    return () => {
      cancelled = true;
    };
  }, [isLoading]);

  if (isLoading) {
    return <p>Loading session...</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="page-eyebrow">Workspace</p>
        <h1 className="text-page-title mt-1">
          {user?.role === 'agent'
            ? 'Agent dashboard'
            : user?.role === 'brand'
              ? 'Brand dashboard'
              : 'Dashboard'}
        </h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user?.name}</p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {stats ? <DashboardStatsCards stats={stats} /> : <p className="text-sm">Loading stats...</p>}

      {user?.role === 'agent' && (
        <Card>
          <CardHeader>
            <CardTitle>Agency</CardTitle>
            <CardDescription>Manage your agency profile details.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <span className="text-muted-foreground">Agency:</span>{' '}
              {user.agencyDetails?.name || 'Not set'}
            </p>
            <p>
              <span className="text-muted-foreground">License:</span>{' '}
              {user.agencyDetails?.license || 'Not set'}
            </p>
            <Link href="/profile" className="mt-3 inline-block text-primary underline">
              Edit agency details
            </Link>
          </CardContent>
        </Card>
      )}

      {user?.role === 'brand' && (
        <Card>
          <CardHeader>
            <CardTitle>Company</CardTitle>
            <CardDescription>Manage your brand profile details.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p>
              <span className="text-muted-foreground">Company:</span>{' '}
              {user.companyDetails?.name || 'Not set'}
            </p>
            <p>
              <span className="text-muted-foreground">Registration:</span>{' '}
              {user.companyDetails?.registrationNo || 'Not set'}
            </p>
            <Link href="/profile" className="mt-3 inline-block text-primary underline">
              Edit company details
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3 text-sm">
          <Link href="/profile" className="rounded-[10px] bg-primary-soft px-3 py-2 font-semibold text-primary hover:bg-primary/10">
            Edit profile
          </Link>
          <Link href="/settings" className="rounded-[10px] bg-muted px-3 py-2 font-semibold text-foreground hover:bg-muted/80">
            Settings
          </Link>
          {user?._id && (
            <Link href={`/users/${user._id}`} className="rounded-[10px] bg-muted px-3 py-2 font-semibold text-foreground hover:bg-muted/80">
              View public profile
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
