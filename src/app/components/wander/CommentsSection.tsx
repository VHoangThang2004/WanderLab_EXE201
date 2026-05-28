import { Heart, MessageCircle, Send } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentsSectionProps {
  comments: Comment[];
}

export function CommentsSection({ comments: initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const currentUser = {
    name: "Phan Văn Minh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: newComment,
      timestamp: "Vừa xong",
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Comment = {
      id: Date.now().toString(),
      author: currentUser,
      content: replyText,
      timestamp: "Vừa xong",
      likes: 0,
      isLiked: false,
    };

    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          : comment
      )
    );

    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-6" id="comments">
      {/* Comment Input */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-3">
          <ImageWithFallback
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ suy nghĩ của bạn..."
              className="w-full px-4 py-3 bg-[#FFF5F3] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-gray-900"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-5 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                Bình luận
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-2xl border border-gray-200 p-5">
            {/* Comment Header */}
            <div className="flex gap-3 mb-3">
              <ImageWithFallback
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{comment.author.name}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
              </div>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center gap-4 ml-13 text-sm">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  comment.isLiked ? "text-[#ff3131]" : "text-gray-500 hover:text-[#ff3131]"
                }`}
              >
                <Heart size={16} className={comment.isLiked ? "fill-current" : ""} />
                <span className="font-medium">{comment.likes > 0 ? comment.likes : "Thích"}</span>
              </button>

              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-[#ff3131] transition-colors"
              >
                <MessageCircle size={16} />
                <span className="font-medium">Trả lời</span>
              </button>
            </div>

            {/* Reply Input */}
            {replyingTo === comment.id && (
              <div className="mt-4 ml-13 flex gap-3">
                <ImageWithFallback
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Trả lời ${comment.author.name}...`}
                    className="w-full px-4 py-2 bg-[#FFF5F3] rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddReply(comment.id);
                      }
                    }}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!replyText.trim()}
                      className="px-4 py-1.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold text-sm hover:shadow-md transition-all disabled:opacity-50"
                    >
                      Gửi
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 ml-13 space-y-3 border-l-2 border-gray-100 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-3">
                    <ImageWithFallback
                      src={reply.author.avatar}
                      alt={reply.author.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{reply.author.name}</span>
                        <span className="text-gray-400 text-xs">·</span>
                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                      </div>
                      <p className="text-gray-700 text-sm mt-0.5">{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}