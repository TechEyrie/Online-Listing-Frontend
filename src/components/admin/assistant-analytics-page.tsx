'use client';

import { useQuery } from '@tanstack/react-query';

import { assistantApi } from '@/lib/assistant-api';
import { useAuthStore } from '@/stores/auth-store';

export function AssistantAnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin', 'assistant-analytics'],
    queryFn: () => assistantApi.getAdminAnalytics(),
    enabled: user?.role === 'admin',
  });

  if (user?.role !== 'admin') {
    return (
      <p className="text-sm text-muted-foreground">Assistant analytics are admin-only.</p>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading assistant analytics…</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-destructive">Could not load assistant analytics.</p>;
  }

  const cards = [
    { label: 'Sessions', value: data.totals.sessions },
    { label: 'Active sessions', value: data.totals.activeSessions },
    { label: 'Messages', value: data.totals.messages },
    { label: 'Unique users', value: data.totals.uniqueUsers },
    {
      label: 'Tokens (prompt)',
      value: data.totals.tokensPrompt.toLocaleString(),
    },
    {
      label: 'Tokens (completion)',
      value: data.totals.tokensCompletion.toLocaleString(),
    },
    { label: 'Search replies', value: data.ratios.searchReplies },
    { label: 'Clarifying replies', value: data.ratios.clarifyingReplies },
    { label: 'Avg listings / reply', value: data.ratios.avgListingsPerReply },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-page-title">Assistant analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Usage for the AI listing assistant (OpenRouter).
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[14px] border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Daily messages (30d)</h2>
        {data.dailyMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {data.dailyMessages.map((row) => (
              <li
                key={row.date}
                className="flex items-center justify-between rounded-[10px] border border-border px-3 py-2"
              >
                <span>{row.date}</span>
                <span className="font-medium">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Top search queries</h2>
        {data.topQueries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stored queries yet.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {data.topQueries.map((row) => (
              <li
                key={row.q}
                className="flex items-center justify-between gap-4 rounded-[10px] border border-border px-3 py-2"
              >
                <span className="truncate">{row.q}</span>
                <span className="shrink-0 font-medium">{row.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Recent sessions</h2>
        <div className="overflow-x-auto rounded-[14px] border border-border">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-3 py-2 font-medium">Title</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Messages</th>
                <th className="px-3 py-2 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSessions.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">{row.title}</td>
                  <td className="px-3 py-2">
                    {row.userName || row.userEmail || row.userId}
                  </td>
                  <td className="px-3 py-2">{row.messageCount}</td>
                  <td className="px-3 py-2">
                    {new Date(row.lastMessageAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
