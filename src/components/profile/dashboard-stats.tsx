'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types/user';

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsProps) {
  const items = [
    { label: 'Active listings', value: stats.activeListings },
    { label: 'Total views', value: stats.totalViews },
    { label: 'Total favorites', value: stats.totalFavorites },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="shadow-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="page-eyebrow !normal-case tracking-wide text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold tabular-nums tracking-tight text-primary">
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
