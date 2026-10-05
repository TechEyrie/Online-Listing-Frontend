import {
  DEFAULT_LISTING_CURRENCY,
  getCurrencyLocale,
  isListingCurrency,
  type ListingCurrency,
} from '@/lib/location-currency';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  priceType: 'fixed' | 'negotiable' | 'free' | 'contact';
  currency?: string;
  className?: string;
}

export function PriceDisplay({ price, priceType, currency, className }: PriceDisplayProps) {
  const type = priceType ?? 'fixed';
  if (type === 'free') {
    return <p className={cn('text-price text-success', className)}>Free</p>;
  }
  if (type === 'contact') {
    return (
      <p className={cn('font-display text-base font-bold text-foreground', className)}>
        Contact for price
      </p>
    );
  }

  const code: ListingCurrency =
    currency && isListingCurrency(currency) ? currency : DEFAULT_LISTING_CURRENCY;
  const locale = getCurrencyLocale(code);

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: 0,
  }).format(price ?? 0);

  return (
    <p className={cn('text-price', className)}>
      {formatted}
      {type === 'negotiable' && (
        <span className="ml-2 text-xs font-semibold opacity-80">Negotiable</span>
      )}
    </p>
  );
}
