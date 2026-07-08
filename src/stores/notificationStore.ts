import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NotificationType = "friend_request" | "group_invite" | "comment" | "like" | "post" | "system" | "success";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  avatar?: string;
  timestamp: string;
  isRead: boolean;
  linkTo: string;
}

interface NotificationState {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, "id" | "timestamp" | "isRead">) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Initial mock data for first-time users
const initialNotifications: AppNotification[] = [
  {
    id: "1",
    type: "system",
    title: "Chào mừng đến với WanderLab",
    message: "Hãy khám phá và chia sẻ hành trình của bạn với cộng đồng nhé!",
    timestamp: "Vừa xong",
    isRead: false,
    linkTo: "/",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: initialNotifications,

      addNotification: (notification) => {
        const newNotification: AppNotification = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: "Vừa xong", // Ideally use real timestamps or relative time strings
          isRead: false,
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications],
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'wanderlab-notifications',
    }
  )
);
