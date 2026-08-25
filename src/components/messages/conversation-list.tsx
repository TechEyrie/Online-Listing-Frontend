import { ConversationItem } from '@/components/messages/conversation-item';
import type { ConversationPreview } from '@/types/notification';

interface ConversationListProps {
  conversations: ConversationPreview[];
  currentUserId: string;
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
  if (conversations.length === 0) {
    return <p className="text-sm text-muted-foreground">No conversations yet.</p>;
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
