import { X, Heart, MessageCircle, Bookmark, Share2, MapPin, Calendar, Users as UsersIcon, Edit, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useState } from "react";
import { CommentsSection } from "./CommentsSection";
import { useAuthStore } from "@/stores";
import { useNavigate } from "react-router";
import { diaryService } from "@/api/diaryService";

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
      id?: string;
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
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhật ký này?")) {
      try {
        await diaryService.deleteDiary(post.id);
        alert("Đã xóa nhật ký");
        window.location.reload(); // Quick refresh
      } catch (err) {
        alert("Có lỗi xảy ra khi xóa");
      }
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
            <CommentsSection diaryId={post.id} />
          </div>

          {/* Actions Bar */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="hover:scale-110 transition-transform flex items-center gap-1 text-gray-700 dark:text-gray-300"
                >
                  <Heart
                    size={24}
                    className={isLiked ? "fill-[#ff3131] text-[#ff3131]" : "text-gray-700 dark:text-gray-300"}
                  />
                  <span className="font-bold text-sm ml-1">{likesCount.toLocaleString()}</span>
                </button>
                <button className="hover:scale-110 transition-transform">
                  <MessageCircle size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
                <button className="hover:scale-110 transition-transform">
                  <Share2 size={24} className="text-gray-700 dark:text-gray-300" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                {user?.id === post.author.id && (
                  <>
                    <button onClick={() => { onClose(); navigate(`/edit/${post.id}`); }} className="text-gray-500 hover:text-blue-500 transition-colors">
                      <Edit size={20} />
                    </button>
                    <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}