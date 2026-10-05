interface BreakdownBarsProps {
  title: string;
  rows: Array<{ label: string; value: number; hint?: string }>;
  emptyLabel?: string;
  formatValue?: (value: number) => string;
}

export function BreakdownBars({
  title,
  rows,
  emptyLabel = 'No data yet.',
  formatValue = (value) => String(value),
}: BreakdownBarsProps) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <h2 className="mb-3 font-display font-semibold">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-medium capitalize">{row.label}</span>
                <span className="shrink-0 tabular-nums font-semibold text-primary">
                  {formatValue(row.value)}
                  {row.hint ? (
                    <span className="ml-1 font-normal text-muted-foreground">({row.hint})</span>
                  ) : null}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
