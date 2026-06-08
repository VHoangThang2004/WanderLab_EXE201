import { Heart, MessageCircle, Bookmark, MapPin, Calendar, Users, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { PostModal } from "./PostModal";
import { useAuthStore } from "@/stores";
import { interactionService } from "@/api/interactionService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diaryService } from "@/api/diaryService";

interface JournalPostCardProps {
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
  isLiked?: boolean;
  isSaved?: boolean;
  groupSize?: string;
}

export function JournalPostCard({
  id,
  author,
  image,
  location,
  date,
  caption,
  likes: initialLikes,
  comments,
  isLiked: initialIsLiked = false,
  isSaved: initialIsSaved = false,
  groupSize,
}: JournalPostCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (diaryId: string) => diaryService.deleteDiary(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] });
    }
  });

  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhật ký này không? (Are you sure?)")) {
      await deleteMutation.mutateAsync(id);
      window.location.reload(); 
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user) {
      alert("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
    
    try {
      await interactionService.toggleLikeDiary(id, user.id);
    } catch (err: any) {
      // Revert if failed
      setIsLiked(isLiked);
      setLikes(likes);
      alert("Lỗi khi Like: " + (err?.message || JSON.stringify(err)));
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      alert("Vui lòng đăng nhập để lưu bài viết!");
      return;
    }
    // Optimistic update
    setIsSaved(!isSaved);
    
    try {
      await interactionService.toggleBookmarkDiary(id, user.id);
    } catch (err: any) {
      // Revert if failed
      setIsSaved(isSaved);
      alert("Lỗi khi Save: " + (err?.message || JSON.stringify(err)));
    }
  };

  const postData = {
    id,
    author,
    image,
    location,
    date,
    caption,
    likes,
    comments,
    isLiked,
    isSaved,
    groupSize: groupSize || "1 người",
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all relative">
        {/* Author Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            {author.avatar && author.avatar !== 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04' ? (
              <ImageWithFallback
                src={author.avatar}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {author.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-900">
                {author.name}
              </span>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin size={12} />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>

          {/* Edit / Delete Menu */}
          {user?.id === author.id && (
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} 
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
              >
                <MoreHorizontal size={20} />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/edit-diary/${id}`); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                  >
                    <Edit size={16} /> Sửa
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Image */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="block relative group w-full"
        >
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={image}
              alt={caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {/* Tape effect on top corners */}
          <div className="absolute top-3 left-3 w-16 h-6 bg-white/70 backdrop-blur-sm rotate-[-5deg] shadow-sm border border-gray-200"></div>
          <div className="absolute top-3 right-3 w-16 h-6 bg-white/70 backdrop-blur-sm rotate-[5deg] shadow-sm border border-gray-200"></div>
        </button>

        {/* Caption & Date - Journal style */}
        <div className="p-5 space-y-3">
          {/* Date tag - handwritten style */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
            {groupSize && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Users size={14} />
                <span>{groupSize}</span>
              </div>
            )}
          </div>

          {/* Caption - journal entry style */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="block text-left w-full"
          >
            <p className="text-gray-800 leading-relaxed line-clamp-3 hover:text-gray-900">
              {caption}
            </p>
          </button>

          {/* Social Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Like */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 transition-colors ${
                  isLiked ? "text-[#ff3131]" : "text-gray-500 hover:text-[#ff3131]"
                }`}
              >
                <Heart
                  size={20}
                  className={isLiked ? "fill-current" : ""}
                />
                <span className="text-sm font-medium">{likes}</span>
              </button>

              {/* Comment */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 text-gray-500 hover:text-[#ff3131] transition-colors"
              >
                <MessageCircle size={20} />
                <span className="text-sm font-medium">{comments}</span>
              </button>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`transition-colors ${
                isSaved ? "text-[#ff3131]" : "text-gray-500 hover:text-[#ff3131]"
              }`}
            >
              <Bookmark
                size={20}
                className={isSaved ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={postData}
      />
    </>
  );
}