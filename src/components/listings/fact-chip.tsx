import { MapPin } from 'lucide-react';

interface FactChipProps {
  icon: typeof MapPin;
  label: string;
  value: string;
}

export function FactChip({ icon: Icon, label, value }: FactChipProps) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-muted/60 px-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold capitalize text-foreground">{value}</p>
      </div>
    </div>
  );
}
