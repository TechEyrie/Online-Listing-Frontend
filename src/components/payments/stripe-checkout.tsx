'use client';

import { useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';

import { Button } from '@/components/ui/button';

let stripePromiseCache: Promise<Stripe | null> | null = null;

const getStripePromise = (): Promise<Stripe | null> | null => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  if (!publishableKey || publishableKey.includes('your-') || !publishableKey.startsWith('pk_')) {
    return null;
  }
  if (!stripePromiseCache) {
    stripePromiseCache = loadStripe(publishableKey);
  }
  return stripePromiseCache;
};

const paymentIntentIdFromClientSecret = (clientSecret: string): string | null => {
  const idx = clientSecret.indexOf('_secret');
  if (idx <= 0) return null;
  return clientSecret.slice(0, idx);
};

interface StripeCheckoutProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (message: string) => void;
}

function CheckoutForm({
  clientSecret,
  onSuccess,
  onError,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      onError(result.error.message || 'Payment failed');
      setSubmitting(false);
      return;
    }

    const paymentIntentId =
      result.paymentIntent?.id || paymentIntentIdFromClientSecret(clientSecret);
    if (!paymentIntentId) {
      onError('Payment succeeded but payment intent id is missing');
      setSubmitting(false);
      return;
    }

    if (result.paymentIntent && result.paymentIntent.status !== 'succeeded') {
      onError(`Payment status is ${result.paymentIntent.status}. Please try again.`);
      setSubmitting(false);
      return;
    }

    onSuccess(paymentIntentId);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || submitting} className="w-full">
        {submitting ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  );
}

export function StripeCheckout({ clientSecret, onSuccess, onError }: StripeCheckoutProps) {
  const stripePromise = useMemo(() => getStripePromise(), []);
  const keyPreview = (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '').slice(0, 7);

  if (!stripePromise) {
    return (
      <p className="text-sm text-muted-foreground">
        Stripe publishable key is not configured on the client (got “{keyPreview || 'empty'}…”).
        Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in the root .env and restart the Next.js server.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
