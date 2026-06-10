import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Bell, Check, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { motion } from "motion/react";
import { useNotificationStore } from "@/stores";
import { toast } from "sonner";

export function Notifications() {
  const { notifications, addNotification, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const simulateAction = (type: "post" | "comment" | "like") => {
    let title = "";
    let message = "";
    let linkTo = "";
    let avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";

    if (type === "post") {
      title = "Đăng bài thành công";
      message = "Bài viết về chuyến đi Đà Lạt của bạn đã được đăng.";
      linkTo = "/explore";
    } else if (type === "comment") {
      title = "Bình luận mới";
      message = "Hoàng Thắng đã bình luận: 'Cảnh đẹp quá bạn ơi!'";
      linkTo = "/diaries";
    } else if (type === "like") {
      title = "Lượt thích mới";
      message = "Nguyễn Văn A và 5 người khác đã thích bài viết của bạn.";
      linkTo = "/profile";
    }

    addNotification({
      type,
      title,
      message,
      linkTo,
      avatar,
    });

    toast(title, {
      description: message,
    });
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
              onClick={markAllAsRead}
              className="ml-auto px-6 py-2.5 bg-white text-[#ff3131] border border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all"
            >
              <Check size={18} className="inline mr-2" />
              Đánh dấu đã đọc tất cả
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
            >
              <Link
                to={notification.linkTo}
                onClick={() => markAsRead(notification.id)}
                className={`block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all ${
                  !notification.isRead ? "border-l-4 border-l-[#ff3131]" : ""
                }`}
              >
                <div className="flex gap-4">
                  {notification.avatar && (
                    <ImageWithFallback
                      src={notification.avatar}
                      alt={notification.title}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{notification.title}</h3>
                      {!notification.isRead && (
                        <div className="w-2.5 h-2.5 bg-[#ff3131] rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-400">{notification.timestamp}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
