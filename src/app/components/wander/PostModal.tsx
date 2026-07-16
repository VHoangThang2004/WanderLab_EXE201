import { X, Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, MapPin, Calendar, Users as UsersIcon } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { UserAvatar } from "./UserAvatar";
import { useState, useEffect } from "react";
import { useAuthStore, useNotificationStore } from "@/stores";
import { interactionService, CommentItem } from "@/api/interactionService";
import { toast } from "sonner";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    image: string;
    location: string;
    date: string;
    caption: string;
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
    groupSize: string;
  };
}

export function PostModal({ isOpen, onClose, post }: PostModalProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentText, setCommentText] = useState("");

  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (isOpen && post.id) {
      loadComments();
    }
  }, [isOpen, post.id]);

  const loadComments = async () => {
    try {
      setIsLoadingComments(true);
      const data = await interactionService.fetchComments(post.id);
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  if (!isOpen) return null;

  const handleLike = async () => {
    if (!user) return alert("Vui lòng đăng nhập để thích bài viết.");
    
    // Optimistic update
    const previousState = isLiked;
    const previousCount = likesCount;
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await interactionService.toggleLikeDiary(post.id, user.id);
      
      if (!isLiked) {
        addNotification({
          type: "like",
          title: "Lượt thích mới",
          message: `Bạn vừa thích bài viết của ${post.author.name}.`,
          linkTo: window.location.pathname,
          avatar: user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        });
      }
    } catch (error) {
      // Revert on error
      setIsLiked(previousState);
      setLikesCount(previousCount);
      console.error("Failed to toggle like:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return toast.error("Vui lòng đăng nhập để lưu bài viết.");

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!isSaved);

    try {
      await interactionService.toggleBookmarkDiary(post.id, user.id);
      toast.success(!previousState ? "Đã lưu bài viết vào danh mục của bạn!" : "Đã bỏ lưu bài viết");
    } catch (error: any) {
      setIsSaved(previousState);
      console.error("Failed to toggle save:", error);
      toast.error("Lỗi khi Lưu: " + (error?.message || "Đã xảy ra lỗi"));
    }
  };

  const handleShare = () => {
    const shareUrl = `https://wander-lab.vercel.app/post/${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Đã sao chép liên kết bài viết!");
  };

  const handleComment = async () => {
    if (!user) return alert("Vui lòng đăng nhập để bình luận.");
    if (!commentText.trim()) return;

    const content = commentText.trim();
    setCommentText(""); // Optimistic clear

    try {
      const newComment = await interactionService.addComment(post.id, user.id, content);
      setComments(prev => [newComment, ...prev]);

      addNotification({
        type: "comment",
        title: "Bình luận mới",
        message: `Bạn vừa bình luận: '${content}'`,
        linkTo: window.location.pathname,
        avatar: user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      });
    } catch (error: any) {
      console.error("Failed to post comment:", error);
      setCommentText(content); // Revert text
      alert("Lỗi khi đăng bình luận: " + (error?.message || error?.details || JSON.stringify(error)));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image */}
        <div className="bg-black flex items-center justify-center relative max-h-[90vh]">
          <ImageWithFallback
            src={post.image}
            alt={post.location}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Details & Comments */}
        <div className="flex flex-col h-[90vh] lg:h-auto lg:max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <UserAvatar
                src={post.author.avatar}
                name={post.author.name}
                className="w-10 h-10 text-sm"
              />
              <div>
                <p className="font-bold text-gray-900">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Caption */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <UserAvatar
                src={post.author.avatar}
                name={post.author.name}
                className="w-8 h-8 flex-shrink-0 shadow-sm text-xs"
              />
              <div>
                <p className="text-gray-900">
                  <span className="font-bold mr-2">{post.author.name}</span>
                  {post.caption}
                </p>
              </div>
            </div>
            
            {/* Trip Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-[#ff3131]" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <UsersIcon size={16} className="text-[#ff3131]" />
                <span>{post.groupSize}</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoadingComments ? (
              <div className="text-center text-sm text-gray-500 py-4">Đang tải bình luận...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <UserAvatar
                    src={comment.author.avatar_url}
                    name={comment.author.full_name}
                    className="w-8 h-8 flex-shrink-0 text-xs"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <p className="font-bold text-sm text-gray-900">{comment.author.full_name}</p>
                      <p className="text-gray-800 text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 px-2">
                      <button 
                        onClick={() => toast.success("Đã thích bình luận này!")}
                        className="text-xs text-gray-500 hover:text-[#ff3131] font-semibold"
                      >
                        Thích
                      </button>
                      <button 
                        onClick={() => document.getElementById('comment-input')?.focus()}
                        className="text-xs text-gray-500 hover:text-[#ff3131] font-semibold"
                      >
                        Trả lời
                      </button>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {comment.likes_count > 0 && (
                        <span className="text-xs text-gray-500">{comment.likes_count} thích</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions Bar */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart
                    size={24}
                    className={isLiked ? "fill-[#ff3131] text-[#ff3131]" : "text-gray-700"}
                  />
                </button>
                <button onClick={handleShare} className="hover:scale-110 transition-transform">
                  <Share2 size={24} className="text-gray-700" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark
                  size={24}
                  className={isSaved ? "fill-gray-900 text-gray-900" : "text-gray-700"}
                />
              </button>
            </div>

            <p className="font-bold text-sm text-gray-900 mb-3">
              {likesCount.toLocaleString()} lượt thích
            </p>

            {/* Comment Input */}
            <div className="flex items-center gap-2">
              {user?.avatar_url ? (
                <ImageWithFallback
                  src={user.avatar_url}
                  alt={user.full_name || "Guest"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-xs">
                  {user?.full_name?.charAt(0).toUpperCase() || 'G'}
                </div>
              )}
              <input
                id="comment-input"
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff3131]"
              />
              {commentText.trim() && (
                <button
                  onClick={handleComment}
                  className="text-[#ff3131] font-bold text-sm hover:text-[#ff914d]"
                >
                  Đăng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}