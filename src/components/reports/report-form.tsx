'use client';

import { useState } from 'react';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { reportApi } from '@/lib/admin-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';
import type { ReportReason, ReportTargetType } from '@/types/admin';

const REASONS: ReportReason[] = ['spam', 'scam', 'offensive', 'prohibited', 'duplicate', 'other'];

interface ReportFormProps {
  targetType: ReportTargetType;
  targetId: string;
}

export function ReportForm({ targetType, targetId }: ReportFormProps) {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('spam');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!user) return null;

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      await reportApi.create({
        targetType,
        targetId,
        reason,
        description: description || undefined,
      });
      setSuccess('Report submitted. Our team will review it.');
      setOpen(false);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not submit report');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        Report {targetType}
      </Button>
      {success && <p className="text-sm text-green-600">{success}</p>}
      {open && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="report-reason">Reason</Label>
            <select
              id="report-reason"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
            >
              {REASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="report-description">Details (optional)</Label>
            <textarea
              id="report-description"
              className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="button" size="sm" disabled={pending} onClick={() => void submit()}>
            {pending ? 'Submitting...' : 'Submit report'}
          </Button>
        </div>
      )}
    </div>
  );
}
