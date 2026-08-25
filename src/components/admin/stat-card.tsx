import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  className?: string;
}

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 shadow-elevated',
        className,
      )}
    >
      <p className="page-eyebrow !normal-case tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums tracking-tight text-primary">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
