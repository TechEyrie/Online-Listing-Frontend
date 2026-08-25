interface RevenueChartProps {
  points: Array<{ date: string; total: number }>;
}

export function RevenueChart({ points }: RevenueChartProps) {
  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">No recent revenue.</p>;
  }

  const max = Math.max(...points.map((p) => p.total), 1);

  return (
    <div className="space-y-2">
      <h2 className="font-medium">Revenue (14 days)</h2>
      <div className="flex h-40 items-end gap-2 rounded-lg border bg-background p-3">
        {points.map((point) => (
          <div key={point.date} className="flex h-full flex-1 flex-col justify-end">
            <div
              className="w-full rounded-t bg-primary"
              style={{ height: `${Math.max(6, (point.total / max) * 100)}%` }}
              title={`$${point.total.toFixed(2)} on ${point.date}`}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {points[0]?.date} → {points[points.length - 1]?.date}
      </p>
    </div>
  );
}
