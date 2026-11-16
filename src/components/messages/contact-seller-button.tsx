'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { MessageSquare } from 'lucide-react';

import { WhatsAppIcon } from '@/components/common/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  buildListingWhatsAppMessage,
  buildWhatsAppSellerUrl,
} from '@/lib/whatsapp';
import { messageApi } from '@/lib/message-api';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiErrorResponse } from '@/types/api';

interface ContactSellerButtonProps {
  listingId: string;
  sellerId: string;
  listingTitle: string;
  listingSlug: string;
  sellerPhone?: string;
  className?: string;
  size?: 'default' | 'lg' | 'sm';
}

const accentButtonClass =
  'bg-accent text-accent-foreground shadow-soft hover:bg-accent-hover';

export function ContactSellerButton({
  listingId,
  sellerId,
  listingTitle,
  listingSlug,
  sellerPhone,
  className,
  size = 'lg',
}: ContactSellerButtonProps) {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('Hi, is this still available?');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const listingUrl = useMemo(() => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/listings/${listingSlug}`;
    }
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${base}/listings/${listingSlug}`;
  }, [listingSlug]);

  const whatsAppUrl = useMemo(() => {
    if (!sellerPhone?.trim()) return null;
    return buildWhatsAppSellerUrl(
      sellerPhone,
      buildListingWhatsAppMessage(listingTitle, listingUrl),
    );
  }, [sellerPhone, listingTitle, listingUrl]);

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      const result = await messageApi.startConversation({
        recipientId: sellerId,
        listingId,
        message,
      });
      router.push(`/messages/${result.conversation._id}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;
      setError(axiosError.response?.data?.message || 'Could not start conversation');
    } finally {
      setPending(false);
    }
  };

  if (user?._id === sellerId) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {!user ? (
        <Button
          asChild
          variant="accent"
          size={size}
          className={cn('w-full gap-2', accentButtonClass)}
        >
          <Link href={`/login?redirect=${encodeURIComponent(pathname || '/')}`}>
            <MessageSquare className="h-4 w-4" aria-hidden />
            Contact seller
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          variant="accent"
          size={size}
          className={cn('w-full gap-2', accentButtonClass)}
          onClick={() => setOpen((v) => !v)}
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          {open ? 'Hide message' : 'Contact seller'}
        </Button>
      )}

      {whatsAppUrl ? (
        <Button
          asChild
          size={size}
          className={cn(
            'w-full gap-2 border-0 font-bold text-white shadow-soft',
            'bg-[#25D366] hover:bg-[#1DA851] active:bg-[#199446]',
          )}
        >
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Chat on WhatsApp
          </a>
        </Button>
      ) : null}

      {user && open && (
        <div className="space-y-3 rounded-2xl border border-border/80 bg-muted/50 p-4 animate-fade-up">
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Your message</Label>
            <Textarea
              id="contact-message"
              value={message}
              maxLength={2000}
              rows={3}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="button"
            variant="accent"
            className={cn('w-full', accentButtonClass)}
            disabled={pending || message.trim().length < 1}
            onClick={() => void submit()}
          >
            {pending ? 'Sending…' : 'Send message'}
          </Button>
        </div>
      )}
    </div>
  );
}