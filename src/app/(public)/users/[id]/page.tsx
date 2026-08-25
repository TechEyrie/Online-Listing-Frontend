'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { BrandLogo } from '@/components/layout/brand-logo';
import { PublicProfileCard } from '@/components/profile/public-profile-card';
import { RatingBadge } from '@/components/reviews/rating-badge';
import { ReviewList } from '@/components/reviews/review-list';
import { ReportForm } from '@/components/reports/report-form';
import { userApi } from '@/lib/user-api';
import { useAuthStore } from '@/stores/auth-store';
import type { PublicProfile } from '@/types/user';

export default function PublicProfilePage() {
  const params = useParams<{ id: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await userApi.getPublicProfile(params.id);
        if (!cancelled) setProfile(res.data);
      } catch {
        if (!cancelled) setError('Profile not found');
      }
    };
    if (params.id) {
      void load();
    }
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <BrandLogo size="md" />
      {error && <p className="text-destructive">{error}</p>}
      {!error && !profile && <p>Loading profile...</p>}
      {profile && (
        <>
          <PublicProfileCard profile={profile} />
          {currentUser && currentUser._id !== profile._id && (
            <ReportForm targetType="user" targetId={profile._id} />
          )}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Seller rating</h2>
              <RatingBadge userId={profile._id} />
            </div>
            <ReviewList userId={profile._id} />
          </section>
        </>
      )}
    </main>
  );
}
