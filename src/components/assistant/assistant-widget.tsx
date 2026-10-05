'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

import { AssistantLoginGate } from '@/components/assistant/assistant-login-gate';
import { AssistantPanel } from '@/components/assistant/assistant-panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

export function AssistantWidget() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          className={cn(
            'pointer-events-auto flex w-[min(100vw-1.5rem,400px)] flex-col overflow-hidden rounded-[16px] border border-border bg-background shadow-xl',
            'h-[min(72vh,560px)]',
          )}
        >
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : user ? (
            <AssistantPanel onClose={() => setOpen(false)} />
          ) : (
            <AssistantLoginGate onClose={() => setOpen(false)} />
          )}
        </div>
      ) : null}

      <Button
        type="button"
        size="icon"
        className="pointer-events-auto h-14 w-14 rounded-full shadow-lg"
        aria-label="Open listing assistant"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
