'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { adminApi } from '@/lib/admin-api';
import type { ApiErrorResponse } from '@/types/api';

export default function AdminReportsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('pending');
  const [resolution, setResolution] = useState('Reviewed and actioned by admin');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['admin-reports', status],
    queryFn: () =>
      adminApi.getReports({
        page: 1,
        limit: 50,
        status: status || undefined,
      }),
  });

  const mutate = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'resolve' | 'dismiss' }) =>
      adminApi.resolveReport(id, action, resolution),
    onSuccess: async (_data, vars) => {
      setMessage(`Report ${vars.action}d`);
      setError(null);
      await queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not update report');
      setMessage(null);
    },
  });

  const reports = query.data?.data ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-page-title">Reports</h1>
        <p className="text-sm text-muted-foreground">Resolve or dismiss user reports</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All</option>
          {['pending', 'reviewed', 'resolved', 'dismissed'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Input
          className="max-w-md"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Resolution note"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}
      {query.isLoading && <p className="text-sm">Loading reports...</p>}

      <ul className="space-y-3">
        {reports.map((report) => (
          <li key={report._id} className="space-y-2 rounded-lg border bg-background p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium capitalize">
                {report.targetType} · {report.reason} · {report.status}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
            <p>
              Reporter: {report.reporter?.name ?? 'Unknown'} ({report.reporter?.email})
            </p>
            <p className="text-muted-foreground">Target ID: {report.targetId}</p>
            {report.description && <p>{report.description}</p>}
            {report.resolution && <p className="text-xs">Resolution: {report.resolution}</p>}
            {(report.status === 'pending' || report.status === 'reviewed') && (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={mutate.isPending || resolution.trim().length < 3}
                  onClick={() => mutate.mutate({ id: report._id, action: 'resolve' })}
                >
                  Resolve
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={mutate.isPending || resolution.trim().length < 3}
                  onClick={() => mutate.mutate({ id: report._id, action: 'dismiss' })}
                >
                  Dismiss
                </Button>
              </div>
            )}
          </li>
        ))}
        {!query.isLoading && reports.length === 0 && (
          <li className="text-sm text-muted-foreground">No reports for this filter.</li>
        )}
      </ul>
    </div>
  );
}
