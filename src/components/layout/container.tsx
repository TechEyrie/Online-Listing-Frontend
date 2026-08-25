import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'main' | 'section';
}

export function Container({ children, className, as: Comp = 'div' }: ContainerProps) {
  return (
    <Comp className={cn('mx-auto w-full max-w-app px-4 sm:px-6 lg:px-8', className)}>{children}</Comp>
  );
}
