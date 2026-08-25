import api from '@/lib/api';
import type { ApiSuccessResponse } from '@/types/api';
import type { ChatMessage, ConversationPreview } from '@/types/notification';

interface StartConversationResult {
  conversation: ConversationPreview;
  message: ChatMessage;
}

export const messageApi = {
  listConversations: async () => {
    const { data } = await api.get<ApiSuccessResponse<ConversationPreview[]>>(
      '/messages/conversations',
    );
    return data.data;
  },
  startConversation: async (payload: {
    recipientId: string;
    listingId: string;
    message: string;
  }) => {
    const { data } = await api.post<ApiSuccessResponse<StartConversationResult>>(
      '/messages/conversations',
      payload,
    );
    return data.data;
  },
  getMessages: async (conversationId: string) => {
    const { data } = await api.get<ApiSuccessResponse<ChatMessage[]>>(
      `/messages/conversations/${conversationId}`,
    );
    return data.data;
  },
  sendMessage: async (conversationId: string, content: string) => {
    const { data } = await api.post<ApiSuccessResponse<ChatMessage>>(
      `/messages/conversations/${conversationId}`,
      { content },
    );
    return data.data;
  },
};
