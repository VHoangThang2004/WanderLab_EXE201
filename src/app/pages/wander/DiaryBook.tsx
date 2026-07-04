import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { diaryService } from "@/api/diaryService";
import { WanderNav } from "../../components/wander/WanderNav";
import { FlipBook } from "../../components/wander/book/FlipBook";
import { Button } from "../../components/ui/button";
import { ArrowLeft, BookOpen, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { exportToPDF, exportToWord } from "@/utils/exportUtils";
import { toast } from "sonner";
import { motion } from "motion/react";

export function DiaryBook() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);

  useEffect(() => {
    async function loadDiaries() {
      if (user?.id) {
        setIsLoading(true);
        const data = await diaryService.fetchUserFullDiaries(user.id);
        setDiaries(data);
        setIsLoading(false);
      }
    }
    loadDiaries();
  }, [user?.id]);

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    toast.info("Đang tạo file PDF, vui lòng đợi...");
    const result = await exportToPDF("exportable-diary-book", `NhatKy_HanhTrinh_${user?.full_name || 'WanderLab'}`);
    if (result.success) {
      toast.success("Đã tải xuống file PDF thành công!");
    } else {
      toast.error(`Xuất PDF thất bại: ${result.error}`);
    }
    setIsExportingPDF(false);
  };

  const handleExportWord = () => {
    setIsExportingWord(true);
    toast.info("Đang tạo file Word...");
    const success = exportToWord("exportable-diary-book", `NhatKy_HanhTrinh_${user?.full_name || 'WanderLab'}`);
    if (success) {
      toast.success("Đã tải xuống file Word thành công!");
    } else {
      toast.error("Xuất Word thất bại.");
    }
    setIsExportingWord(false);
  };

  return (
    <div className="flex flex-col font-sans w-full">
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
              Cuốn Nhật Ký Của Tôi
            </h1>
            <p className="text-gray-600 mt-2">
              Tổng hợp toàn bộ các chuyến đi thanh xuân của bạn thành một cuốn sách kỹ thuật số.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              onClick={handleExportWord}
              disabled={isExportingWord || diaries.length === 0}
            >
              <FileText className="w-4 h-4 mr-2" />
              {isExportingWord ? 'Đang xuất...' : 'Xuất file Word'}
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleExportPDF}
              disabled={isExportingPDF || diaries.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExportingPDF ? 'Đang xuất...' : 'Tải PDF Bản Đẹp'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : diaries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Bạn chưa có trang nhật ký nào</h3>
            <p className="text-gray-600 mt-2 mb-6 max-w-md mx-auto">
              Hãy tạo và lưu giữ chuyến đi đầu tiên để hệ thống tự động đóng thành sách kỹ thuật số cho bạn nhé!
            </p>
            <Button onClick={() => navigate('/create')} className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:shadow-md text-white rounded-full px-6 py-2">
              Viết nhật ký ngay
            </Button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            {/* The visual flipbook component */}
            <FlipBook diaries={diaries} user={user} />
          </motion.div>
        )}
      </main>

      {/* Hidden container for Export (HTML2PDF and Word). This ensures formatting is clean for A4 size export without UI clutter. */}
      {/* Hidden container for Export (HTML2PDF and Word). This ensures formatting is clean for A4 size export without UI clutter. */}
      <div className="hidden">
        <div id="exportable-diary-book" style={{ padding: '32px', backgroundColor: '#ffffff', color: '#000000', width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>
          {/* Cover Page */}
          <div style={{ textAlign: 'center', marginBottom: '64px', height: '270mm', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '36pt', fontWeight: 'bold', color: '#ea580c', marginBottom: '20px' }}>HÀNH TRÌNH THANH XUÂN</h1>
            <h2 style={{ fontSize: '24pt', color: '#333' }}>Tác giả: {user?.full_name || 'Người Dùng WanderLab'}</h2>
            <div style={{ marginTop: '50px', fontSize: '14pt', color: '#666' }}>
              Tổng hợp {diaries.length} chuyến đi đáng nhớ.
            </div>
            <div style={{ marginTop: '100px' }}>
              <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1" alt="Cover" crossOrigin="anonymous" style={{ width: '80%', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
            </div>
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
                {(diary.dates || diary.groupSize || diary.totalBudget) && (
                  <div style={{ fontSize: '14pt', color: '#666', marginTop: '10px' }}>
                    {diary.dates && <span style={{ marginRight: '15px' }}>Thời gian: {diary.dates}</span>}
                    {diary.groupSize && <span style={{ marginRight: '15px' }}>Nhóm: {diary.groupSize}</span>}
                    {diary.totalBudget && <span style={{ color: '#ea580c', fontWeight: 'bold' }}>Ngân sách: {diary.totalBudget}</span>}
                  </div>
                )}
              </div>

              {/* Cover Image */}
              {diary.image && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img src={diary.image} alt="Diary Cover" crossOrigin="anonymous" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px' }} />
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
          <div style={{ pageBreakBefore: 'always', height: '270mm', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ fontSize: '24pt', fontWeight: 'bold', color: '#ccc' }}>WanderLab</h1>
            <p style={{ marginTop: '20px', color: '#888', fontSize: '14pt' }}>Khám phá thế giới qua lăng kính của bạn.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
