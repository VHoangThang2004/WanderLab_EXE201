import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { diaryService } from "@/api/diaryService";
import { PostModal } from "../../components/wander/PostModal";
import { useAuthStore } from "@/stores";

export function WanderPostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: diary, isLoading, isError } = useQuery({
    queryKey: ['diary', id],
    queryFn: () => diaryService.fetchDiaryById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff3131]"></div>
      </div>
    );
  }

  if (isError || !diary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-gray-500 mb-4">Bài viết này không tồn tại hoặc đã bị xóa.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#ff3131] text-white rounded-full font-bold hover:bg-[#ff914d] transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const postData = {
    id: diary.id,
    author: {
      name: diary.author?.name || 'Unknown',
      avatar: diary.author?.avatar || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    },
    image: diary.image || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5',
    location: diary.location || '',
    date: diary.dates || '',
    caption: diary.description || '',
    likes: diary.likesCount || 0,
    comments: diary.commentsCount || 0,
    isLiked: false,
    isSaved: false,
    groupSize: diary.groupSize || '1 người',
  };

  return (
    <div className="min-h-screen relative">
      {/* Background layer */}
      <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
        {/* Decorative background */}
      </div>
      
      <PostModal 
        isOpen={true} 
        onClose={() => navigate('/')} 
        post={postData} 
      />
    </div>
  );
}
