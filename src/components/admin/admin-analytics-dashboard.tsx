'use client';

import Link from 'next/link';

import { BreakdownBars } from '@/components/admin/breakdown-bars';
import { StatCard } from '@/components/admin/stat-card';
import { TrendChart } from '@/components/admin/trend-chart';
import { Button } from '@/components/ui/button';
import type { DashboardStats } from '@/types/admin';

interface AdminAnalyticsDashboardProps {
  data: DashboardStats;
}

const money = (value: number) => `$${value.toFixed(2)}`;

const recordToRows = (record: Record<string, number>) =>
  Object.entries(record)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

export function AdminAnalyticsDashboard({ data }: AdminAnalyticsDashboardProps) {
  const activeListings = data.listings.active ?? 0;
  const soldListings = data.listings.sold ?? 0;
  const conversion =
    activeListings + soldListings > 0
      ? ((soldListings / (activeListings + soldListings)) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="page-eyebrow">Control center</p>
          <h1 className="text-page-title mt-1">Platform analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Users, listings (ads), engagement, reviews, and revenue in one place
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/users">Users</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/listings">Listings</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/transactions">Revenue detail</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={String(data.totalUsers)}
          hint={`+${data.userHealth.newLast7Days} this week · +${data.userHealth.newLast30Days} / 30d`}
        />
        <StatCard
          label="Total listings"
          value={String(data.totalListings)}
          hint={`${activeListings} active · ${soldListings} sold (${conversion}% sold rate)`}
        />
        <StatCard
          label="Completed revenue"
          value={money(data.revenue.total)}
          hint={`${data.revenue.transactions} sales · AOV ${money(data.revenue.averageOrderValue)}`}
        />
        <StatCard
          label="Pending reports"
          value={String(data.pendingReports)}
          hint={`Reviews pending: ${data.reviews.pending} · avg ${data.reviews.averageRating || 0}/5`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Listing views"
          value={data.listingEngagement.totalViews.toLocaleString()}
          hint={`Avg ${data.listingEngagement.avgViews} views / listing`}
        />
        <StatCard
          label="Favorites"
          value={data.listingEngagement.totalFavorites.toLocaleString()}
          hint={`Featured live: ${data.listingEngagement.featuredActive}`}
        />
        <StatCard
          label="Avg listing price"
          value={money(data.listingEngagement.avgPrice)}
          hint="Across all ads in catalog"
        />
        <StatCard
          label="ARPU"
          value={money(data.revenue.arpu)}
          hint="Revenue per registered user"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TrendChart title="Revenue (30 days)" points={data.revenueTrend} mode="money" />
        <TrendChart title="New users (30 days)" points={data.usersTrend} mode="count" />
        <TrendChart title="New listings (30 days)" points={data.listingsTrend} mode="count" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <BreakdownBars title="Users by role" rows={recordToRows(data.users)} />
        <BreakdownBars
          title="User health"
          rows={[
            { label: 'Banned', value: data.userHealth.banned },
            { label: 'Inactive', value: data.userHealth.inactive },
            { label: 'Unverified email', value: data.userHealth.unverified },
          ]}
        />
        <BreakdownBars title="Listings by status" rows={recordToRows(data.listings)} />
        <BreakdownBars title="Listings by type" rows={recordToRows(data.listingsByType)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BreakdownBars
          title="Top categories"
          rows={data.listingsByCategory.map((row) => ({
            label: row.name,
            value: row.count,
          }))}
        />
        <BreakdownBars
          title="Revenue by payment status"
          rows={data.revenueByStatus.map((row) => ({
            label: row.status,
            value: row.total,
            hint: `${row.count} tx`,
          }))}
          formatValue={money}
        />
        <BreakdownBars title="Reports by status" rows={recordToRows(data.reports)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display font-semibold">Top listings by views</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/listings">Manage</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 pr-2 font-medium">Ad</th>
                  <th className="py-2 pr-2 font-medium">Status</th>
                  <th className="py-2 pr-2 font-medium">Views</th>
                  <th className="py-2 pr-2 font-medium">Favs</th>
                  <th className="py-2 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {data.topListings.map((listing) => (
                  <tr key={listing._id} className="border-b border-border/70">
                    <td className="py-2 pr-2">
                      <Link
                        href={`/listings/${listing.slug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {listing.title}
                      </Link>
                      {listing.isFeatured ? (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-amber-700 dark:text-amber-400">
                          Featured
                        </span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-2 capitalize">{listing.status}</td>
                    <td className="py-2 pr-2 tabular-nums">{listing.viewCount}</td>
                    <td className="py-2 pr-2 tabular-nums">{listing.favoriteCount}</td>
                    <td className="py-2 tabular-nums">
                      {listing.currency} {listing.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.topListings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-muted-foreground">
                      No listings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-display font-semibold">Top sellers by ads</h2>
            <Button asChild size="sm" variant="ghost">
              <Link href="/admin/users">Manage</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground">
                <tr>
                  <th className="py-2 pr-2 font-medium">Seller</th>
                  <th className="py-2 pr-2 font-medium">Listings</th>
                  <th className="py-2 font-medium">Views</th>
                </tr>
              </thead>
              <tbody>
                {data.topSellers.map((seller) => (
                  <tr key={seller._id} className="border-b border-border/70">
                    <td className="py-2 pr-2">
                      <p className="font-medium">{seller.name}</p>
                      <p className="text-xs text-muted-foreground">{seller.email}</p>
                    </td>
                    <td className="py-2 pr-2 tabular-nums">{seller.listings}</td>
                    <td className="py-2 tabular-nums">{seller.views.toLocaleString()}</td>
                  </tr>
                ))}
                {data.topSellers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-4 text-muted-foreground">
                      No sellers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
