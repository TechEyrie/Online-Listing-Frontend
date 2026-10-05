export type PricingPlanId = 'bump' | 'feature_7' | 'feature_30' | 'premium';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PricingPlan {
  id: PricingPlanId;
  label: string;
  amount: number;
  description: string;
}

export interface CreateIntentResponse {
  clientSecret: string;
  amount: number;
  plan: string;
  planId: PricingPlanId;
  mock: boolean;
  paymentIntentId: string;
}

export interface PaymentTransaction {
  _id: string;
  type: PricingPlanId;
  amount: number;
  currency: string;
  status: TransactionStatus;
  stripePaymentIntentId: string;
  createdAt: string;
  updatedAt: string;
  listing?: {
    _id: string;
    title: string;
    slug: string;
    images?: Array<{ url: string }>;
    isFeatured?: boolean;
  };
}

export interface RevenueStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  totalTransactions: number;
  monthlyTransactions: number;
  weeklyTransactions: number;
  averageOrderValue: number;
  refundedAmount: number;
  refundedCount: number;
  pendingCount: number;
  failedCount: number;
  byPlan: Array<{ plan: string; total: number; count: number }>;
  byStatus: Array<{ status: string; total: number; count: number }>;
  revenueTrend: Array<{ date: string; total: number; count: number }>;
  recentTransactions: PaymentTransaction[];
}
