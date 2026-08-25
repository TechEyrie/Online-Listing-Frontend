'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState('');

  const submit = () => {
    const trimmed = content.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setContent('');
  };

  return (
    <div className="flex gap-2">
      <textarea
        className="min-h-12 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        value={content}
        maxLength={2000}
        disabled={disabled}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Write a message..."
      />
      <Button type="button" disabled={disabled || content.trim().length === 0} onClick={submit}>
        Send
      </Button>
    </div>
  );
}
