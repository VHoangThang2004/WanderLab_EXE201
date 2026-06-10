import { useState, useEffect, useRef } from "react";
import { VIETNAM_PROVINCES, normalizeSearchString } from "@/utils/vietnamProvinces";
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

import { useNavigate, useParams } from "react-router";
import { diaryService } from "@/api/diaryService";
import type { CreateDiaryPayload } from "@/types/diary";
import { useLanguageStore } from "@/stores";

type PrivacySetting = "private" | "friends" | "public";

export function WanderEditDiary() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguageStore();
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

  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredProvinces = VIETNAM_PROVINCES.filter(province => {
    const normalizedProvince = normalizeSearchString(province);
    const normalizedInput = normalizeSearchString(formData.location);
    return normalizedProvince.includes(normalizedInput);
  });

  const [timeline, setTimeline] = useState([
    { day: 1, title: "", activities: [""], budget: "" },
  ]);

  const totalSteps = 5;

  useEffect(() => {
    if (id) {
      diaryService.fetchDiaryById(id).then(diary => {
        setFormData({
          title: diary.title || "",
          location: diary.location || "",
          startDate: diary.dates?.split(' - ')[0] || "",
          endDate: diary.dates?.split(' - ')[1] || "",
          budget: diary.totalBudget ? String(parseInt(diary.totalBudget.replace(/[^0-9]/g, '')) * 1000000) : "",
          groupSize: diary.groupSize?.replace(/[^0-9]/g, '') || "1",
          description: diary.description || "",
          style: diary.style || "",
        });
        setCoverPreview(diary.image || "");
        if (diary.timeline && diary.timeline.length > 0) {
          setTimeline(diary.timeline.map((day: any) => ({
            day: day.day,
            title: day.title || "",
            activities: day.activities?.length ? day.activities : [""],
            budget: day.budget || ""
          })));
        }
      }).catch(err => {
        console.error("Lỗi khi tải nhật ký", err);
      });
    }
  }, [id]);

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
    if (!formData.title || !formData.location || (!coverFile && !coverPreview)) {
      alert("Vui lòng điền tiêu đề, địa điểm và có ảnh bìa!");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload ảnh (if new file selected)
      let coverUrl = undefined;
      if (coverFile) {
        coverUrl = await diaryService.uploadDiaryImage(coverFile);
      }

      // 2. Chuẩn bị payload
      const payload: Partial<CreateDiaryPayload> = {
        title: formData.title,
        location: formData.location,
        country: "Việt Nam",
        duration: `${timeline.length} ngày`,
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

      // 3. Update diary
      if (id) {
        await diaryService.updateDiary(id, payload, coverUrl);
        alert(language === 'vi' ? "Cập nhật nhật ký thành công!" : "Travel journal updated successfully!");
        navigate(`/diary/${id}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`${language === 'vi' ? 'Cập nhật thất bại' : 'Update failed'}: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accentColor = "text-[#ff3131]";
  const focusRing = "focus:ring-[#ff3131]";
  const primaryBg = "bg-gradient-to-r from-[#ff3131] to-[#ff914d]";

  // Step titles for page header
  const stepTitles = [
    t("step1", "createDiary"),
    language === 'vi' ? "Ngân Sách & Nhóm Du Lịch" : "Budget & Travel Group",
    t("step2", "createDiary"),
    t("step4", "createDiary"),
    t("step5", "createDiary"),
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
            <span className="text-sm font-medium text-gray-700">
              {language === 'vi' ? "Sổ Tay Du Lịch" : "Travel Notebook"}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {language === 'vi' ? 'Chỉnh Sửa Nhật Ký' : 'Edit Journal'}
          </h1>
          <p className="text-gray-600">
            {language === 'vi' ? "Ghi lại từng khoảnh khắc đáng nhớ của hành trình" : "Record every memorable moment of your journey"}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${index + 1 === currentStep
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
            className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
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
                  <div className="text-sm text-gray-500 mb-1">
                    {language === 'vi' ? 'Trang' : 'Page'} {currentStep} / {totalSteps}
                  </div>
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
                      {language === 'vi' ? "✍️ Tiêu Đề Chuyến Đi *" : "✍️ Trip Title *"}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={language === 'vi' ? "VD: Khám Phá Vịnh Hạ Long 5 Ngày" : "E.g. Explore Ha Long Bay 5 Days"}
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
                      style={{
                        lineHeight: LINE_HEIGHT,
                        height: LINE_HEIGHT,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }} className="relative" ref={dropdownRef}>
                    <label
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "📍 Địa Điểm *" : "📍 Location *"}
                    </label>
                    <div className="relative" style={{ height: LINE_HEIGHT }}>
                      <MapPin
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => {
                          setFormData({ ...formData, location: e.target.value });
                          setIsLocationDropdownOpen(true);
                        }}
                        onFocus={() => setIsLocationDropdownOpen(true)}
                        placeholder={language === 'vi' ? "VD: Hội An, Quảng Nam" : "E.g. Hoi An, Quang Nam"}
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
                        style={{
                          lineHeight: LINE_HEIGHT,
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                    {isLocationDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl transition-all duration-200">
                        {filteredProvinces.length > 0 ? (
                          filteredProvinces.map((province) => (
                            <button
                              key={province}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, location: province });
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#ff3131]/10 hover:to-[#ff914d]/10 hover:text-[#ff3131] font-medium transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2"
                            >
                              <MapPin size={14} className="text-[#ff3131]" />
                              {province}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                            {language === 'vi' ? 'Không tìm thấy tỉnh thành nào khớp' : 'No matching provinces found'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: LINE_HEIGHT }}>
                    <div>
                      <label
                        className="block font-bold text-gray-900 mb-0"
                        style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                      >
                        {language === 'vi' ? "📅 Ngày Bắt Đầu *" : "📅 Start Date *"}
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
                          className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
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
                        {language === 'vi' ? "📅 Ngày Kết Thúc *" : "📅 End Date *"}
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
                          className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
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
                      {language === 'vi' ? "🎨 Phong Cách Du Lịch *" : "🎨 Travel Style *"}
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
                      style={{
                        lineHeight: LINE_HEIGHT,
                        height: LINE_HEIGHT,
                      }}
                    >
                      <option value="">{language === 'vi' ? "Chọn phong cách" : "Select style"}</option>
                      <option value="Trekking">{language === 'vi' ? "Trekking & Leo Núi" : "Trekking & Climbing"}</option>
                      <option value="Food">{language === 'vi' ? "Ẩm Thực" : "Culinary"}</option>
                      <option value="Cultural">{language === 'vi' ? "Văn Hoá & Di Sản" : "Culture & Heritage"}</option>
                      <option value="Luxury">{language === 'vi' ? "Cao Cấp" : "Luxury"}</option>
                      <option value="Budget">{language === 'vi' ? "Tiết Kiệm" : "Budget"}</option>
                      <option value="Beach">{language === 'vi' ? "Biển & Nghỉ Dưỡng" : "Beach & Resort"}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Group */}
              {currentStep === 2 && (
                <div className="space-y-0">
                  <div style={{ marginBottom: "3rem" }}>
                    <label
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "💰 Tổng Ngân Sách (VND) *" : "💰 Total Budget (VND) *"}
                    </label>
                    <div className="relative" style={{ height: LINE_HEIGHT }}>
                      <Wallet
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formData.budget}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "" || /^[0-9]+$/.test(val)) {
                            setFormData({ ...formData, budget: val });
                          }
                        }}
                        placeholder={language === 'vi' ? "VD: 5000000" : "E.g. 5000000"}
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
                        style={{
                          lineHeight: LINE_HEIGHT,
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                    {/* Budget Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-2 pt-1">
                      {[
                        { value: "3000000", label: "3.000.000đ" },
                        { value: "5000000", label: "5.000.000đ" },
                        { value: "10000000", label: "10.000.000đ" },
                        { value: "15000000", label: "15.000.000đ" },
                        { value: "20000000", label: "20.000.000đ" }
                      ].map((sug) => {
                        const isActive = formData.budget === sug.value;
                        return (
                          <button
                            key={sug.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: sug.value })}
                            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm scale-105"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 border border-gray-200"
                            }`}
                          >
                            {sug.label}
                          </button>
                        );
                      })}
                    </div>
                    <p
                      className="text-sm text-gray-600 mt-1"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "Bao gồm tất cả chi phí (lưu trú, ăn uống, di chuyển, tham quan)" : "Includes all expenses (accommodation, dining, transport, sightseeing)"}
                    </p>
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label
                      className="block font-bold text-gray-900 mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "👥 Số Người *" : "👥 Number of People *"}
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
                        className="w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] transition-colors"
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
                      {language === 'vi' ? "📝 Mô Tả Chuyến Đi *" : "📝 Trip Description *"}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={language === 'vi' ? "Chia sẻ điều đặc biệt nhất của chuyến đi. Bao gồm điểm nổi bật, trải nghiệm đáng nhớ và đối tượng phù hợp..." : "Share the most special aspects of your trip. Include highlights, memorable experiences and target audience..."}
                      rows={6}
                      className="w-full px-0 py-0 border-0 border-b-2 border-gray-300 bg-transparent text-gray-900 focus:outline-none focus:border-[#ff3131] resize-none"
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
                          {language === 'vi' ? "💡 Gợi Ý AI" : "💡 AI Suggestions"}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          {language === 'vi' ? "Dựa trên địa điểm và ngày tháng của bạn, AI có thể gợi ý ngân sách hàng ngày và hoạt động tối ưu." : "Based on your location and dates, AI can suggest daily budget and optimal activities."}
                        </p>
                        <button className={`text-sm ${accentColor} font-bold hover:underline`}>
                          {language === 'vi' ? "Bật Trợ Lý AI →" : "Enable AI Assistant →"}
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
                      <span className="font-bold text-gray-900">{language === 'vi' ? "Lịch trình chi tiết" : "Detailed itinerary"}</span>
                    </div>
                    <button
                      onClick={addTimelineDay}
                      className={`flex items-center gap-2 px-4 py-2 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all text-sm`}
                    >
                      <Plus size={16} />
                      {language === 'vi' ? "Thêm Ngày" : "Add Day"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {timeline.map((day, dayIndex) => (
                      <div key={day.day} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border-l-4 border-[#ff914d]">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center gap-2 ${primaryBg} text-white px-4 py-1.5 rounded-full font-bold text-sm`}>
                            <Calendar size={14} />
                            {language === 'vi' ? "Ngày" : "Day"} {day.day}
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
                            placeholder={language === 'vi' ? "Tiêu đề ngày (VD: Đến Hà Nội – Thăm Phố Cổ)" : "Day title (E.g. Arrive in Hanoi - Visit Old Quarter)"}
                            className={`w-full px-4 py-2.5 border-b-2 border-gray-300 bg-white/60 focus:outline-none focus:border-[#ff3131] transition-colors rounded-t-lg font-semibold`}
                          />

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">{language === 'vi' ? "Hoạt Động" : "Activities"}</label>
                            <div className="space-y-2">
                              {day.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={activity}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                    placeholder={language === 'vi' ? `Hoạt động ${activityIndex + 1}` : `Activity ${activityIndex + 1}`}
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
                              {language === 'vi' ? "+ Thêm Hoạt Động" : "+ Add Activity"}
                            </button>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2">{language === 'vi' ? "Ngân Sách Ngày (VND)" : "Daily Budget (VND)"}</label>
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
                                placeholder={language === 'vi' ? "Ngân sách ngày" : "Daily budget"}
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
                        <p className="font-bold text-green-600">
                          {language === 'vi' ? 'Đã chọn ảnh bìa:' : 'Cover image selected:'} {coverFile?.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {language === 'vi' ? 'Nhấn để thay đổi' : 'Click to change'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                        <p
                          className="font-bold text-gray-900"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          {language === 'vi' ? '📸 Nhấn vào đây để tải ảnh bìa lên (Bắt buộc)' : '📸 Click here to upload a cover image (Required)'}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          {language === 'vi' ? 'Tải lên hình ảnh chất lượng cao từ chuyến đi của bạn (JPG, PNG, tối đa 10MB)' : 'Upload high-quality images from your trip (JPG, PNG, max 10MB)'}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500" style={{ marginBottom: `${GRID_HEIGHT}px` }}>
                    <h3
                      className="font-bold text-gray-900"
                      style={{ lineHeight: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? '📸 Mẹo Chụp Ảnh' : '📸 Photography Tips'}
                    </h3>
                    <ul className="space-y-0 text-sm text-gray-700">
                      <li style={{ lineHeight: LINE_HEIGHT }}>
                        {language === 'vi' ? '• Sử dụng hình ảnh độ phân giải cao để tăng chất lượng' : '• Use high-resolution images to improve quality'}
                      </li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>
                        {language === 'vi' ? '• Kết hợp ảnh phong cảnh, hoạt động và văn hoá địa phương' : '• Combine landscape, activity, and local culture photos'}
                      </li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>
                        {language === 'vi' ? '• Chọn một ảnh bìa nổi bật cho nhật ký' : '• Choose a striking cover image for your journal'}
                      </li>
                      <li style={{ lineHeight: LINE_HEIGHT }}>
                        {language === 'vi' ? '• Thêm chú thích để kể câu chuyện đằng sau mỗi bức ảnh' : '• Add captions to tell the story behind each photo'}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 5: Privacy & Publish */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-4">
                      {language === 'vi' ? "🔒 Ai có thể xem nhật ký này? *" : "🔒 Who can view this journal? *"}
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: "public", icon: Globe, label: t("privacyPublic", "createDiary"), desc: t("privacyPublicDesc", "createDiary") },
                        { value: "friends", icon: Users, label: t("privacyFriends", "createDiary"), desc: t("privacyFriendsDesc", "createDiary") },
                        { value: "private", icon: Lock, label: t("privacyPrivate", "createDiary"), desc: t("privacyPrivateDesc", "createDiary") },
                      ].map(({ value, icon: Icon, label, desc }) => (
                        <button
                          key={value}
                          onClick={() => setPrivacySetting(value as PrivacySetting)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${privacySetting === value
                              ? "border-[#ff3131] bg-gradient-to-br from-orange-50 to-amber-50"
                              : "border-gray-300 hover:border-gray-400 bg-white"
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${privacySetting === value ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d]" : "bg-gray-100"
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
                    <h3 className="font-bold mb-2">
                      {language === 'vi' ? '🎉 Sẵn Sàng Truyền Cảm Hứng!' : '🎉 Ready to Inspire!'}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {language === 'vi'
                        ? 'Nhật ký của bạn sẽ được xem xét về tính xác thực và có thể được đề xuất trên trang chủ.'
                        : 'Your journal will be reviewed for authenticity and may be featured on the homepage.'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Eye size={16} />
                      <span>
                        {language === 'vi'
                          ? 'Ước tính 500+ người dùng sẽ xem nhật ký của bạn trong tuần đầu tiên'
                          : 'Estimated 500+ users will view your journal in the first week'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
                    <input type="checkbox" id="terms" className="mt-1" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      {language === 'vi'
                        ? 'Tôi xác nhận tất cả thông tin là chính xác và tôi sở hữu bản quyền của nội dung đã tải lên. Tôi đồng ý với '
                        : 'I confirm that all information is accurate and I own the copyright of the uploaded content. I agree to '}
                      <a href="#" className={`${accentColor} hover:underline font-semibold`}>
                        {language === 'vi' ? 'Điều Khoản Dịch Vụ' : 'Terms of Service'}
                      </a>
                      {language === 'vi' ? ' và ' : ' and '}
                      <a href="#" className={`${accentColor} hover:underline font-semibold`}>
                        {language === 'vi' ? 'Chính Sách Nội Dung' : 'Content Policy'}
                      </a>
                      {language === 'vi' ? ' của WanderLab.' : ' of WanderLab.'}
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
                  {t("prev", "createDiary")}
                </button>

                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-6 py-3 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                  >
                    {t("next", "createDiary")}
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 ${primaryBg} text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50`}
                  >
                    {isSubmitting
                      ? (language === 'vi' ? "Đang Đăng..." : "Publishing...")
                      : t("finish", "createDiary")}
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