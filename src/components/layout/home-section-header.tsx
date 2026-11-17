import { cn } from '@/lib/utils';

interface HomeSectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** Shared homepage section title block — consistent spacing at all breakpoints. */
export function HomeSectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="max-w-2xl space-y-2">
        <p className="page-eyebrow">{eyebrow}</p>
        <h2 className="text-section-title">{title}</h2>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}