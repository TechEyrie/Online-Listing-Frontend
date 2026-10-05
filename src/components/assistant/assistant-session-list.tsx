'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AssistantSession } from '@/types/assistant';

interface AssistantSessionListProps {
  sessions: AssistantSession[];
  activeId?: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function AssistantSessionList({
  sessions,
  activeId,
  onSelect,
  onNew,
}: AssistantSessionListProps) {
  return (
    <div className="flex h-full flex-col border-r border-border bg-muted/20">
      <div className="border-b border-border p-2">
        <Button type="button" size="sm" className="w-full" onClick={onNew}>
          New chat
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <li className="px-2 py-4 text-center text-xs text-muted-foreground">No chats yet</li>
        ) : (
          sessions.map((session) => (
            <li key={session._id}>
              <button
                type="button"
                onClick={() => onSelect(session._id)}
                className={cn(
                  'mb-1 w-full rounded-[10px] px-2 py-2 text-left text-xs transition hover:bg-muted',
                  activeId === session._id && 'bg-primary-soft font-semibold text-primary',
                )}
              >
                <span className="line-clamp-2">{session.title}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
