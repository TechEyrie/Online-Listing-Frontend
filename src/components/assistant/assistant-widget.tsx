'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { MessageCircle, X } from 'lucide-react';

import { AssistantLoginGate } from '@/components/assistant/assistant-login-gate';
import { AssistantPanel } from '@/components/assistant/assistant-panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';

const panelShellClass =
  'flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl h-[min(72vh,560px)] max-h-[calc(100dvh-6rem)]';

function AssistantPanelShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(panelShellClass, className)} role="dialog" aria-label="Listing assistant">
      {children}
    </div>
  );
}

function AssistantPanelBody({ onClose }: { onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (user) {
    return <AssistantPanel onClose={onClose} />;
  }

  return <AssistantLoginGate onClose={onClose} />;
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    const mq = window.matchMedia('(max-width: 767px)');
    if (mq.matches) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile: centered modal with backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] md:hidden"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            aria-label="Close listing assistant"
            onClick={close}
          />
          <div className="relative z-10 w-full max-w-md animate-fade-up">
            <AssistantPanelShell>
              <AssistantPanelBody onClose={close} />
            </AssistantPanelShell>
            <button
              type="button"
              onClick={close}
              className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Desktop: docked panel + FAB */}
      <div
        className={cn(
          'pointer-events-none fixed z-50 flex flex-col items-end gap-3',
          'bottom-[calc(4.25rem+env(safe-area-inset-bottom))] right-4',
          'md:bottom-6 md:right-6',
        )}
      >
        {open ? (
          <AssistantPanelShell
            className="pointer-events-auto hidden w-[min(100vw-1.5rem,400px)] md:flex"
          >
            <AssistantPanelBody onClose={close} />
          </AssistantPanelShell>
        ) : null}

        <Button
          type="button"
          size="icon"
          className={cn(
            'pointer-events-auto h-14 w-14 rounded-full shadow-lg',
            open && 'md:ring-2 md:ring-ring md:ring-offset-2 md:ring-offset-background',
          )}
          aria-label={open ? 'Close listing assistant' : 'Open listing assistant'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
