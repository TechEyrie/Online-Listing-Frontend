export type UserRole = 'user' | 'agent' | 'brand' | 'admin' | 'moderator';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  agencyDetails?: { name?: string; license?: string; website?: string };
  companyDetails?: { name?: string; registrationNo?: string; website?: string };
  notificationPreferences?: {
    emailMessages?: boolean;
    emailListingUpdates?: boolean;
    emailMarketing?: boolean;
  };
  authProvider?: 'local' | 'google';
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokensData {
  user: AuthUser;
  accessToken: string;
}
