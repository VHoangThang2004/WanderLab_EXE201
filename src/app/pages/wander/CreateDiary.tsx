import { useState } from "react";
import {
  MapPin,
  Calendar,
  Wallet,
  Users,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Lock,
  Globe,
  ChevronRight,
  ChevronLeft,
  BookOpen,
} from "lucide-react";

import { useNavigate } from "react-router";
import { diaryService } from "@/api/diaryService";
import type { CreateDiaryPayload } from "@/types/diary";

type PrivacySetting = "private" | "friends" | "public";

export function WanderCreateDiary() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [privacySetting, setPrivacySetting] = useState<PrivacySetting>("public");
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
    groupSize: "1",
    description: "",
    style: "",
  });

  const [timeline, setTimeline] = useState([
    { day: 1, title: "", activities: [""], budget: "" },
  ]);

  const totalSteps = 5;

  const addTimelineDay = () => {
    setTimeline([
      ...timeline,
      { day: timeline.length + 1, title: "", activities: [""], budget: "" },
    ]);
  };

  const removeTimelineDay = (index: number) => {
    if (timeline.length > 1) {
      const newTimeline = timeline.filter((_, i) => i !== index);
      newTimeline.forEach((day, i) => {
        day.day = i + 1;
      });
      setTimeline(newTimeline);
    }
  };

  const addActivity = (dayIndex: number) => {
    const newTimeline = [...timeline];
    newTimeline[dayIndex].activities.push("");
    setTimeline(newTimeline);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const newTimeline = [...timeline];
    newTimeline[dayIndex].activities[activityIndex] = value;
    setTimeline(newTimeline);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newTimeline = [...timeline];
    if (newTimeline[dayIndex].activities.length > 1) {
      newTimeline[dayIndex].activities.splice(activityIndex, 1);
      setTimeline(newTimeline);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !coverFile) {
      alert("Vui lòng điền tiêu đề, địa điểm và tải ảnh bìa lên!");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // 1. Upload ảnh
      const coverUrl = await diaryService.uploadDiaryImage(coverFile);

      // 2. Chuẩn bị payload
      const payload: CreateDiaryPayload = {
        title: formData.title,
        location: formData.location,
        country: "Việt Nam",
        duration: "Nhiều ngày",
        dates: `${formData.startDate} - ${formData.endDate}`,
        total_budget: formData.budget ? `${(parseInt(formData.budget) / 1000000).toFixed(1)} triệu ₫` : "0đ",
        group_size: `${formData.groupSize} người`,
        description: formData.description,
        status: privacySetting === "private" ? "draft" : "published",
        tips: ["Hãy chuẩn bị kem chống nắng", "Đặt phòng trước 1 tháng"], // Mock tips
        budget_notes: ["Nên mang theo một ít tiền mặt"],
        timeline: timeline.map(day => ({
          day: day.day,
          title: day.title || `Ngày ${day.day}`,
          activities: day.activities.filter(a => a.trim() !== ""),
          budget: day.budget ? `${(parseInt(day.budget) / 1000000).toFixed(1)} tr` : "0đ"
        })),
        budget_breakdown: [
          { category: "Di chuyển", amount: "Vừa phải", percentage: 30 },
          { category: "Ăn uống", amount: "Phải chăng", percentage: 40 },
          { category: "Lưu trú", amount: "Giá rẻ", percentage: 30 },
        ]
      };

      // 3. Create diary
      const newDiaryId = await diaryService.createDiary(payload, coverUrl);
      
      alert("Đăng nhật ký thành công!");
      navigate(`/diary/${newDiaryId}`);
    } catch(err: any) {
      console.error(err);
      alert(`Đăng nhật ký thất bại: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accentColor = "text-[#ff3131]";
  const focusRing = "focus:ring-[#ff3131]";
  const primaryBg = "bg-gradient-to-r from-[#ff3131] to-[#ff914d]";

  // Step titles for page header
  const stepTitles = [
    "Thông Tin Cơ Bản",
    "Ngân Sách & Nhóm Du Lịch",
    "Lịch Trình Từng Ngày",
    "Tải Ảnh & Media",
    "Quyền Riêng Tư & Xuất Bản",
  ];

  // Grid constants for notebook alignment
  const GRID_HEIGHT = 32; // Height of each grid line
  const LINE_HEIGHT = `${GRID_HEIGHT}px`; // Text line height matches grid

  return (
    <div className="min-h-screen bg-[#FFF5F3] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <BookOpen className={accentColor} size={18} />
            <span className="text-sm font-medium text-gray-700">Sổ Tay Du Lịch</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tạo Nhật Ký Du Lịch</h1>
          <p className="text-gray-600">Ghi lại từng khoảnh khắc đáng nhớ của hành trình</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index + 1 === currentStep
                  ? "w-12 bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
                  : index + 1 < currentStep
                  ? "w-8 bg-[#ff914d]/50"
                  : "w-8 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Notebook Container */}
        <div className="relative">
          {/* Notebook Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl transform rotate-1 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl transform -rotate-1 opacity-50" />

          {/* Main Notebook Page */}
          <div
            className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
              isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              backgroundImage: `repeating-linear-gradient(transparent, transparent ${GRID_HEIGHT - 1}px, #e5e7eb ${GRID_HEIGHT - 1}px, #e5e7eb ${GRID_HEIGHT}px)`,
              backgroundPosition: "0 0",
            }}
          >
            {/* Red Margin Line (notebook style) */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300" />

            {/* Page Header */}
            <div className="px-16 py-6 border-b-2 border-gray-200 bg-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Trang {currentStep} / {totalSteps}</div>
                  <h2 className="text-2xl font-bold text-gray-900">{stepTitles[currentStep - 1]}</h2>
                </div>
                <div className={`text-3xl font-bold ${accentColor}`}>{Math.round(progressPercentage)}%</div>
              </div>
            </div>

            {/* Page Content */}
            <div className="px-16 py-8 min-h-[500px]">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-0">
                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0" 
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      ✍️ Tiêu Đề Chuyến Đi *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Khám Phá Vịnh Hạ Long 5 Ngày"
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                      style={{ 
                        lineHeight: LINE_HEIGHT, 
                        height: LINE_HEIGHT,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      📍 Địa Điểm *
                    </label>
                    <div className="relative" style={{ height: LINE_HEIGHT }}>
                      <MapPin 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="VD: Hội An, Quảng Nam"
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                        style={{ 
                          lineHeight: LINE_HEIGHT, 
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: LINE_HEIGHT }}>
                    <div>
                      <label 
                        className="block font-bold text-gray-900 mb-0"
                        style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                      >
                        📅 Ngày Bắt Đầu *
                      </label>
                      <div className="relative" style={{ height: LINE_HEIGHT }}>
                        <Calendar 
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" 
                          size={20} 
                        />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                          style={{ 
                            lineHeight: LINE_HEIGHT, 
                            height: LINE_HEIGHT,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label 
                        className="block font-bold text-gray-900 mb-0"
                        style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                      >
                        📅 Ngày Kết Thúc *
                      </label>
                      <div className="relative" style={{ height: LINE_HEIGHT }}>
                        <Calendar 
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" 
                          size={20} 
                        />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                          style={{ 
                            lineHeight: LINE_HEIGHT, 
                            height: LINE_HEIGHT,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      🎨 Phong Cách Du Lịch *
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                      style={{ 
                        lineHeight: LINE_HEIGHT, 
                        height: LINE_HEIGHT,
                      }}
                    >
                      <option value="">Chọn phong cách</option>
                      <option value="Trekking">Trekking & Leo Núi</option>
                      <option value="Food">Ẩm Thực</option>
                      <option value="Cultural">Văn Hoá & Di Sản</option>
                      <option value="Luxury">Cao Cấp</option>
                      <option value="Budget">Tiết Kiệm</option>
                      <option value="Beach">Biển & Nghỉ Dưỡng</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Group */}
              {currentStep === 2 && (
                <div className="space-y-0">
                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      💰 Tổng Ngân Sách (VND) *
                    </label>
                    <div className="relative" style={{ height: LINE_HEIGHT }}>
                      <Wallet 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        placeholder="VD: 5000000"
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                        style={{ 
                          lineHeight: LINE_HEIGHT, 
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                    <p 
                      className="text-sm text-gray-600" 
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      Bao gồm tất cả chi phí (lưu trú, ăn uống, di chuyển, tham quan)
                    </p>
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      👥 Số Người *
                    </label>
                    <div className="relative" style={{ height: LINE_HEIGHT }}>
                      <Users 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400" 
                        size={20} 
                      />
                      <input
                        type="number"
                        value={formData.groupSize}
                        onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                        min="1"
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] transition-colors"
                        style={{ 
                          lineHeight: LINE_HEIGHT, 
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: `${GRID_HEIGHT}px` }}>
                    <label 
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      📝 Mô Tả Chuyến Đi *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Chia sẻ điều đặc biệt nhất của chuyến đi. Bao gồm điểm nổi bật, trải nghiệm đáng nhớ và đối tượng phù hợp..."
                      rows={6}
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-[#ff3131] resize-none"
                      style={{
                        lineHeight: LINE_HEIGHT,
                      }}
                    />
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-l-4 border-[#ff3131]">
                    <div className="flex items-start gap-3">
                      <Sparkles className={`${accentColor} flex-shrink-0 mt-1`} size={20} />
                      <div>
                        <p 
                          className="font-bold text-gray-900 mb-0"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          💡 Gợi Ý AI
                        </p>
                        <p 
                          className="text-sm text-gray-600"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          Dựa trên địa điểm và ngày tháng của bạn, AI có thể gợi ý ngân sách hàng ngày và hoạt động tối ưu.
                        </p>
                        <button className={`text-sm ${accentColor} font-bold hover:underline`}>
                          Bật Trợ Lý AI →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Timeline */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className={accentColor} size={20} />
                      <span className="font-bold text-gray-900">Lịch trình chi tiết</span>
                    </div>
                    <button
                      onClick={addTimelineDay}
                      className={`flex items-center gap-2 px-4 py-2 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm`}
                    >
                      <Plus size={16} />
                      Thêm Ngày
                    </button>
                  </div>

                  <div className="space-y-4">
                    {timeline.map((day, dayIndex) => (
                      <div key={day.day} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-l-4 border-[#ff914d]">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center gap-2 ${primaryBg} text-white px-4 py-1.5 rounded-full font-bold text-sm`}>
                            <Calendar size={14} />
                            Ngày {day.day}
                          </div>
                          {timeline.length > 1 && (
                            <button
                              onClick={() => removeTimelineDay(dayIndex)}
                              className="text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => {
                              const newTimeline = [...timeline];
                              newTimeline[dayIndex].title = e.target.value;
                              setTimeline(newTimeline);
                            }}
                            placeholder="Tiêu đề ngày (VD: Đến Hà Nội – Thăm Phố Cổ)"
                            className={`w-full px-4 py-2.5 border-b-2 border-gray-300 bg-white/60 focus:outline-none focus:border-[#ff3131] transition-colors rounded-t-lg font-semibold`}
                          />

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Hoạt Động</label>
                            <div className="space-y-2">
                              {day.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={activity}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                    placeholder={`Hoạt động ${activityIndex + 1}`}
                                    className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                                  />
                                  {day.activities.length > 1 && (
                                    <button
                                      onClick={() => removeActivity(dayIndex, activityIndex)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => addActivity(dayIndex)}
                              className={`text-sm ${accentColor} font-bold mt-2 hover:underline`}
                            >
                              + Thêm Hoạt Động
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">Ngân Sách Ngày (VND)</label>
                            <div className="relative">
                              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <input
                                type="number"
                                value={day.budget}
                                onChange={(e) => {
                                  const newTimeline = [...timeline];
                                  newTimeline[dayIndex].budget = e.target.value;
                                  setTimeline(newTimeline);
                                }}
                                placeholder="Ngân sách ngày"
                                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Media Upload */}
              {currentStep === 4 && (
                <div className="space-y-0">
                  <div 
                    className={`border-2 border-dashed ${coverFile ? 'border-green-500 bg-green-50' : 'border-gray-400 hover:border-[#ff3131] hover:bg-amber-50/30'} rounded-2xl p-12 text-center transition-all cursor-pointer relative`} 
                    style={{ marginBottom: `${GRID_HEIGHT}px` }}
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setCoverFile(file);
                          setCoverPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {coverPreview ? (
                      <div className="flex flex-col items-center">
                        <img src={coverPreview} alt="Preview" className="h-32 object-cover rounded-xl mb-3 shadow-md" />
                        <p className="font-bold text-green-600">Đã chọn ảnh bìa: {coverFile?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">Nhấn để thay đổi</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                        <p 
                          className="font-bold text-gray-900"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          📸 Nhấn vào đây để tải ảnh bìa lên (Bắt buộc)
                        </p>
                        <p 
                          className="text-sm text-gray-600"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          Tải lên hình ảnh chất lượng cao từ chuyến đi của bạn (JPG, PNG, tối đa 10MB)
                        </p>
                      </>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500" style={{ marginBottom: `${GRID_HEIGHT}px` }}>
                    <h3 
                      className="font-bold text-gray-900"
                      style={{ lineHeight: LINE_HEIGHT }}
                    >
                      📸 Mẹo Chụp Ảnh
                    </h3>
                    <ul className="space-y-0 text-sm text-gray-700">
                      <li style={{ lineHeight: LINE_HEIGHT }}>• Sử dụng hình ảnh độ phân giải cao để tăng chất lượng</li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>• Kết hợp ảnh phong cảnh, hoạt động và văn hoá địa phương</li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>• Chọn một ảnh bìa nổi bật cho nhật ký</li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>• Thêm chú thích để kể câu chuyện đằng sau mỗi bức ảnh</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 5: Privacy & Publish */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-4">
                      🔒 Ai có thể xem nhật ký này? *
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "public", icon: Globe, label: "Công Khai", desc: "Tất cả mọi người trên WanderLab đều có thể xem" },
                        { value: "friends", icon: Users, label: "Chỉ Người Theo Dõi", desc: "Chỉ những người theo dõi bạn mới thấy" },
                        { value: "private", icon: Lock, label: "Riêng Tư", desc: "Chỉ bạn mới xem được (lưu nháp)" },
                      ].map(({ value, icon: Icon, label, desc }) => (
                        <button
                          key={value}
                          onClick={() => setPrivacySetting(value as PrivacySetting)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            privacySetting === value
                              ? "border-[#ff3131] bg-gradient-to-br from-orange-50 to-amber-50"
                              : "border-gray-300 hover:border-gray-400 bg-white"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            privacySetting === value ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d]" : "bg-gray-100"
                          }`}>
                            <Icon className={privacySetting === value ? "text-white" : "text-gray-400"} size={24} />
                          </div>
                          <div className="text-left flex-1">
                            <p className="font-bold text-gray-900">{label}</p>
                            <p className="text-sm text-gray-600">{desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={`${primaryBg} rounded-2xl p-6 text-white`}>
                    <h3 className="font-bold mb-2">🎉 Sẵn Sàng Truyền Cảm Hứng!</h3>
                    <p className="text-white/90 mb-4">
                      Nhật ký của bạn sẽ được xem xét về tính xác thực và có thể được đề xuất trên trang chủ.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Eye size={16} />
                      <span>Ước tính 500+ người dùng sẽ xem nhật ký của bạn trong tuần đầu tiên</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      Tôi xác nhận tất cả thông tin là chính xác và tôi sở hữu bản quyền của nội dung đã tải lên. Tôi đồng ý với{" "}
                      <a href="#" className={`${accentColor} hover:underline font-semibold`}>Điều Khoản Dịch Vụ</a> và{" "}
                      <a href="#" className={`${accentColor} hover:underline font-semibold`}>Chính Sách Nội Dung</a> của WanderLab.
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Page Footer / Navigation */}
            <div className="px-16 py-6 border-t-2 border-gray-200 bg-white/80">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                  Trang Trước
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-6 py-3 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                  >
                    Trang Tiếp
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {isSubmitting ? "Đang Đăng..." : "Đăng Nhật Ký"}
                    {!isSubmitting && <Sparkles size={20} />}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Page Corner Curl Effect */}
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-gray-300 to-transparent rounded-tl-3xl opacity-20" />
        </div>
      </div>
    </div>
  );
}