import { X, Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, MapPin, Calendar, Users as UsersIcon } from "lucide-react";
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
}

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

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: {
        name: "Lê Văn Tuấn",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      content: "Đẹp quá! Mình cũng muốn đi nơi này lắm! 😍",
      timestamp: "2 giờ trước",
      likes: 12,
    },
    {
      id: "2",
      author: {
        name: "Trần Phương Linh",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      content: "Cho mình hỏi đi mấy người vậy bạn? Mình cũng đang lên kế hoạch đi đây!",
      timestamp: "1 giờ trước",
      likes: 5,
    },
    {
      id: "3",
      author: {
        name: "Nguyễn Minh Anh",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      },
      content: "Cảm ơn bạn đã chia sẻ! Rất hữu ích cho chuyến đi sắp tới của mình 🙏",
      timestamp: "30 phút trước",
      likes: 8,
    },
  ]);

  if (!isOpen) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: {
          name: "Phan Văn Minh",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        },
        content: commentText,
        timestamp: "Vừa xong",
        likes: 0,
      };
      setComments([...comments, newComment]);
      setCommentText("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-[#030213] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden grid grid-cols-1 lg:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side - Image */}
        <div className="bg-black flex items-center justify-center relative max-h-[90vh] lg:max-h-none">
          <ImageWithFallback
            src={post.image}
            alt={post.location}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right Side - Details & Comments */}
        <div className="flex flex-col h-[90vh] lg:h-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={12} />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:bg-gray-800 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Caption */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3 mb-3">
              <ImageWithFallback
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="text-gray-900 dark:text-white">
                  <span className="font-bold mr-2">{post.author.name}</span>
                  {post.caption}
                </p>
              </div>
            </div>
            
            {/* Trip Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
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
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <ImageWithFallback
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-white">{comment.author.name}</p>
                    <p className="text-gray-800 dark:text-gray-200 text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-2">
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#ff3131] font-semibold">
                      Thích
                    </button>
                    <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-[#ff3131] font-semibold">
                      Trả lời
                    </button>
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                    {comment.likes > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.likes} thích</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions Bar */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="hover:scale-110 transition-transform"
                >
                  <Heart
                    size={24}
                    className={isLiked ? "fill-[#ff3131] text-[#ff3131]" : "text-gray-700 dark:text-gray-300"}
                  />
                </button>
                <button className="hover:scale-110 transition-transform">
                  <MessageCircle size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button className="hover:scale-110 transition-transform">
                  <Share2 size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className="hover:scale-110 transition-transform"
              >
                <Bookmark
                  size={24}
                  className={isSaved ? "fill-gray-900 text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}
                />
              </button>
            </div>

            <p className="font-bold text-sm text-gray-900 dark:text-white mb-3">
              {likesCount.toLocaleString()} lượt thích
            </p>

            {/* Comment Input */}
            <div className="flex items-center gap-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                alt="Phan Văn Minh"
                className="w-8 h-8 rounded-full object-cover"
              />
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
                placeholder="Viết bình luận..."
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff3131]"
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