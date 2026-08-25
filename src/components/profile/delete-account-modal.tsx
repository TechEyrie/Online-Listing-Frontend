'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/lib/user-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

interface DeleteAccountModalProps {
  authProvider?: 'local' | 'google';
}

export function DeleteAccountModal({ authProvider = 'local' }: DeleteAccountModalProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const onDelete = async () => {
    setError(null);
    setLoading(true);
    try {
      await userApi.deleteAccount(password);
      logout();
      router.push('/register');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not delete account');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        Delete account
      </Button>
    );
  }

  return (
    <div className="space-y-4 rounded-md border border-destructive/40 bg-destructive/5 p-4">
      <p className="text-sm">
        This soft-deletes your account.{' '}
        {authProvider === 'google' ? 'Type DELETE to confirm.' : 'Enter your password to confirm.'}
      </p>
      <div className="space-y-2">
        <Label htmlFor="delete-password">
          {authProvider === 'google' ? 'Confirmation' : 'Password'}
        </Label>
        <Input
          id="delete-password"
          type={authProvider === 'google' ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="destructive"
          disabled={loading}
          onClick={() => void onDelete()}
        >
          {loading ? 'Deleting...' : 'Confirm delete'}
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
