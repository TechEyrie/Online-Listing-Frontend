import { TrendChart } from '@/components/admin/trend-chart';

/** @deprecated Prefer TrendChart — kept for existing imports */
interface RevenueChartProps {
  points: Array<{ date: string; total: number; count?: number }>;
}

export function RevenueChart({ points }: RevenueChartProps) {
  return <TrendChart title="Revenue (30 days)" points={points} mode="money" />;
}
