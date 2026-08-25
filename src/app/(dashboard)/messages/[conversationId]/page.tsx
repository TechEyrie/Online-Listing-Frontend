'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { messageApi } from '@/lib/message-api';
import { useAuthStore } from '@/stores/auth-store';

const ChatWindow = dynamic(
  () =>
    import('@/components/messages/chat-window').then((mod) => ({
      default: mod.ChatWindow,
    })),
  {
    loading: () => (
      <div className="flex h-[70vh] items-center justify-center rounded-lg border text-sm text-muted-foreground">
        Loading chat...
      </div>
    ),
    ssr: false,
  },
);

export default function ConversationPage() {
  const params = useParams<{ conversationId: string }>();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const conversationId = params.conversationId;

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messageApi.getMessages(conversationId),
    enabled: Boolean(user && conversationId),
    refetchInterval: 30_000,
  });

  const send = useMutation({
    mutationFn: (content: string) => messageApi.sendMessage(conversationId, content),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      await queryClient.invalidateQueries({ queryKey: ['conversations'] });
      await queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  return (
    <div className="space-y-4">
      <Link href="/messages" className="text-sm underline">
        Back to messages
      </Link>
      <h1 className="text-page-title">Conversation</h1>
      {query.isLoading && <p className="text-sm">Loading messages...</p>}
      {query.isError && <p className="text-sm text-destructive">Could not load this conversation.</p>}
      {user && query.data && (
        <ChatWindow
          messages={query.data}
          currentUserId={user._id}
          onSend={(content) => send.mutate(content)}
          sending={send.isPending}
        />
      )}
    </div>
  );
}
