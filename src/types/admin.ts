export type ReportTargetType = 'listing' | 'user' | 'review';
export type ReportReason = 'spam' | 'scam' | 'offensive' | 'prohibited' | 'duplicate' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AdminUserDetail {
  user: AdminUser;
  listingCount: number;
  reportCount: number;
}

export interface AdminListing {
  _id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  isFeatured: boolean;
  featuredUntil?: string;
  createdAt: string;
  seller?: { _id: string; name: string; email: string };
  category?: { _id: string; name: string; slug: string };
}

export interface AdminReport {
  _id: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  resolution?: string;
  createdAt: string;
  reporter?: { _id: string; name: string; email: string };
  reviewedBy?: { _id: string; name: string };
}

export interface AdminTransaction {
  _id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  user?: { _id: string; name: string; email: string };
  listing?: { _id: string; title: string; slug: string };
}

export interface DashboardStats {
  totalUsers: number;
  users: Record<string, number>;
  totalListings: number;
  listings: Record<string, number>;
  revenue: { total: number; transactions: number };
  pendingReports: number;
  revenueTrend: Array<{ date: string; total: number; count: number }>;
}

export interface AdminListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
