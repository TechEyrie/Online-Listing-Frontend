import { MobileNav } from '@/components/layout/mobile-nav';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';

interface PublicShellProps {
  children: React.ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-16 md:pb-0">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <MobileNav />
    </div>
  );
}
