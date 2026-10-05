'use client';

import { Button } from '@/components/ui/button';

interface AssistantSuggestionChipsProps {
  suggestions: string[];
  disabled?: boolean;
  onSelect: (suggestion: string) => void;
}

export function AssistantSuggestionChips({
  suggestions,
  disabled,
  onSelect,
}: AssistantSuggestionChipsProps) {
  if (!suggestions.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          className="h-auto max-w-full whitespace-normal px-2.5 py-1 text-left text-xs"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
