import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { diaryBookService } from "@/api/diaryBookService";
import { diaryService } from "@/api/diaryService";
import { FlipBook } from "../../components/wander/book/FlipBook";
import { Button } from "../../components/ui/button";
import { ArrowLeft, BookOpen, Download, FileText, Pencil, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { exportToPDF } from "@/utils/exportUtils";
import { toast } from "sonner";
import { motion } from "motion/react";
import { CreateEditDiaryBookModal } from "../../components/wander/book/CreateEditDiaryBookModal";
import { DiaryBook as IDiaryBook } from "@/types/diaryBook";

export function DiaryBookDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [book, setBook] = useState<IDiaryBook | null>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [availableDiaries, setAvailableDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = async () => {
    if (user?.id && id) {
      setIsLoading(true);
      const [bookDetails, allUserDiaries] = await Promise.all([
        diaryBookService.fetchBookById(id),
        diaryService.fetchUserDiaries(user.id)
      ]);
      setBook(bookDetails.book);
      setDiaries(bookDetails.diaries);
      setAvailableDiaries(allUserDiaries);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, id]);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    toast.info("Đang tạo file PDF, vui lòng đợi...");
    const result = await exportToPDF("exportable-diary-book", `NhatKy_HanhTrinh_${book?.title || 'WanderLab'}`);
    if (result.success) {
      toast.success("Đã tải xuống file PDF thành công!");
    } else {
      toast.error(`Xuất PDF thất bại: ${result.error}`);
    }
    setIsExportingPDF(false);
  };

  const handleEditBook = async (payload: any, selectedIds: string[]) => {
    if (!id) return;
    setIsSaving(true);
    try {
      await diaryBookService.updateBook(id, payload, selectedIds);
      toast.success("Đã cập nhật cuốn sách thành công!");
      setIsEditModalOpen(false);
      loadData(); // Refresh list
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật sách: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Bạn có chắc chắn muốn xóa cuốn sách này không? Các bài viết gốc vẫn sẽ được giữ lại.")) return;
    
    setIsDeleting(true);
    try {
      await diaryBookService.deleteBook(id);
      toast.success("Đã xóa cuốn sách.");
      navigate('/diary-book');
    } catch (error: any) {
      toast.error("Lỗi khi xóa sách: " + error.message);
      setIsDeleting(false);
    }
  };

  if (!isLoading && !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy cuốn sách</h2>
        <Button onClick={() => navigate('/diary-book')} className="mt-4">Quay lại kệ sách</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col font-sans w-full">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate('/diary-book')}
              className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-2 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại Kệ Sách
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-orange-500" />
              {isLoading ? "Đang tải..." : book?.title}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              {book?.description || "Không có mô tả."}
            </p>
          </div>

          {!isLoading && (
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" className="text-slate-600" onClick={() => setIsEditModalOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" /> Sửa
              </Button>
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-4 h-4 mr-2" /> {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
              
              <div className="h-8 w-px bg-slate-200 mx-2 self-center"></div>

              <div className="h-8 w-px bg-slate-200 mx-2 self-center"></div>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleExportPDF}
                disabled={isExportingPDF || diaries.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                {isExportingPDF ? 'Đang xuất...' : 'Tải PDF Bản Đẹp'}
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : diaries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Cuốn sách chưa có nội dung</h3>
            <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
              Hãy chỉnh sửa và thêm các bài nhật ký của bạn vào cuốn sách này nhé.
            </p>
            <Button onClick={() => setIsEditModalOpen(true)} className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:shadow-md text-white rounded-full px-6 py-2">
              Chỉnh sửa cuốn sách
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            {/* Tái sử dụng FlipBook */}
            <FlipBook diaries={diaries} user={user} />
          </motion.div>
        )}
      </main>

      {/* Modal Chỉnh Sửa Sách */}
      {book && (
        <CreateEditDiaryBookModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditBook}
          availableDiaries={availableDiaries}
          bookToEdit={book}
          initialSelectedIds={diaries.map(d => d.id)}
          isLoading={isSaving}
        />
      )}

      {/* Hidden container for Export */}
      <div className="hidden">
        <div id="exportable-diary-book" style={{ padding: '40px', backgroundColor: '#ffffff', color: '#1f2937', maxWidth: '800px', margin: '0 auto', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', lineHeight: '1.6' }}>
          {/* Cover Page */}
          <div style={{ textAlign: 'center', marginBottom: '64px', minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '36pt', fontWeight: 'bold', color: '#ea580c', marginBottom: '20px' }}>{book?.title || 'HÀNH TRÌNH THANH XUÂN'}</h1>
            <h2 style={{ fontSize: '24pt', color: '#333' }}>Tác giả: {user?.full_name || 'Người Dùng WanderLab'}</h2>
            <div style={{ marginTop: '50px', fontSize: '14pt', color: '#666' }}>
              Tổng hợp {diaries.length} chuyến đi đáng nhớ.
            </div>
            {book?.cover_image_url && (
              <div style={{ marginTop: '100px' }}>
                <img src={book.cover_image_url} alt="Cover" crossOrigin="anonymous" style={{ width: '80%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
              </div>
            )}
          </div>

          {/* Table of Contents */}
          <div style={{ pageBreakBefore: 'always', padding: '20px' }}>
            <h2 style={{ fontSize: '24pt', fontWeight: 'bold', borderBottom: '2px solid #ea580c', paddingBottom: '10px', marginBottom: '20px' }}>Mục Lục</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {diaries.map((diary, index) => (
                <li key={`toc-${diary.id}`} style={{ fontSize: '16pt', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Chương {index + 1}: {diary.title}</span>
                  <span style={{ color: '#888' }}>{diary.location}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diary Chapters */}
          {diaries.map((diary, index) => (
            <div key={diary.id} style={{ pageBreakBefore: 'always', padding: '20px' }}>
              {/* Chapter Header */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '14pt', color: '#ea580c', fontWeight: 'bold', textTransform: 'uppercase' }}>Chương {index + 1}</div>
                <h2 style={{ fontSize: '28pt', fontWeight: 'bold', marginTop: '10px', marginBottom: '10px' }}>{diary.title}</h2>
                <div style={{ fontSize: '14pt', color: '#666' }}>{diary.location} • {diary.duration}</div>
              </div>

              {/* Cover Image */}
              {diary.image && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img src={diary.image} alt="Diary Cover" crossOrigin="anonymous" style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} />
                </div>
              )}

              {/* Description */}
              <div style={{ fontSize: '14pt', lineHeight: '1.8', textAlign: 'justify', marginBottom: '30px', whiteSpace: 'pre-wrap' }}>
                {diary.description}
              </div>

              {/* Timeline */}
              {diary.timeline && diary.timeline.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '20pt', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>Lịch trình chi tiết</h3>
                  {diary.timeline.map((day: any) => (
                    <div key={day.day} style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '16pt', fontWeight: 'bold', color: '#333' }}>Ngày {day.day}: {day.title}</h4>
                      {day.activities && day.activities.length > 0 && (
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                          {day.activities.map((act: any, i: number) => {
                            if (typeof act === 'string') {
                              return (
                                <li key={i} style={{ fontSize: '14pt', marginBottom: '8px', lineHeight: '1.5' }}>
                                  • {act}
                                </li>
                              );
                            }
                            return (
                              <li key={i} style={{ fontSize: '14pt', marginBottom: '8px', lineHeight: '1.5' }}>
                                <strong>{act.time}</strong> - {act.title}
                                {act.description && <div style={{ color: '#555', marginTop: '4px' }}>{act.description}</div>}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Budget Breakdown */}
              {diary.budgetBreakdown && diary.budgetBreakdown.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '20pt', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '20px' }}>Chi Phí Chi Tiết</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14pt' }}>
                    <tbody>
                      {diary.budgetBreakdown.map((item: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px 0', color: '#333' }}>{item.category}</td>
                          <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold', color: '#ea580c' }}>
                            {item.amount}
                            {item.percentage && <div style={{ fontSize: '10pt', color: '#888', fontWeight: 'normal' }}>{item.percentage}%</div>}
                          </td>
                        </tr>
                      ))}
                      {diary.totalBudget && (
                        <tr style={{ borderTop: '2px solid #ccc' }}>
                          <td style={{ padding: '15px 0', fontWeight: 'bold', fontSize: '16pt' }}>Tổng cộng</td>
                          <td style={{ padding: '15px 0', textAlign: 'right', fontWeight: 'bold', color: '#ea580c', fontSize: '16pt' }}>{diary.totalBudget}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {/* Back Cover */}
          <div style={{ pageBreakBefore: 'always', minHeight: '800px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24pt', fontWeight: 'bold', color: '#ccc' }}>WanderLab</h1>
            <p style={{ marginTop: '20px', color: '#888', fontSize: '14pt' }}>Khám phá thế giới qua lăng kính của bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
