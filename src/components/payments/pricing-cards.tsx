'use client';

import type { PricingPlan, PricingPlanId } from '@/types/payment';

interface PricingCardsProps {
  plans: PricingPlan[];
  selected: PricingPlanId | null;
  onSelect: (planId: PricingPlanId) => void;
}

const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export function PricingCards({ plans, selected, onSelect }: PricingCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {plans.map((plan) => {
        const isSelected = selected === plan.id;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onSelect(plan.id)}
            className={`rounded-xl border p-5 text-left shadow-soft transition duration-fast ${
              isSelected
                ? 'border-accent bg-accent-soft ring-2 ring-accent'
                : 'border-border bg-card hover:border-primary/40 hover:shadow-elevated'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display font-semibold text-foreground">{plan.label}</h3>
              <span className="font-display text-lg font-bold text-primary">{formatUsd(plan.amount)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
          </button>
        );
      })}
    </div>
  );
}
