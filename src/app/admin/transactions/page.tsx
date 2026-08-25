'use client';

import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { adminApi } from '@/lib/admin-api';
import { paymentApi } from '@/lib/payment-api';

export default function AdminTransactionsPage() {
  const revenueQuery = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => paymentApi.getRevenueStats(),
  });

  const txsQuery = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: () => adminApi.getTransactions({ page: 1, limit: 50 }),
  });

  const revenue = revenueQuery.data;
  const transactions = txsQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-page-title">Revenue</h1>
        <p className="text-sm text-muted-foreground">Promotion payments and transaction history</p>
      </div>

      {revenueQuery.isLoading && <p className="text-sm">Loading revenue...</p>}
      {revenueQuery.isError && (
        <p className="text-sm text-destructive">Could not load revenue stats.</p>
      )}

      {revenue && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total revenue" value={`$${revenue.totalRevenue.toFixed(2)}`} />
          <Stat label="30-day revenue" value={`$${revenue.monthlyRevenue.toFixed(2)}`} />
          <Stat label="Total sales" value={String(revenue.totalTransactions)} />
          <Stat label="30-day sales" value={String(revenue.monthlyTransactions)} />
        </div>
      )}

      {revenue && (
        <section className="space-y-2">
          <h2 className="font-medium">By plan</h2>
          <ul className="space-y-1 text-sm">
            {revenue.byPlan.map((row) => (
              <li key={row.plan} className="flex justify-between border-b py-2">
                <span>{row.plan}</span>
                <span>
                  ${row.total.toFixed(2)} ({row.count})
                </span>
              </li>
            ))}
            {revenue.byPlan.length === 0 && (
              <li className="text-muted-foreground">No completed payments yet.</li>
            )}
          </ul>
        </section>
      )}

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">All transactions</h2>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void txsQuery.refetch()}
          >
            Refresh
          </Button>
        </div>
        {txsQuery.isLoading && <p className="text-sm">Loading transactions...</p>}
        <div className="overflow-x-auto rounded-lg border bg-background">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Listing</th>
                <th className="px-3 py-2">Plan</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b">
                  <td className="px-3 py-2">{tx.user?.name ?? '—'}</td>
                  <td className="px-3 py-2">{tx.listing?.title ?? '—'}</td>
                  <td className="px-3 py-2">{tx.type}</td>
                  <td className="px-3 py-2">${(tx.amount / 100).toFixed(2)}</td>
                  <td className="px-3 py-2">{tx.status}</td>
                  <td className="px-3 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
