export type AssistantMessageRole = 'user' | 'assistant' | 'system';

export interface AssistantListingCard {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  priceType: string;
  location?: { city?: string; country?: string };
  imageUrl?: string;
  reason?: string;
  href: string;
}

export interface AssistantMessage {
  _id: string;
  session: string;
  role: AssistantMessageRole;
  content: string;
  listings?: AssistantListingCard[];
  suggestions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AssistantSession {
  _id: string;
  user: string;
  title: string;
  status: 'active' | 'archived';
  lastMessageAt: string;
  messageCount: number;
  createdAt?: string;
}

export interface AssistantAnalytics {
  totals: {
    sessions: number;
    activeSessions: number;
    messages: number;
    uniqueUsers: number;
    tokensPrompt: number;
    tokensCompletion: number;
  };
  ratios: {
    clarifyingReplies: number;
    searchReplies: number;
    avgListingsPerReply: number;
  };
  dailyMessages: Array<{ date: string; count: number }>;
  topQueries: Array<{ q: string; count: number }>;
  recentSessions: Array<{
    id: string;
    title: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    messageCount: number;
    lastMessageAt: string;
  }>;
}

export type AssistantStreamHandlers = {
  onStatus?: (phase: 'thinking' | 'searching' | 'composing') => void;
  onUserMessage?: (message: AssistantMessage) => void;
  onToken?: (delta: string) => void;
  onListings?: (listings: AssistantListingCard[]) => void;
  onSuggestions?: (suggestions: string[]) => void;
  onDone?: (assistantMessage: AssistantMessage) => void;
  onError?: (message: string) => void;
};
