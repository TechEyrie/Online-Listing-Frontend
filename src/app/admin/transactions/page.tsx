'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useState } from 'react';

import { BreakdownBars } from '@/components/admin/breakdown-bars';
import { StatCard } from '@/components/admin/stat-card';
import { TrendChart } from '@/components/admin/trend-chart';
import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin-api';
import { paymentApi } from '@/lib/payment-api';
import type { ApiErrorResponse } from '@/types/api';

const STATUS_FILTERS = ['all', 'completed', 'pending', 'failed', 'refunded'] as const;

export default function AdminTransactionsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>('all');
  const [page, setPage] = useState(1);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const revenueQuery = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => paymentApi.getRevenueStats(),
  });

  const txsQuery = useQuery({
    queryKey: ['admin-transactions', status, page],
    queryFn: () =>
      adminApi.getTransactions({
        page,
        limit: 20,
        status: status === 'all' ? undefined : status,
      }),
  });

  const refundMutation = useMutation({
    mutationFn: (id: string) => paymentApi.refundTransaction(id),
    onSuccess: () => {
      setActionError(null);
      setActionMessage('Transaction refunded.');
      void queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-revenue'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: unknown) => {
      setActionMessage(null);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setActionError(axiosError.response?.data?.message || 'Refund failed');
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: 'complete' | 'cancel' }) =>
      paymentApi.resolvePending(id, action),
    onSuccess: (_data, vars) => {
      setActionError(null);
      setActionMessage(
        vars.action === 'complete'
          ? 'Pending promotion applied to listing.'
          : 'Pending checkout canceled.',
      );
      void queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-revenue'] });
      void queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
    onError: (err: unknown) => {
      setActionMessage(null);
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setActionError(axiosError.response?.data?.message || 'Could not resolve pending payment');
    },
  });

  const revenue = revenueQuery.data;
  const transactions = txsQuery.data?.data ?? [];
  const meta = txsQuery.data?.meta;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="page-eyebrow">Monetization</p>
          <h1 className="text-page-title mt-1">Revenue analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Promotion payments, plan mix, payment health, and refunds
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/admin">Back to overview</Link>
        </Button>
      </div>

      {revenueQuery.isLoading && <p className="text-sm">Loading revenue...</p>}
      {revenueQuery.isError && (
        <p className="text-sm text-destructive">Could not load revenue stats.</p>
      )}
      {actionMessage && <p className="text-sm text-primary">{actionMessage}</p>}
      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      {revenue && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total revenue"
              value={`$${revenue.totalRevenue.toFixed(2)}`}
              hint={`${revenue.totalTransactions} completed sales`}
            />
            <StatCard
              label="30-day revenue"
              value={`$${revenue.monthlyRevenue.toFixed(2)}`}
              hint={`${revenue.monthlyTransactions} sales`}
            />
            <StatCard
              label="7-day revenue"
              value={`$${revenue.weeklyRevenue.toFixed(2)}`}
              hint={`${revenue.weeklyTransactions} sales`}
            />
            <StatCard
              label="Avg order value"
              value={`$${revenue.averageOrderValue.toFixed(2)}`}
              hint={`Refunded $${revenue.refundedAmount.toFixed(2)} (${revenue.refundedCount})`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Pending payments" value={String(revenue.pendingCount)} />
            <StatCard label="Failed payments" value={String(revenue.failedCount)} />
            <StatCard
              label="Refunded"
              value={String(revenue.refundedCount)}
              hint={`$${revenue.refundedAmount.toFixed(2)}`}
            />
          </div>

          <TrendChart title="Completed revenue (30 days)" points={revenue.revenueTrend} />

          <div className="grid gap-4 lg:grid-cols-2">
            <BreakdownBars
              title="Revenue by plan"
              rows={revenue.byPlan.map((row) => ({
                label: row.plan.replace(/_/g, ' '),
                value: row.total,
                hint: `${row.count} sales`,
              }))}
              formatValue={(value) => `$${value.toFixed(2)}`}
              emptyLabel="No completed payments yet."
            />
            <BreakdownBars
              title="Transactions by status"
              rows={revenue.byStatus.map((row) => ({
                label: row.status,
                value: row.count,
                hint: `$${row.total.toFixed(2)}`,
              }))}
            />
          </div>
        </>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display font-semibold">Transaction ledger</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <Button
                key={filter}
                type="button"
                size="sm"
                variant={status === filter ? 'default' : 'outline'}
                onClick={() => {
                  setStatus(filter);
                  setPage(1);
                }}
              >
                {filter}
              </Button>
            ))}
            <Button type="button" size="sm" variant="ghost" onClick={() => void txsQuery.refetch()}>
              Refresh
            </Button>
          </div>
        </div>

        {txsQuery.isLoading && <p className="text-sm">Loading transactions...</p>}
        {txsQuery.isError && (
          <p className="text-sm text-destructive">Could not load transactions.</p>
        )}

        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-soft">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Listing</th>
                <th className="px-3 py-2 font-medium">Plan</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-border/70">
                  <td className="px-3 py-2">
                    <p className="font-medium">{tx.user?.name ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">{tx.user?.email}</p>
                  </td>
                  <td className="px-3 py-2">
                    {tx.listing?.slug ? (
                      <Link
                        href={`/listings/${tx.listing.slug}`}
                        className="text-primary hover:underline"
                      >
                        {tx.listing.title}
                      </Link>
                    ) : (
                      (tx.listing?.title ?? '—')
                    )}
                  </td>
                  <td className="px-3 py-2 capitalize">{tx.type.replace(/_/g, ' ')}</td>
                  <td className="px-3 py-2 tabular-nums">${(tx.amount / 100).toFixed(2)}</td>
                  <td className="px-3 py-2 capitalize">{tx.status}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    {tx.status === 'completed' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={refundMutation.isPending || resolveMutation.isPending}
                        onClick={() => {
                          if (
                            window.confirm(
                              'Refund this payment and revoke feature if applicable?',
                            )
                          ) {
                            refundMutation.mutate(tx._id);
                          }
                        }}
                      >
                        Refund
                      </Button>
                    ) : tx.status === 'pending' ? (
                      <div className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          size="sm"
                          disabled={resolveMutation.isPending}
                          onClick={() => {
                            if (
                              window.confirm(
                                'Apply this bump/feature now and mark payment completed?',
                              )
                            ) {
                              resolveMutation.mutate({ id: tx._id, action: 'complete' });
                            }
                          }}
                        >
                          Apply
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={resolveMutation.isPending}
                          onClick={() =>
                            resolveMutation.mutate({ id: tx._id, action: 'cancel' })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && !txsQuery.isLoading && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                    No transactions for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              Page {meta.page} of {meta.totalPages} · {meta.total} total
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
