interface LocationBadgeProps {
  city: string;
  state?: string;
  country?: string;
}

export function LocationBadge({ city, state, country }: LocationBadgeProps) {
  const parts = [city, state, country].filter(Boolean);
  return <span className="text-sm text-muted-foreground">{parts.join(', ')}</span>;
}
