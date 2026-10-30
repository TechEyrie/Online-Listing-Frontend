import { PublicShell } from '@/components/layout/public-shell';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <PublicShell>
      <div className="surface-hero relative flex min-h-[calc(100dvh-8rem)] flex-col items-center justify-center overflow-hidden bg-primary-subtle px-4 py-10">
        <div className="relative z-10 w-full max-w-md animate-fade-up">{children}</div>
      </div>
    </PublicShell>
  );
}
