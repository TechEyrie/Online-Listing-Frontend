'use client';

import { useEffect, useState } from 'react';

import { ProfileForm } from '@/components/profile/profile-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userApi } from '@/lib/user-api';
import { useAuthStore } from '@/stores/auth-store';
import type { AuthUser } from '@/types/auth';

export default function ProfilePage() {
  const storeUser = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [profile, setProfile] = useState<AuthUser | null>(storeUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await userApi.getMe();
        if (!cancelled) {
          setProfile(res.data);
          setUser(res.data);
        }
      } catch {
        if (!cancelled) setError('Could not load profile');
      }
    };
    if (!isLoading) {
      void load();
    }
    return () => {
      cancelled = true;
    };
  }, [isLoading, setUser]);

  if (isLoading || !profile) {
    return <p>{error || 'Loading profile...'}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
        <CardDescription>Update your public details, location, and social links.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm user={profile} />
      </CardContent>
    </Card>
  );
}
