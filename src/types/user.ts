import type { AuthUser, UserRole } from '@/types/auth';

export type { AuthUser, UserRole };

export interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface NotificationPreferences {
  emailMessages?: boolean;
  emailListingUpdates?: boolean;
  emailMarketing?: boolean;
}

export interface PublicProfile {
  _id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: UserLocation;
  socialLinks?: SocialLinks;
  role: UserRole;
  agencyDetails?: AuthUser['agencyDetails'];
  companyDetails?: AuthUser['companyDetails'];
  createdAt: string;
}

export interface DashboardStats {
  activeListings: number;
  totalViews: number;
  totalFavorites: number;
}

export type UpdateProfileInput = Partial<
  Pick<
    AuthUser,
    | 'name'
    | 'bio'
    | 'phone'
    | 'location'
    | 'socialLinks'
    | 'agencyDetails'
    | 'companyDetails'
    | 'notificationPreferences'
  >
>;
