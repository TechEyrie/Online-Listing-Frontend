'use client';

import { AssistantListingCards } from '@/components/assistant/assistant-listing-cards';
import { AssistantSuggestionChips } from '@/components/assistant/assistant-suggestion-chips';
import { cn } from '@/lib/utils';
import type { AssistantMessage } from '@/types/assistant';

interface AssistantMessageBubbleProps {
  message: AssistantMessage;
  isStreaming?: boolean;
  onSuggestion?: (text: string) => void;
  suggestionsDisabled?: boolean;
}

export function AssistantMessageBubble({
  message,
  isStreaming,
  onSuggestion,
  suggestionsDisabled,
}: AssistantMessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[92%] rounded-[14px] px-3 py-2 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-card text-foreground',
        )}
      >
        <p className="whitespace-pre-wrap">{message.content || (isStreaming ? '…' : '')}</p>
        {!isUser && message.listings ? (
          <AssistantListingCards listings={message.listings} />
        ) : null}
        {!isUser && message.suggestions && onSuggestion ? (
          <AssistantSuggestionChips
            suggestions={message.suggestions}
            disabled={suggestionsDisabled}
            onSelect={onSuggestion}
          />
        ) : null}
      </div>
    </div>
  );
}
