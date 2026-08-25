'use client';

import Link from 'next/link';

import type { AppNotification } from '@/types/notification';

const hrefFor = (item: AppNotification): string => {
  if (item.data?.conversationId) return `/messages/${item.data.conversationId}`;
  if (item.type === 'review') return '/profile';
  if (item.data?.listingId) return '/my-listings';
  if (item.type === 'system') return '/dashboard';
  return '/dashboard';
};

interface NotificationItemProps {
  item: AppNotification;
  onRead: (id: string) => void;
}

export function NotificationItem({ item, onRead }: NotificationItemProps) {
  return (
    <Link
      href={hrefFor(item)}
      className="block border-b px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50"
      onClick={() => {
        if (!item.isRead) onRead(item._id);
      }}
    >
      <p className={item.isRead ? 'text-muted-foreground' : 'font-medium'}>{item.title}</p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </Link>
  );
}
