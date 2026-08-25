export interface ReviewUserRef {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ReviewListingRef {
  _id: string;
  title: string;
  slug: string;
}

export interface Review {
  _id: string;
  reviewer: ReviewUserRef | string;
  reviewee: ReviewUserRef | string;
  listing: ReviewListingRef | string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AverageRating {
  average: number;
  count: number;
}

export interface ReviewEligibility {
  canReview: boolean;
  reason?: string;
  listingId: string;
  revieweeId?: string;
}

export interface CreateReviewInput {
  reviewee: string;
  listing: string;
  rating: number;
  comment: string;
}

export interface ReviewListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
