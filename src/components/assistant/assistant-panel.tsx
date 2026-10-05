'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { AssistantInput } from '@/components/assistant/assistant-input';
import { AssistantMessageList } from '@/components/assistant/assistant-message-list';
import { AssistantSessionList } from '@/components/assistant/assistant-session-list';
import { Button } from '@/components/ui/button';
import { assistantApi } from '@/lib/assistant-api';
import { useAuthStore } from '@/stores/auth-store';
import type { AssistantListingCard, AssistantMessage } from '@/types/assistant';

interface AssistantPanelProps {
  onClose: () => void;
}

export function AssistantPanel({ onClose }: AssistantPanelProps) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?._id ?? null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [phase, setPhase] = useState<string | null>(null);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const assistantDraftContentRef = useRef<string>('');
  const lastAssistantTokenEmitAtRef = useRef<number>(0);

  // Reset chat state when the logged-in user changes (logout/login swap).
  useEffect(() => {
    setSessionId(null);
    setMessages([]);
    setError(null);
    setPhase(null);
    setStreamingId(null);
    setBusy(false);
  }, [userId]);

  const sessionsQuery = useQuery({
    queryKey: ['assistant', 'sessions', userId],
    queryFn: () => assistantApi.listSessions({ limit: 30 }),
    enabled: Boolean(userId),
  });

  const ensureSession = useCallback(async () => {
    if (sessionId) return sessionId;
    const created = await assistantApi.createSession();
    setSessionId(created._id);
    await queryClient.invalidateQueries({ queryKey: ['assistant', 'sessions', userId] });
    return created._id;
  }, [sessionId, queryClient, userId]);

  useEffect(() => {
    const sessions = sessionsQuery.data?.sessions ?? [];
    if (!sessionId && sessions[0]) {
      setSessionId(sessions[0]._id);
    }
  }, [sessionsQuery.data, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    assistantApi.getSession(sessionId).then((data) => {
      if (!cancelled) setMessages(data.messages);
    });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const send = async (content: string) => {
    setError(null);
    setBusy(true);
    const tempUserId = `temp-user-${Date.now()}`;
    const tempAssistantId = `temp-assistant-${Date.now()}`;
    assistantDraftContentRef.current = '';
    lastAssistantTokenEmitAtRef.current = 0;
    setMessages((prev) => [
      ...prev,
      {
        _id: tempUserId,
        session: sessionId || '',
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      },
      {
        _id: tempAssistantId,
        session: sessionId || '',
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      },
    ]);
    setStreamingId(tempAssistantId);

    let listings: AssistantListingCard[] = [];
    let suggestions: string[] = [];

    try {
      const id = await ensureSession();
      await assistantApi.streamMessage(id, content, {
        onStatus: (p) => setPhase(p),
        onUserMessage: (msg) => {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempUserId ? { ...msg } : m)),
          );
        },
        onToken: (delta) => {
          assistantDraftContentRef.current += delta;
          const now = Date.now();
          // Throttle UI updates: OpenRouter can emit tiny token deltas very fast.
          if (now - lastAssistantTokenEmitAtRef.current < 120) return;
          lastAssistantTokenEmitAtRef.current = now;
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId ? { ...m, content: assistantDraftContentRef.current } : m,
            ),
          );
        },
        onListings: (next) => {
          listings = next;
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId ? { ...m, listings: next } : m,
            ),
          );
        },
        onSuggestions: (next) => {
          suggestions = next;
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId ? { ...m, suggestions: next } : m,
            ),
          );
        },
        onDone: (assistantMessage) => {
          setMessages((prev) =>
            prev.map((m) =>
              m._id === tempAssistantId
                ? {
                    ...assistantMessage,
                    listings: assistantMessage.listings ?? listings,
                    suggestions: assistantMessage.suggestions ?? suggestions,
                  }
                : m,
            ),
          );
          void queryClient.invalidateQueries({ queryKey: ['assistant', 'sessions', userId] });
        },
        onError: (message) => setError(message),
      });
    } catch {
      setError('Could not reach the assistant.');
    } finally {
      setBusy(false);
      setPhase(null);
      setStreamingId(null);
    }
  };

  const createNew = async () => {
    const created = await assistantApi.createSession();
    setSessionId(created._id);
    setMessages([]);
    await queryClient.invalidateQueries({ queryKey: ['assistant', 'sessions', userId] });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowSessions((v) => !v)}
          >
            Chats
          </Button>
          <h2 className="font-display text-base font-bold">Listing assistant</h2>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </header>

      <div className="flex min-h-0 flex-1">
        {showSessions ? (
          <div className="w-36 shrink-0 sm:w-44">
            <AssistantSessionList
              sessions={sessionsQuery.data?.sessions ?? []}
              activeId={sessionId}
              onSelect={(id) => {
                setSessionId(id);
                setShowSessions(false);
              }}
              onNew={() => {
                void createNew();
                setShowSessions(false);
              }}
            />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col">
          <AssistantMessageList
            messages={messages}
            streamingId={streamingId}
            phase={phase}
            onSuggestion={(text) => void send(text)}
            suggestionsDisabled={busy}
            onExample={(text) => void send(text)}
          />
          {error ? <p className="px-3 pb-1 text-xs text-destructive">{error}</p> : null}
          <AssistantInput disabled={busy} onSend={(text) => void send(text)} />
        </div>
      </div>
    </div>
  );
}
