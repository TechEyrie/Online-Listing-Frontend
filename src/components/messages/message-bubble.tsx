import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/notification';

interface MessageBubbleProps {
  message: ChatMessage;
  currentUserId: string;
}

export function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const senderId = typeof message.sender === 'string' ? message.sender : message.sender._id;
  const mine = senderId === currentUserId;
  const name = typeof message.sender === 'string' ? '' : message.sender.name;

  return (
    <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] rounded-[14px] px-3.5 py-2.5 text-sm shadow-soft',
          mine ? 'rounded-br-[6px] bg-primary text-primary-foreground' : 'rounded-bl-[6px] bg-muted text-foreground',
        )}
      >
        {!mine && name && <p className="mb-1 text-xs font-semibold opacity-80">{name}</p>}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className="mt-1.5 text-[10px] font-medium opacity-70">
          {new Date(message.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
