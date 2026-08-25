'use client';

import { useEffect } from 'react';

import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/stores/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const refresh = await authApi.refresh();
        if (cancelled) return;
        if (refresh.data.user) {
          setAuth(refresh.data.user, refresh.data.accessToken);
          return;
        }
        useAuthStore.getState().setAccessToken(refresh.data.accessToken);
        const me = await authApi.me();
        if (cancelled) return;
        setAuth(me.data, refresh.data.accessToken);
      } catch {
        if (!cancelled) {
          logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [logout, setAuth, setLoading]);

  return <>{children}</>;
}
