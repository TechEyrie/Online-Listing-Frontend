import api from '@/lib/api';
import { getClientApiBase } from '@/lib/api-base';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiSuccessResponse } from '@/types/api';
import type {
  AssistantAnalytics,
  AssistantMessage,
  AssistantSession,
  AssistantStreamHandlers,
} from '@/types/assistant';

type ListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const parseSseChunk = (
  chunk: string,
  handlers: AssistantStreamHandlers,
): void => {
  const blocks = chunk.split('\n\n');
  for (const block of blocks) {
    if (!block.trim()) continue;
    const lines = block.split('\n');
    let eventName = 'message';
    let dataLine = '';
    for (const line of lines) {
      if (line.startsWith('event:')) eventName = line.slice(6).trim();
      if (line.startsWith('data:')) dataLine += line.slice(5).trim();
    }
    if (!dataLine) continue;
    try {
      const data = JSON.parse(dataLine) as Record<string, unknown>;
      switch (eventName) {
        case 'status':
          handlers.onStatus?.(data.phase as 'thinking' | 'searching' | 'composing');
          break;
        case 'user_message':
          handlers.onUserMessage?.(data as unknown as AssistantMessage);
          break;
        case 'token':
          handlers.onToken?.(String(data.delta ?? ''));
          break;
        case 'listings':
          handlers.onListings?.(
            (data.listings as AssistantMessage['listings']) ?? [],
          );
          break;
        case 'suggestions':
          handlers.onSuggestions?.((data.suggestions as string[]) ?? []);
          break;
        case 'done':
          handlers.onDone?.(
            (data.assistantMessage as AssistantMessage) ??
              (data as unknown as AssistantMessage),
          );
          break;
        case 'error':
          handlers.onError?.(String(data.message ?? 'Assistant error'));
          break;
        default:
          break;
      }
    } catch {
      // ignore malformed SSE frames
    }
  }
};

export const assistantApi = {
  listSessions: async (params: { page?: number; limit?: number } = {}) => {
    const { data } = await api.get<ApiSuccessResponse<AssistantSession[]> & { meta: ListMeta }>(
      '/assistant/sessions',
      { params },
    );
    return { sessions: data.data, meta: data.meta };
  },

  createSession: async () => {
    const { data } = await api.post<ApiSuccessResponse<AssistantSession>>('/assistant/sessions');
    return data.data;
  },

  getSession: async (id: string) => {
    const { data } = await api.get<
      ApiSuccessResponse<{ session: AssistantSession; messages: AssistantMessage[] }>
    >(`/assistant/sessions/${id}`);
    return data.data;
  },

  archiveSession: async (id: string) => {
    const { data } = await api.patch<ApiSuccessResponse<AssistantSession>>(
      `/assistant/sessions/${id}/archive`,
    );
    return data.data;
  },

  deleteSession: async (id: string) => {
    const { data } = await api.delete<ApiSuccessResponse<{ deleted: boolean }>>(
      `/assistant/sessions/${id}`,
    );
    return data.data;
  },

  streamMessage: async (
    sessionId: string,
    content: string,
    handlers: AssistantStreamHandlers,
    signal?: AbortSignal,
  ) => {
    const token = useAuthStore.getState().accessToken;
    const base = getClientApiBase().replace(/\/$/, '');
    const response = await fetch(`${base}/assistant/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
      signal,
    });

    if (!response.ok || !response.body) {
      let message = 'Assistant temporarily unavailable';
      try {
        const err = (await response.json()) as { message?: string };
        if (err.message) message = err.message;
      } catch {
        // ignore
      }
      handlers.onError?.(message);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        parseSseChunk(`${part}\n\n`, handlers);
      }
    }
    if (buffer.trim()) parseSseChunk(`${buffer}\n\n`, handlers);
  },

  getAdminAnalytics: async () => {
    const { data } = await api.get<ApiSuccessResponse<AssistantAnalytics>>(
      '/admin/assistant/analytics',
    );
    return data.data;
  },
};
