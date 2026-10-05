'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface AssistantInputProps {
  disabled?: boolean;
  onSend: (content: string) => void;
}

export function AssistantInput({ disabled, onSend }: AssistantInputProps) {
  const [value, setValue] = useState('');

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="border-t border-border p-3">
      <Textarea
        value={value}
        disabled={disabled}
        rows={2}
        placeholder="Describe what you need…"
        className="min-h-[64px] resize-none"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="mt-2 flex justify-end">
        <Button type="button" size="sm" disabled={disabled || !value.trim()} onClick={submit}>
          Send
        </Button>
      </div>
    </div>
  );
}
