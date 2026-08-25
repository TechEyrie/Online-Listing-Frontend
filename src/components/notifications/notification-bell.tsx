'use client';

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'lucide-react';

import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import { Button } from '@/components/ui/button';
import { notificationApi } from '@/lib/notification-api';
import { useAuthStore } from '@/stores/auth-store';

export function NotificationBell() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const unreadQuery = useQuery({
    queryKey: ['unread-count'],
    queryFn: () => notificationApi.unreadCount(),
    enabled: Boolean(user),
    refetchInterval: 60_000,
  });

  const listQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.list({ page: 1, limit: 12 }),
    enabled: Boolean(user) && open,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const markAll = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      await queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!user) return null;

  const count = unreadQuery.data ?? 0;

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </Button>
      {open && (
        <NotificationDropdown
          items={listQuery.data?.data ?? []}
          onRead={(id) => markRead.mutate(id)}
          onReadAll={() => markAll.mutate()}
        />
      )}
    </div>
  );
}
