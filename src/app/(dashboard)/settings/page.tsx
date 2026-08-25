'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';

import { ChangePasswordForm } from '@/components/profile/change-password-form';
import { DeleteAccountModal } from '@/components/profile/delete-account-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { userApi } from '@/lib/user-api';
import { notificationPrefsSchema, type NotificationPrefsFormValues } from '@/lib/validators';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [prefsMessage, setPrefsMessage] = useState<string | null>(null);
  const [prefsError, setPrefsError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NotificationPrefsFormValues>({
    resolver: zodResolver(notificationPrefsSchema),
    defaultValues: {
      emailMessages: user?.notificationPreferences?.emailMessages ?? true,
      emailListingUpdates: user?.notificationPreferences?.emailListingUpdates ?? true,
      emailMarketing: user?.notificationPreferences?.emailMarketing ?? false,
    },
  });

  useEffect(() => {
    reset({
      emailMessages: user?.notificationPreferences?.emailMessages ?? true,
      emailListingUpdates: user?.notificationPreferences?.emailListingUpdates ?? true,
      emailMarketing: user?.notificationPreferences?.emailMarketing ?? false,
    });
  }, [user, reset]);

  const onSavePrefs = async (values: NotificationPrefsFormValues) => {
    setPrefsError(null);
    setPrefsMessage(null);
    try {
      const res = await userApi.updateProfile({ notificationPreferences: values });
      setUser(res.data);
      setPrefsMessage('Notification preferences saved');
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setPrefsError(axiosError.response?.data?.message || 'Could not save preferences');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Email is managed by your sign-in method.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>
            <span className="text-muted-foreground">Email:</span> {user?.email}
          </p>
          <p>
            <span className="text-muted-foreground">Provider:</span> {user?.authProvider || 'local'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Requires your current password.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose which emails you want to receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={handleSubmit(onSavePrefs)}>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('emailMessages')} />
              <Label>Message emails</Label>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('emailListingUpdates')} />
              <Label>Listing update emails</Label>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('emailMarketing')} />
              <Label>Marketing emails</Label>
            </label>
            {prefsError && <p className="text-sm text-destructive">{prefsError}</p>}
            {prefsMessage && <p className="text-sm text-green-600">{prefsMessage}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save preferences'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Soft-delete anonymizes your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteAccountModal authProvider={user?.authProvider} />
        </CardContent>
      </Card>
    </div>
  );
}
