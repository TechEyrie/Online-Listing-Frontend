'use client';

import { NotificationItem } from '@/components/notifications/notification-item';
import { Button } from '@/components/ui/button';
import type { AppNotification } from '@/types/notification';

interface NotificationDropdownProps {
  items: AppNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
}

export function NotificationDropdown({ items, onRead, onReadAll }: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-md border bg-background shadow-lg">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <p className="text-sm font-medium">Notifications</p>
        <Button type="button" variant="ghost" size="sm" onClick={onReadAll}>
          Mark all read
        </Button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">No notifications yet</p>
        ) : (
          items.map((item) => <NotificationItem key={item._id} item={item} onRead={onRead} />)
        )}
      </div>
    </div>
  );
}
