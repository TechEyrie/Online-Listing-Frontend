'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface AssistantLoginGateProps {
  onClose: () => void;
}

export function AssistantLoginGate({ onClose }: AssistantLoginGateProps) {
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname || '/');

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="font-display text-xl font-bold text-foreground">Listing assistant</h2>
      <p className="max-w-xs text-sm text-muted-foreground">
        Log in to ask for what you need and get up to 5 matching listings with links.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button asChild>
          <Link href={`/login?redirect=${redirect}`}>Log in to use</Link>
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
