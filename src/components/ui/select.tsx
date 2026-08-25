import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SelectProps extends React.ComponentProps<'select'> {
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, placeholder, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          className={cn(
            'field-control appearance-none pr-10',
            className,
          )}
          ref={ref}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled={props.required}>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
      </div>
    );
  },
);
Select.displayName = 'Select';

export { Select };
