interface TrendChartProps {
  title: string;
  points: Array<{ date: string; total: number; count?: number }>;
  mode?: 'money' | 'count';
  emptyLabel?: string;
}

export function TrendChart({
  title,
  points,
  mode = 'money',
  emptyLabel = 'No data for this period.',
}: TrendChartProps) {
  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const values = points.map((p) => (mode === 'money' ? p.total : (p.count ?? p.total)));
  const max = Math.max(...values, 1);
  const sum = values.reduce((acc, value) => acc + value, 0);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-display font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">
          {mode === 'money' ? `$${sum.toFixed(2)} total` : `${sum} total`} · {points.length} days
        </p>
      </div>
      <div className="flex h-40 items-end gap-1 rounded-lg border border-border bg-background p-3 sm:gap-1.5">
        {points.map((point, index) => {
          const value = mode === 'money' ? point.total : (point.count ?? point.total);
          const tip =
            mode === 'money'
              ? `$${point.total.toFixed(2)} · ${point.count ?? 0} sales · ${point.date}`
              : `${value} · ${point.date}`;
          return (
            <div key={point.date} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div
                className="w-full rounded-t bg-primary/90 transition-opacity hover:opacity-80"
                style={{ height: `${Math.max(4, (value / max) * 100)}%` }}
                title={tip}
              />
              {index % 7 === 0 && (
                <span className="mt-1 hidden truncate text-[9px] text-muted-foreground sm:block">
                  {point.date.slice(5)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {points[0]?.date} → {points[points.length - 1]?.date}
      </p>
    </section>
  );
}
