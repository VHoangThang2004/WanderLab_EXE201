import { X, Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, MapPin, Calendar, Users as UsersIcon, Pencil, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { UserAvatar } from "./UserAvatar";
import { useState, useEffect, useMemo } from "react";
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
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const groupedComments = useMemo(() => {
    if (!comments) return [];
    const ascending = [...comments].reverse();
    const threads: CommentItem[][] = [];

    for (const comment of ascending) {
      const isReply = comment.content.trim().startsWith('@');
      let addedToThread = false;
      
      if (isReply) {
        const taggedUser = ascending.find(c => comment.content.trim().startsWith(`@${c.author.full_name}`));
        if (taggedUser) {
          const threadIndex = threads.findIndex(t => t.some(c => c.id === taggedUser.id));
          if (threadIndex !== -1) {
            const thread = threads[threadIndex];
            thread.push(comment);
            threads.splice(threadIndex, 1);
            threads.push(thread);
            addedToThread = true;
          }
        }
      }
      
      if (!addedToThread) {
        threads.push([comment]);
      }
    }

    return threads.reverse().flat();
  }, [comments]);

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


  const handleReply = async () => {
    if (!replyText.trim() || !user) return;
    try {
      const newReply = await interactionService.addComment(post.id, user.id, replyText);
      setComments(prev => [newReply, ...prev]);
      setReplyText("");
      setReplyingTo(null);
      toast.success("Đã trả lời bình luận!");
    } catch (err: any) {
      toast.error("Lỗi khi trả lời");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này không?")) return;
    try {
      await interactionService.deleteComment(commentId, post.id);
      setComments(prev => prev.filter(c => c.id !== commentId));
      toast.success("Đã xóa bình luận!");
    } catch (err) {
      toast.error("Lỗi khi xóa bình luận");
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editCommentText.trim()) return;
    try {
      await interactionService.updateComment(commentId, editCommentText);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editCommentText } : c));
      setEditingCommentId(null);
      toast.success("Đã cập nhật bình luận!");
    } catch (err) {
      toast.error("Lỗi khi cập nhật bình luận");
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
                  {post.caption.length > 150 && !isCaptionExpanded 
                    ? <>{post.caption.substring(0, 150)}... <button onClick={() => setIsCaptionExpanded(true)} className="text-gray-500 hover:text-gray-700 font-semibold text-sm ml-1">Xem thêm</button></>
                    : <>{post.caption} {post.caption.length > 150 && <button onClick={() => setIsCaptionExpanded(false)} className="text-gray-500 hover:text-gray-700 font-semibold text-sm ml-1">Ẩn bớt</button>}</>
                  }
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
            ) : groupedComments.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
            ) : (
              groupedComments.map((comment) => {
                const isReply = comment.content.trim().startsWith('@');
                let tag = '';
                let restOfContent = comment.content;

                if (isReply) {
                  // Try to find the tagged user by matching the prefix
                  const taggedUser = comments.find(c => comment.content.trim().startsWith(`@${c.author.full_name}`));
                  if (taggedUser) {
                    tag = `@${taggedUser.author.full_name}`;
                    restOfContent = comment.content.trim().substring(tag.length);
                  } else {
                    // Fallback if user not found (e.g. they changed name or it's a manual tag)
                    const parts = comment.content.trim().split(' ');
                    tag = parts[0];
                    restOfContent = parts.slice(1).join(' ');
                  }
                }

                return (
                <div key={comment.id} className={`flex items-start gap-3 ${isReply ? 'ml-12' : ''}`}>
                  <UserAvatar
                    src={comment.author.avatar_url}
                    name={comment.author.full_name}
                    className="w-8 h-8 flex-shrink-0 text-xs"
                  />
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2 relative group">
                      <p className="font-bold text-sm text-gray-900">{comment.author.full_name}</p>
                      
                      {editingCommentId === comment.id ? (
                        <div className="mt-1">
                          <input 
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:border-[#ff3131]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateComment(comment.id);
                              if (e.key === 'Escape') setEditingCommentId(null);
                            }}
                          />
                          <div className="flex gap-2 mt-1">
                            <button onClick={() => handleUpdateComment(comment.id)} className="text-xs text-[#ff3131] font-semibold">Lưu</button>
                            <button onClick={() => setEditingCommentId(null)} className="text-xs text-gray-500 font-semibold">Hủy</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-800 text-sm whitespace-pre-wrap">
                          {isReply && <span className="text-[#ff3131] font-semibold mr-1">{tag}</span>}
                          {restOfContent.length > 150 && !expandedComments[comment.id]
                            ? <>{restOfContent.substring(0, 150).trimStart()}... <button onClick={() => setExpandedComments(prev => ({...prev, [comment.id]: true}))} className="text-gray-500 hover:text-gray-700 font-semibold text-xs ml-1">Xem thêm</button></>
                            : <>{restOfContent.trimStart()} {restOfContent.length > 150 && <button onClick={() => setExpandedComments(prev => ({...prev, [comment.id]: false}))} className="text-gray-500 hover:text-gray-700 font-semibold text-xs ml-1">Ẩn bớt</button>}</>
                          }
                        </p>
                      )}
                      
                      {/* Delete/Edit Icon */}
                      {user?.id === comment.user_id && editingCommentId !== comment.id && (
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                           <button onClick={() => {
                             setEditingCommentId(comment.id);
                             setEditCommentText(comment.content);
                           }} className="text-gray-500 hover:text-blue-500 bg-white p-1 rounded-full shadow-sm">
                             <Pencil size={14} />
                           </button>
                           <button onClick={() => handleDeleteComment(comment.id)} className="text-gray-500 hover:text-red-500 bg-white p-1 rounded-full shadow-sm">
                             <Trash2 size={14} />
                           </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 px-2">
                      <button 
                        onClick={() => {
                          setLikedComments(prev => ({ ...prev, [comment.id]: !prev[comment.id] }));
                          if (!likedComments[comment.id]) toast.success("Đã thích bình luận này!");
                        }}
                        className={`text-xs font-semibold ${likedComments[comment.id] ? 'text-[#ff3131]' : 'text-gray-500 hover:text-[#ff3131]'}`}
                      >
                        Thích
                      </button>
                      <button 
                        onClick={() => {
                          if (replyingTo === comment.id) {
                            setReplyingTo(null);
                          } else {
                            setReplyingTo(comment.id);
                            setReplyText(`@${comment.author.full_name} `);
                            setTimeout(() => document.getElementById(`reply-input-${comment.id}`)?.focus(), 50);
                          }
                        }}
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
                    {/* Inline Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-2 ml-2 flex items-center gap-2">
                        <input
                          id={`reply-input-${comment.id}`}
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleReply()}
                          placeholder="Viết trả lời..."
                          className="flex-1 px-3 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#ff3131]"
                        />
                        {replyText.trim() && (
                          <button
                            onClick={handleReply}
                            className="text-[#ff3131] font-bold text-xs hover:text-[#ff914d]"
                          >
                            Đăng
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
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