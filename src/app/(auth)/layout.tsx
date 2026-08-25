import { BrandLogo } from '@/components/layout/brand-logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden surface-hero px-4 py-10">
      <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div>
      <BrandLogo size="xl" className="relative z-10 mb-8" priority />
      <div className="relative z-10 w-full max-w-md animate-fade-up">{children}</div>
    </div>
  );
}
