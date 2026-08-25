'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

interface GoogleSignInButtonProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignInButton({
  redirectTo = '/dashboard',
  onError,
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable' | 'signing-in'>(
    'loading',
  );

  useEffect(() => {
    if (!CLIENT_ID || CLIENT_ID.includes('your-google')) {
      setStatus('unavailable');
      return;
    }

    let cancelled = false;

    const handleCredential = async (credential: string) => {
      setStatus('signing-in');
      try {
        const res = await authApi.googleLogin(credential);
        if (cancelled) return;
        setAuth(res.data.user, res.data.accessToken);
        router.push(redirectTo);
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        onError?.(axiosError.response?.data?.message || 'Google sign-in failed');
        setStatus('ready');
      }
    };

    const renderButton = () => {
      if (cancelled || !buttonRef.current || !window.google) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          void handleCredential(response.credential);
        },
        ux_mode: 'popup',
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 320,
      });
      setStatus('ready');
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );
    if (existing && window.google) {
      renderButton();
      return () => {
        cancelled = true;
      };
    }

    const script = existing ?? document.createElement('script');
    if (!existing) {
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.addEventListener('load', renderButton);

    return () => {
      cancelled = true;
      script.removeEventListener('load', renderButton);
    };
  }, [onError, redirectTo, router, setAuth]);

  if (status === 'unavailable') {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your env.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div ref={buttonRef} className="flex min-h-10 w-full justify-center" />
      {status === 'loading' && (
        <p className="text-xs text-muted-foreground">Loading Google sign-in...</p>
      )}
      {status === 'signing-in' && (
        <p className="text-xs text-muted-foreground">Signing you in with Google...</p>
      )}
    </div>
  );
}
