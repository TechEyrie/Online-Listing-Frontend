export type NotificationType =
  | 'message'
  | 'listing_sold'
  | 'review'
  | 'listing_expired'
  | 'listing_featured'
  | 'system';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: { listingId?: string; conversationId?: string };
  isRead: boolean;
  createdAt: string;
}

export interface ConversationPreview {
  _id: string;
  participants: Array<{ _id: string; name: string; avatar?: string }>;
  listing?: { _id: string; title: string; slug: string; images?: Array<{ url: string }> };
  lastMessage?: { content: string; sender: string; createdAt: string };
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  _id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { _id: string; name: string; avatar?: string } | string;
}
