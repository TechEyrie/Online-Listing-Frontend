'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { PricingCards } from '@/components/payments/pricing-cards';
import { StripeCheckout } from '@/components/payments/stripe-checkout';
import { Button } from '@/components/ui/button';
import { listingApi } from '@/lib/listing-api';
import { paymentApi } from '@/lib/payment-api';
import type { ApiErrorResponse } from '@/types/api';
import type { CreateIntentResponse, PricingPlanId } from '@/types/payment';

export default function PromoteListingPage() {
  const params = useParams<{ listingId: string }>();
  const listingId = params.listingId;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlanId | null>(null);
  const [intent, setIntent] = useState<CreateIntentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [applying, setApplying] = useState(false);

  const listingQuery = useQuery({
    queryKey: ['listing-id', listingId],
    queryFn: async () => {
      const res = await listingApi.getById(listingId);
      return res.data;
    },
    enabled: Boolean(listingId),
  });

  const plansQuery = useQuery({
    queryKey: ['payment-plans'],
    queryFn: () => paymentApi.getPlans(),
  });

  const invalidateAfterPromotion = async () => {
    await queryClient.invalidateQueries({ queryKey: ['my-listings'] });
    await queryClient.invalidateQueries({ queryKey: ['transactions'] });
    await queryClient.invalidateQueries({ queryKey: ['listing-id', listingId] });
    await queryClient.invalidateQueries({ queryKey: ['listings'] });
    if (listingQuery.data?.slug) {
      await queryClient.invalidateQueries({ queryKey: ['listing', listingQuery.data.slug] });
    }
  };

  // Recover promotions when Stripe charged but webhook never applied featuring.
  useEffect(() => {
    if (!listingId) return;
    let cancelled = false;
    void (async () => {
      try {
        const results = await paymentApi.syncListing(listingId);
        if (cancelled) return;
        if (results.some((row) => row.applied)) {
          await invalidateAfterPromotion();
          await listingQuery.refetch();
        }
      } catch {
        // Non-blocking recovery
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per listingId
  }, [listingId]);

  const createIntentMutation = useMutation({
    mutationFn: async (plan: PricingPlanId) => paymentApi.createIntent(listingId, plan),
    onSuccess: (data) => {
      setError(null);
      setIntent(data);
    },
    onError: (err: unknown) => {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not start checkout');
    },
  });

  const applyPromotionFromPayment = async (paymentIntentId: string) => {
    setApplying(true);
    setError(null);
    try {
      await paymentApi.confirm(paymentIntentId);
      setSuccess(true);
      await invalidateAfterPromotion();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(
        axiosError.response?.data?.message ||
          'Payment received but promotion could not be applied. Open this page again to retry.',
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-page-title">Promote listing</h1>
          <p className="text-sm text-muted-foreground">
            {listingQuery.data?.title || 'Loading listing...'}
          </p>
          {listingQuery.data?.isFeatured && (
            <p className="mt-1 text-sm text-accent">
              Currently featured
              {listingQuery.data.featuredUntil
                ? ` until ${new Date(listingQuery.data.featuredUntil).toLocaleString()}`
                : ''}
            </p>
          )}
        </div>
        <Button asChild variant="outline">
          <Link href="/my-listings">Back</Link>
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {success ? (
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="text-lg font-semibold">Payment successful</h2>
          <p className="text-sm text-muted-foreground">
            Your promotion has been applied. Featured listings show a badge until expiry.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => router.push('/dashboard/transactions')}>
              View transactions
            </Button>
            {listingQuery.data?.slug ? (
              <Button asChild variant="outline">
                <Link href={`/listings/${listingQuery.data.slug}`}>View listing</Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/my-listings">My listings</Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="font-medium">Choose a plan</h2>
            {plansQuery.isLoading && <p className="text-sm">Loading plans...</p>}
            {plansQuery.data && (
              <PricingCards
                plans={plansQuery.data}
                selected={selectedPlan}
                onSelect={(plan) => {
                  setSelectedPlan(plan);
                  setIntent(null);
                }}
              />
            )}
            <Button
              type="button"
              disabled={!selectedPlan || createIntentMutation.isPending}
              onClick={() => selectedPlan && createIntentMutation.mutate(selectedPlan)}
            >
              {createIntentMutation.isPending ? 'Preparing checkout...' : 'Continue to checkout'}
            </Button>
          </section>

          {intent && (
            <section className="space-y-3 rounded-lg border p-4">
              <h2 className="font-medium">Checkout — {intent.plan}</h2>
              <p className="text-sm text-muted-foreground">
                Amount: ${(intent.amount / 100).toFixed(2)}
              </p>

              {applying && (
                <p className="text-sm text-muted-foreground">Applying promotion to your listing…</p>
              )}

              {intent.mock ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Stripe is not configured locally. Complete a mock payment to apply the
                    promotion (same path as a successful webhook).
                  </p>
                  <Button
                    type="button"
                    disabled={applying}
                    onClick={() => void applyPromotionFromPayment(intent.paymentIntentId)}
                  >
                    {applying ? 'Confirming...' : 'Complete test payment'}
                  </Button>
                </div>
              ) : (
                <StripeCheckout
                  clientSecret={intent.clientSecret}
                  onSuccess={(paymentIntentId) => void applyPromotionFromPayment(paymentIntentId)}
                  onError={setError}
                />
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
