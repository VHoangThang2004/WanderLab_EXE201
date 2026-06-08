import { Heart, MessageCircle, Send, Loader2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interactionService } from "@/api/interactionService";
import { useAuthStore } from "@/stores";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface CommentsSectionProps {
  diaryId: string;
}

export function CommentsSection({ diaryId }: CommentsSectionProps) {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  
  const [newComment, setNewComment] = useState("");
  // Tính năng Trả lời và Like comment có thể làm ở phase sau hoặc mở rộng
  // Hiện tại tập trung vào Gửi bình luận cấp 1.
  
  // 1. Fetch Comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', diaryId],
    queryFn: () => interactionService.fetchComments(diaryId),
    enabled: !!diaryId
  });

  // 2. Add Comment Mutation
  const addCommentMutation = useMutation({
    mutationFn: (content: string) => {
      if (!user) throw new Error("Vui lòng đăng nhập để bình luận");
      return interactionService.addComment(diaryId, user.id, content);
    },
    onSuccess: () => {
      setNewComment("");
      // Refresh comments
      queryClient.invalidateQueries({ queryKey: ['comments', diaryId] });
      // Cũng refresh cả diary để cập nhật lại comments_count (nếu có)
      queryClient.invalidateQueries({ queryKey: ['diary', diaryId] });
    },
    onError: (err: any) => {
      alert(err.message || "Không thể gửi bình luận lúc này.");
    }
  });

  const handleAddComment = () => {
    if (!isAuthenticated) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này.");
      return;
    }
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };

  const formatTime = (isoString: string) => {
    try {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true, locale: vi });
    } catch {
      return "Vừa xong";
    }
  };

  return (
    <div className="space-y-6" id="comments">
      {/* Comment Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-3">
            {user?.avatar_url ? (
              <ImageWithFallback
                src={user.avatar_url}
                alt={user.full_name || "Guest"}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.full_name?.charAt(0).toUpperCase() || 'G'}
              </div>
            )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isAuthenticated ? "Chia sẻ suy nghĩ của bạn..." : "Vui lòng đăng nhập để bình luận..."}
              className="w-full px-4 py-3 bg-[#FFF5F3] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-gray-900 disabled:opacity-60"
              rows={3}
              disabled={!isAuthenticated || addCommentMutation.isPending}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || !isAuthenticated || addCommentMutation.isPending}
                className="px-5 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addCommentMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Bình luận
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              {/* Comment Header */}
              <div className="flex gap-3 mb-3">
                {comment.author?.avatar_url ? (
                  <ImageWithFallback
                    src={comment.author.avatar_url}
                    alt={comment.author?.full_name || "User"}
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {comment.author?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{comment.author?.full_name || "User"}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-sm text-gray-500">{formatTime(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 mt-1 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>

              {/* Comment Actions (Chưa kích hoạt logic Like thực tế ở level 2) */}
              <div className="flex items-center gap-4 ml-13 text-sm">
                <button
                  className="flex items-center gap-1.5 transition-colors text-gray-500 hover:text-[#ff3131]"
                  onClick={() => alert("Tính năng Like bình luận đang được phát triển!")}
                >
                  <Heart size={16} />
                  <span className="font-medium">{comment.likes_count > 0 ? comment.likes_count : "Thích"}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}