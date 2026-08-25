import Link from 'next/link';

import type { ConversationPreview } from '@/types/notification';

interface ConversationItemProps {
  conversation: ConversationPreview;
  currentUserId: string;
}

export function ConversationItem({ conversation, currentUserId }: ConversationItemProps) {
  const other = conversation.participants.find((p) => p._id !== currentUserId);
  return (
    <Link
      href={`/messages/${conversation._id}`}
      className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-primary/30 hover:bg-primary-subtle"
    >
      <div className="min-w-0">
        <p className="font-display font-semibold">{other?.name ?? 'Conversation'}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground/80">
          {conversation.listing?.title ?? 'Listing'}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {conversation.lastMessage?.content ?? 'No messages yet'}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="rounded-[8px] bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          {conversation.unreadCount}
        </span>
      )}
    </Link>
  );
}
