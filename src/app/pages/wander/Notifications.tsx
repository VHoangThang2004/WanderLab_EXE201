import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Bell, Check, MessageSquare, ThumbsUp, Send, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useAuthStore } from "@/stores";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService, AppNotification } from "@/api/notificationService";
import { supabase } from "@/lib/supabase";

export function Notifications() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: dbNotifications = [] } = useQuery({
    queryKey: ['globalNotifications', user?.id],
    queryFn: () => notificationService.fetchNotifications(user?.id || ''),
    enabled: !!user?.id
  });

  const filteredNotifications = filter === "unread"
    ? dbNotifications.filter(n => !n.is_read)
    : dbNotifications;

  const unreadCount = dbNotifications.filter(n => !n.is_read).length;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['globalNotifications', user?.id] })
  });

  const removeNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from('notifications').delete().eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['globalNotifications', user?.id] })
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      if (user?.id) await supabase.from('notifications').delete().eq('user_id', user.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['globalNotifications', user?.id] })
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (user?.id) await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['globalNotifications', user?.id] })
  });

  const simulateAction = (type: "post" | "comment" | "like") => {
    let title = "";
    let message = "";
    let linkTo = "";
    let avatar = user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
    let userName = user?.full_name || "Bạn";

    if (type === "post") {
      title = "Đăng bài thành công";
      message = `Bài viết về chuyến đi của ${userName} đã được đăng.`;
      linkTo = "/explore";
    } else if (type === "comment") {
      title = "Bình luận mới";
      message = `${userName} đã bình luận: 'Cảnh đẹp quá bạn ơi!'`;
      linkTo = "/diaries";
    } else if (type === "like") {
      title = "Lượt thích mới";
      message = `${userName} và 5 người khác đã thích bài viết của bạn.`;
      linkTo = "/profile";
    }

    if (!user?.id) return;
    notificationService.createNotification(
      user.id,
      user.id,
      type,
      message,
      linkTo
    );

    toast(title, {
      description: message,
    });
  };

  const getNotificationLink = (notification: AppNotification) => {
    if (!notification.reference_id) return "#";
    // If it's a mock notification with an absolute path
    if (notification.reference_id.startsWith('/')) return notification.reference_id;

    switch (notification.type) {
      case 'friend_request':
      case 'friend_accept':
        return "/friends";
      case 'post':
      case 'like':
      case 'comment':
        return `/diary/${notification.reference_id}`;
      default:
        return "#";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center shadow-sm">
            <Bell className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thông Báo</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : "Không có thông báo mới"}
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-6 py-2.5 rounded-full font-semibold transition-all ${
              filter === "unread"
                ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Chưa đọc {unreadCount > 0 && `(${unreadCount})`}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              className="ml-auto px-6 py-2.5 bg-white text-[#ff3131] border border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all"
            >
              <Check size={18} className="inline mr-2" />
              Đánh dấu đã đọc tất cả
            </button>
          )}
          {dbNotifications.length > 0 && (
            <button
              onClick={() => clearAllMutation.mutate()}
              className={`${unreadCount > 0 ? "ml-2" : "ml-auto"} px-6 py-2.5 bg-white text-gray-500 border border-gray-200 rounded-full font-semibold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all flex items-center`}
            >
              <Trash2 size={18} className="inline mr-2" />
              Xóa tất cả
            </button>
          )}
        </div>
      </motion.div>

      {/* Test Actions Panel */}
      <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-2xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-bold text-orange-800 dark:text-orange-500 text-sm">Bảng Kiểm Thử (Developer)</h3>
          <p className="text-xs text-orange-600 dark:text-orange-400">Bấm để tạo thông báo giả lập và xem Push Toast</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => simulateAction("post")} className="px-3 py-1.5 bg-white dark:bg-background text-orange-700 dark:text-orange-500 text-xs font-semibold rounded-lg shadow-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors flex items-center gap-1 border border-orange-200 dark:border-orange-500/30">
            <Send size={14} /> Đăng bài
          </button>
          <button onClick={() => simulateAction("comment")} className="px-3 py-1.5 bg-white dark:bg-background text-orange-700 dark:text-orange-500 text-xs font-semibold rounded-lg shadow-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors flex items-center gap-1 border border-orange-200 dark:border-orange-500/30">
            <MessageSquare size={14} /> Bình luận
          </button>
          <button onClick={() => simulateAction("like")} className="px-3 py-1.5 bg-white dark:bg-background text-orange-700 dark:text-orange-500 text-xs font-semibold rounded-lg shadow-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors flex items-center gap-1 border border-orange-200 dark:border-orange-500/30">
            <ThumbsUp size={14} /> Lượt thích
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === "unread" ? "Không có thông báo chưa đọc" : "Không có thông báo nào"}
            </h3>
            <p className="text-gray-600">
              {filter === "unread"
                ? "Tất cả thông báo của bạn đã được đọc"
                : "Bạn chưa có thông báo nào"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              <Link
                to={getNotificationLink(notification)}
                onClick={() => markAsReadMutation.mutate(notification.id)}
                className={`block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all pr-12 ${
                  !notification.is_read ? "border-l-4 border-l-[#ff3131]" : ""
                }`}
              >
                <div className="flex gap-4">
                  {notification.actor && (
                    <ImageWithFallback
                      src={notification.actor.avatar_url}
                      alt={notification.actor.full_name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">
                        {notification.type === 'friend_request' ? 'Lời mời kết bạn' :
                         notification.type === 'friend_accept' ? 'Chấp nhận kết bạn' : 
                         notification.type === 'post' ? 'Đăng bài thành công' :
                         notification.type === 'comment' ? 'Bình luận mới' :
                         notification.type === 'like' ? 'Lượt thích mới' : 'Thông báo'}
                      </h3>
                      {!notification.is_read && (
                        <div className="w-2.5 h-2.5 bg-[#ff3131] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.content}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(notification.created_at).toLocaleDateString('vi-VN', {
                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeNotificationMutation.mutate(notification.id);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                title="Xóa thông báo này"
              >
                <X size={20} />
              </button>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
