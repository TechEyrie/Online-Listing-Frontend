'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';

import { TransactionTable } from '@/components/payments/transaction-table';
import { Button } from '@/components/ui/button';
import { paymentApi } from '@/lib/payment-api';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['transactions', page],
    queryFn: async () => paymentApi.getTransactions({ page, limit: 10 }),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-page-title">Transactions</h1>
          <p className="text-sm text-muted-foreground">Your promotion payment history</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/my-listings">My listings</Link>
        </Button>
      </div>

      {isLoading && <p className="text-sm">Loading...</p>}
      {isError && <p className="text-sm text-destructive">Could not load transactions.</p>}

      {data && (
        <TransactionTable
          transactions={data.data}
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
