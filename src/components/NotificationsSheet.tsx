import { useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications, useMarkAsRead, Notification } from "@/hooks/useNotifications";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const NotificationRow = ({ notification }: { notification: Notification }) => {
  const markAsRead = useMarkAsRead();

  return (
    <button
      onClick={() => {
        if (!notification.is_read) markAsRead.mutate(notification.id);
      }}
      className={`w-full text-left px-4 py-3 flex gap-3 items-start transition-colors ${
        notification.is_read ? "opacity-60" : "bg-accent/30"
      }`}
    >
      <div
        className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
          notification.is_read ? "bg-transparent" : "bg-primary"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{notification.text}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
      {!notification.is_read && <Check className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />}
    </button>
  );
};

interface NotificationsSheetProps {
  unreadCount: number;
  children: React.ReactNode;
}

const NotificationsSheet = ({ unreadCount, children }: NotificationsSheetProps) => {
  const { data: notifications = [] } = useNotifications();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {unreadCount}
              </span>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto pb-6 divide-y divide-border">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => <NotificationRow key={n.id} notification={n} />)
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationsSheet;
