'use client';

import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';

import { ConversationList } from '@/components/messages/conversation-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { messageApi } from '@/lib/message-api';
import { useAuthStore } from '@/stores/auth-store';

export default function MessagesPage() {
  const user = useAuthStore((s) => s.user);
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messageApi.listConversations(),
    enabled: Boolean(user),
    refetchInterval: 30_000,
  });

  const conversations = query.data ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-page-title">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Buyer and seller conversations</p>
      </div>
      {query.isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      )}
      {query.isError && (
        <p className="text-sm text-destructive">Could not load conversations.</p>
      )}
      {!query.isLoading && !query.isError && conversations.length === 0 && (
        <EmptyState
          icon={<MessageSquare className="h-8 w-8" />}
          title="No conversations yet"
          description="Contact a seller from a listing to start a message thread."
          actionLabel="Browse listings"
          actionHref="/search"
        />
      )}
      {user && conversations.length > 0 && (
        <ConversationList conversations={conversations} currentUserId={user._id} />
      )}
    </div>
  );
}
