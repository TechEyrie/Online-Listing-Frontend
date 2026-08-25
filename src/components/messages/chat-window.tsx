'use client';

import { useEffect, useRef } from 'react';

import { MessageBubble } from '@/components/messages/message-bubble';
import { MessageInput } from '@/components/messages/message-input';
import type { ChatMessage } from '@/types/notification';

interface ChatWindowProps {
  messages: ChatMessage[];
  currentUserId: string;
  onSend: (content: string) => void;
  sending?: boolean;
}

export function ChatWindow({ messages, currentUserId, onSend, sending }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex h-[70vh] flex-col rounded-lg border bg-background">
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} currentUserId={currentUserId} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="border-t p-3">
        <MessageInput onSend={onSend} disabled={sending} />
      </div>
    </div>
  );
}
