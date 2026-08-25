'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import type { PaymentTransaction } from '@/types/payment';

interface TransactionTableProps {
  transactions: PaymentTransaction[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function TransactionTable({
  transactions,
  page,
  totalPages,
  onPageChange,
}: TransactionTableProps) {
  if (!transactions.length) {
    return <p className="text-sm text-muted-foreground">No transactions yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2 font-medium">Listing</th>
              <th className="px-3 py-2 font-medium">Plan</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="border-t">
                <td className="px-3 py-2">
                  {tx.listing?.slug ? (
                    <Link href={`/listings/${tx.listing.slug}`} className="underline">
                      {tx.listing.title}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-3 py-2">{tx.type}</td>
                <td className="px-3 py-2">{formatUsd(tx.amount)}</td>
                <td className="px-3 py-2 capitalize">{tx.status}</td>
                <td className="px-3 py-2">{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
