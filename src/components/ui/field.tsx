import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-0.5 text-accent">*</span> : null}
        </Label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
