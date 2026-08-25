import { SearchX } from 'lucide-react';

import { EmptyState } from '@/components/ui/empty-state';

interface NoResultsProps {
  query?: string;
}

export function NoResults({ query }: NoResultsProps) {
  return (
    <EmptyState
      icon={<SearchX className="h-8 w-8" />}
      title="No results found"
      description={
        query
          ? `Nothing matched “${query}”. Try different keywords or clear filters.`
          : 'Try adjusting your filters or search terms.'
      }
      actionLabel="Clear search"
      actionHref="/search"
    />
  );
}
