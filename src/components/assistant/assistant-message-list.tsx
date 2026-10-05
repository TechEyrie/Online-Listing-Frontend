'use client';

import { useEffect, useRef, useState } from 'react';

import { AssistantMessageBubble } from '@/components/assistant/assistant-message-bubble';
import type { AssistantMessage } from '@/types/assistant';

const PHASE_MESSAGES: Record<string, string[]> = {
  thinking: [
    'Got it. Reading your request…',
    'Understanding what you need…',
    'Figuring out the best search…',
    'Analysing your request…',
  ],
  searching: [
    'Searching Suqora for matching listings…',
    'Scanning the marketplace…',
    'Looking through active listings…',
    'Finding the best matches in Qatar…',
  ],
  composing: [
    'Picking the top results for you…',
    'Putting together your answer…',
    'Almost there — composing reply…',
    'Selecting the best listings…',
  ],
};

const EXAMPLES = [
  'Used Toyota under QAR 50,000 in Doha',
  '2-bedroom apartment for rent in Lusail',
  'iPhone 15 Pro, max budget 3500',
];

interface AssistantMessageListProps {
  messages: AssistantMessage[];
  streamingId?: string | null;
  phase?: string | null;
  onSuggestion: (text: string) => void;
  suggestionsDisabled?: boolean;
  onExample: (text: string) => void;
}

export function AssistantMessageList({
  messages,
  streamingId,
  phase,
  onSuggestion,
  suggestionsDisabled,
  onExample,
}: AssistantMessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  const [msgIdx, setMsgIdx] = useState(0);

  // Rotate status message every 3 seconds while a phase is active
  useEffect(() => {
    if (!phase) {
      setMsgIdx(0);
      return;
    }
    const msgs = PHASE_MESSAGES[phase] ?? [];
    if (msgs.length <= 1) return;
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % msgs.length);
    }, 3000);
    return () => clearInterval(id);
  }, [phase]);

  // Reset index when phase changes so we always start from the first message
  useEffect(() => {
    setMsgIdx(0);
  }, [phase]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, phase]);

  if (!messages.length) {
    return (
      <div className="flex h-full flex-col justify-center gap-3 p-4">
        <p className="text-sm text-muted-foreground">
          Tell me what you need — I will search Suqora and show up to 5 listings.
        </p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              className="rounded-[10px] border border-border px-3 py-2 text-left text-xs hover:bg-muted"
              onClick={() => onExample(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-3">
      {messages.map((message) => (
        <AssistantMessageBubble
          key={message._id}
          message={message}
          isStreaming={streamingId === message._id}
          onSuggestion={message.role === 'assistant' ? onSuggestion : undefined}
          suggestionsDisabled={suggestionsDisabled}
        />
      ))}
      {phase ? (
        <p
          key={`${phase}-${msgIdx}`}
          className="animate-fade-in text-xs text-muted-foreground transition-opacity duration-500"
        >
          {(PHASE_MESSAGES[phase] ?? [])[msgIdx] ?? '…'}
        </p>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}
