import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { diaryBookService } from "@/api/diaryBookService";
import { diaryService } from "@/api/diaryService";
import { Button } from "../../components/ui/button";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import { CreateEditDiaryBookModal } from "../../components/wander/book/CreateEditDiaryBookModal";
import { DiaryBook as IDiaryBook } from "@/types/diaryBook";
import { DiaryFeedItem } from "@/types/diary";

export function DiaryBook() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [books, setBooks] = useState<IDiaryBook[]>([]);
  const [availableDiaries, setAvailableDiaries] = useState<DiaryFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    if (user?.id) {
      setIsLoading(true);
      const [booksData, diariesData] = await Promise.all([
        diaryBookService.fetchUserBooks(user.id),
        diaryService.fetchUserDiaries(user.id)
      ]);
      setBooks(booksData);
      setAvailableDiaries(diariesData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleCreateBook = async (payload: any, selectedIds: string[]) => {
    setIsSaving(true);
    try {
      await diaryBookService.createBook(payload, selectedIds);
      toast.success("Đã tạo cuốn sách mới thành công!");
      setIsModalOpen(false);
      loadData(); // Refresh list
    } catch (error: any) {
      toast.error("Lỗi khi tạo sách: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col font-sans w-full min-h-screen bg-slate-50">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-orange-500" />
              Kệ Sách Của Tôi
            </h1>
            <p className="text-gray-600 mt-2">
              Bộ sưu tập những cuốn nhật ký hành trình thanh xuân của bạn.
            </p>
          </div>

          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tạo cuốn sách mới
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Kệ sách đang trống</h3>
            <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
              Hãy gom nhóm các bài nhật ký của bạn thành những cuốn sách kỹ thuật số tuyệt đẹp nhé!
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:shadow-md text-white rounded-full px-6 py-2">
              Tạo cuốn sách đầu tiên
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book, idx) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 transition-all cursor-pointer group"
                onClick={() => navigate(`/diary-book/${book.id}`)}
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                  <img 
                    src={book.cover_image_url || 'https://images.unsplash.com/photo-1547024842-7c86b2226ef5'} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-white font-bold text-lg leading-tight shadow-sm line-clamp-2">{book.title}</h3>
                    <p className="text-slate-200 text-xs mt-1">{book.diaries_count} bài viết</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <CreateEditDiaryBookModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateBook}
          availableDiaries={availableDiaries}
          isLoading={isSaving}
        />
      </main>
    </div>
  );
}
