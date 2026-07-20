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
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router";
import { diaryService } from "@/api/diaryService";
import type { CreateDiaryPayload } from "@/types/diary";
import { useLanguageStore, useNotificationStore, useAuthStore, useUIStore } from "@/stores";
import { aiService } from "@/api/aiService";
import { toast } from "sonner";
import { useUsageLimits } from "@/hooks/useUsageLimits";

type PrivacySetting = "private" | "friends" | "public";

export function WanderCreateDiary() {
  const { t, language } = useLanguageStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { isDarkMode } = useUIStore();
  const { checkLimit, incrementUsage, checkMediaLimits, validateVideoResolution } = useUsageLimits();
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

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [isAiAssistantEnabled, setIsAiAssistantEnabled] = useState(false);


  const handleAiPolish = async () => {
    if (!checkLimit('ai_diary')) return;

    if (!formData.description.trim()) {
      toast.error(
        language === 'vi'
          ? "Vui lòng nhập trước một đoạn mô tả ngắn hoặc ý tưởng để AI viết tiếp!"
          : "Please write a short description or ideas first so the AI can continue writing!"
      );
      return;
    }

    setAiLoading(true);
    setShowAiPanel(true);
    setAiSuggestion("");

    try {
      const polished = await aiService.polishDescription(formData.description, formData, language);
      setAiSuggestion(polished);
      incrementUsage('ai_diary');
      toast.success(
        language === 'vi'
          ? "Đã tạo mô tả hoàn thiện thành công!"
          : "Successfully generated polished description!"
      );
    } catch (error: any) {
      console.error(error);
      toast.error(
        (language === 'vi' ? "Lỗi gọi AI: " : "AI Call Error: ") + error.message
      );
      setShowAiPanel(false);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    setFormData(prev => ({ ...prev, description: aiSuggestion }));
    setShowAiPanel(false);
    toast.success(
      language === 'vi'
        ? "Đã áp dụng mô tả từ AI!"
        : "Applied AI description!"
    );
  };

  const handleAppendAiSuggestion = () => {
    setFormData(prev => {
      const separator = prev.description.endsWith(" ") || prev.description.length === 0 ? "" : " ";
      return {
        ...prev,
        description: prev.description + separator + aiSuggestion
      };
    });
    setShowAiPanel(false);
    toast.success(
      language === 'vi'
        ? "Đã chèn tiếp gợi ý từ AI!"
        : "Appended AI suggestion!"
    );
  };

  const handleToggleAiAssistant = () => {
    if (isAiAssistantEnabled) {
      setIsAiAssistantEnabled(false);
      setShowAiPanel(false);
      setAiSuggestion("");
    } else {
      setIsAiAssistantEnabled(true);
    }
  };

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

  const [timeline, setTimeline] = useState<any[]>([
    { day: 1, title: "", activities: [""], budget: "", imageFiles: [], videoFiles: [], audioFiles: [] },
  ]);

  const totalSteps = 4;

  const addTimelineDay = () => {
    setTimeline([
      ...timeline,
      { day: timeline.length + 1, title: "", activities: [""], budget: "", imageFiles: [], videoFiles: [], audioFiles: [] },
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
    if (!checkLimit('create_diary')) return;

    if (!formData.title || !formData.location || !coverFile) {
      alert("Vui lòng điền tiêu đề, địa điểm và tải ảnh bìa lên!");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload ảnh
      const coverUrl = await diaryService.uploadDiaryImage(coverFile);

      // 1.5 Upload timeline files
      const timelineWithUrls = await Promise.all(timeline.map(async (day) => {
        const imageUrls = await Promise.all((day.imageFiles || []).map((file: File) => diaryService.uploadDiaryImage(file)));
        const videoUrls = await Promise.all((day.videoFiles || []).map((file: File) => diaryService.uploadDiaryImage(file)));
        const audioUrls = await Promise.all((day.audioFiles || []).map((file: File) => diaryService.uploadDiaryImage(file)));

        return {
          day: day.day,
          title: day.title || `Ngày ${day.day}`,
          activities: day.activities.filter((a: string) => a.trim() !== ""),
          budget: day.budget ? `${(parseInt(day.budget) / 1000000).toFixed(1)} tr` : "0đ",
          images: imageUrls,
          videos: videoUrls,
          audios: audioUrls,
        };
      }));

      // 2. Chuẩn bị payload
      const payload: CreateDiaryPayload = {
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
        timeline: timelineWithUrls,
        budget_breakdown: [
          { category: "Di chuyển", amount: "Vừa phải", percentage: 30 },
          { category: "Ăn uống", amount: "Phải chăng", percentage: 40 },
          { category: "Lưu trú", amount: "Giá rẻ", percentage: 30 },
        ]
      };

      // 3. Create diary
      await diaryService.createDiary(payload, coverUrl);

      // Create notification
      addNotification({
        type: "post",
        title: language === 'vi' ? "Đăng bài thành công" : "Post published successfully",
        message: language === 'vi' ? `Bài viết "${formData.title}" của bạn đã được đăng.` : `Your post "${formData.title}" has been published.`,
        linkTo: "/dashboard",
        avatar: user?.avatar_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      });

      alert(language === 'vi' ? "Đăng nhật ký thành công!" : "Travel journal published successfully!");
      incrementUsage('create_diary');
      navigate(`/dashboard`);
    } catch (err: any) {
      console.error(err);
      alert(`${language === 'vi' ? 'Đăng nhật ký thất bại' : 'Failed to publish travel journal'}: ${err.message}`);
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
    language === 'vi' ? "Lịch Trình & Media" : "Timeline & Media",
    t("step5", "createDiary"),
  ];

  // Grid constants for notebook alignment
  const GRID_HEIGHT = 32; // Height of each grid line
  const LINE_HEIGHT = `${GRID_HEIGHT}px`; // Text line height matches grid

  return (
    <div className="min-h-screen bg-[#FFF5F3] dark:bg-background transition-colors duration-300 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-900 rounded-full shadow-sm mb-4 transition-colors">
            <BookOpen className={accentColor} size={18} />
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              {language === 'vi' ? "Sổ Tay Du Lịch" : "Travel Notebook"}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t("title", "createDiary")}
          </h1>
          <p className="text-gray-600 dark:text-neutral-400">
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
                  ? "w-8 bg-[#ff914d]/50 dark:bg-[#ff914d]/30"
                  : "w-8 bg-gray-300 dark:bg-neutral-700"
                }`}
            />
          ))}
        </div>

        {/* Notebook Container */}
        <div className="relative">
          {/* Notebook Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl transform rotate-1 opacity-30 dark:opacity-80 transition-all" />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-neutral-800/50 dark:to-neutral-900/50 rounded-2xl transform -rotate-1 opacity-50 dark:opacity-60 transition-all" />

          {/* Main Notebook Page */}
          <div
            className={`relative bg-white dark:bg-neutral-900 notebook-page rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            style={{
              backgroundImage: isDarkMode
                ? `repeating-linear-gradient(transparent, transparent ${GRID_HEIGHT - 1}px, rgba(255, 255, 255, 0.08) ${GRID_HEIGHT - 1}px, rgba(255, 255, 255, 0.08) ${GRID_HEIGHT}px)`
                : `repeating-linear-gradient(transparent, transparent ${GRID_HEIGHT - 1}px, #e5e7eb ${GRID_HEIGHT - 1}px, #e5e7eb ${GRID_HEIGHT}px)`,
              backgroundPosition: "0 0",
            }}
          >
            {/* Red Margin Line (notebook style) */}
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-red-300 dark:bg-red-900/50" />

            {/* Page Header */}
            <div className="px-16 py-6 border-b-2 border-gray-200 dark:border-neutral-850 bg-white/80 dark:bg-neutral-900/80 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                    {language === 'vi' ? 'Trang' : 'Page'} {currentStep} / {totalSteps}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stepTitles[currentStep - 1]}</h2>
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
                      className="block font-bold text-gray-900 dark:text-white mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "✍️ Tiêu Đề Chuyến Đi *" : "✍️ Trip Title *"}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder={language === 'vi' ? "VD: Khám Phá Vịnh Hạ Long 5 Ngày" : "E.g. Explore Ha Long Bay 5 Days"}
                      className="notebook-input w-full px-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
                      style={{
                        lineHeight: LINE_HEIGHT,
                        height: LINE_HEIGHT,
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }} className="relative" ref={dropdownRef}>
                    <label
                      className="block font-bold text-gray-900 dark:text-white mb-0"
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
                        className="notebook-input w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
                        style={{
                          lineHeight: LINE_HEIGHT,
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                    {isLocationDropdownOpen && (
                      <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-xl transition-all duration-200">
                        {filteredProvinces.length > 0 ? (
                          filteredProvinces.map((province) => (
                            <button
                              key={province}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, location: province });
                                setIsLocationDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-[#ff3131]/10 hover:to-[#ff914d]/10 dark:hover:from-[#ff3131]/20 dark:hover:to-[#ff914d]/20 hover:text-[#ff3131] dark:hover:text-white font-medium transition-colors border-b border-gray-50 dark:border-neutral-800/50 last:border-0 flex items-center gap-2"
                            >
                              <MapPin size={14} className="text-[#ff3131]" />
                              {province}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500 dark:text-neutral-450 text-center italic">
                            {language === 'vi' ? 'Không tìm thấy tỉnh thành nào khớp' : 'No matching provinces found'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: LINE_HEIGHT }}>
                    <div>
                      <label
                        className="block font-bold text-gray-900 dark:text-white mb-0"
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
                          className="notebook-input w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
                          style={{
                            lineHeight: LINE_HEIGHT,
                            height: LINE_HEIGHT,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block font-bold text-gray-900 dark:text-white mb-0"
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
                          className="notebook-input w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
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
                      className="block font-bold text-gray-900 dark:text-white mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "🎨 Phong Cách Du Lịch *" : "🎨 Travel Style *"}
                    </label>
                    <select
                      value={formData.style}
                      onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                      className="notebook-input w-full px-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
                      style={{
                        lineHeight: LINE_HEIGHT,
                        height: LINE_HEIGHT,
                      }}
                    >
                      <option value="" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Chọn phong cách" : "Select style"}</option>
                      <option value="Trekking" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Trekking & Leo Núi" : "Trekking & Climbing"}</option>
                      <option value="Food" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Ẩm Thực" : "Culinary"}</option>
                      <option value="Cultural" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Văn Hoá & Di Sản" : "Culture & Heritage"}</option>
                      <option value="Luxury" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Cao Cấp" : "Luxury"}</option>
                      <option value="Budget" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Tiết Kiệm" : "Budget"}</option>
                      <option value="Beach" className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">{language === 'vi' ? "Biển & Nghỉ Dưỡng" : "Beach & Resort"}</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT, marginTop: LINE_HEIGHT }}>
                    <label
                      className="block font-bold text-gray-900 dark:text-white mb-2"
                      style={{ lineHeight: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "🖼️ Ảnh Bìa Chuyến Đi *" : "🖼️ Trip Cover Image *"}
                    </label>
                    <div
                      className={`border-2 border-dashed ${coverFile ? 'border-green-500 bg-green-50' : 'border-gray-400 hover:border-[#ff3131] hover:bg-amber-50/30'} rounded-xl p-6 text-center transition-all cursor-pointer relative`}
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
                          <img src={coverPreview} alt="Preview" className="h-24 object-cover rounded-lg mb-2 shadow-sm" />
                          <p className="font-bold text-sm text-green-600 dark:text-green-450">
                            {coverFile?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {language === 'vi' ? 'Nhấn để thay đổi' : 'Click to change'}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                          <p className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                            {language === 'vi' ? 'Nhấn để tải ảnh bìa lên' : 'Click to upload cover image'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 10MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Budget & Group */}
              {currentStep === 2 && (
                <div className="space-y-0">
                  <div style={{ marginBottom: "3rem" }}>
                    <label
                      className="block font-bold text-gray-900 dark:text-white mb-0"
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
                        value={formData.budget ? Number(formData.budget).toLocaleString('vi-VN') : ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
                          setFormData({ ...formData, budget: val });
                        }}
                        placeholder={language === 'vi' ? "VD: 5.000.000" : "E.g. 5,000,000"}
                        className="notebook-input w-full pl-8 pr-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] transition-colors"
                        style={{
                          lineHeight: LINE_HEIGHT,
                          height: LINE_HEIGHT,
                        }}
                      />
                    </div>
                    {/* Budget Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-2 pt-1">
                      {[
                        { value: "1000000", label: "1.000.000 ₫", desc: language === 'vi' },
                        { value: "3000000", label: "3.000.000 ₫", desc: language === 'vi' },
                        { value: "5000000", label: "5.000.000 ₫", desc: language === 'vi' },
                        { value: "10000000", label: "10.000.000 ₫", desc: language === 'vi' },
                        { value: "12000000", label: "12.000.000 ₫", desc: language === 'vi' },
                      ].map((sug) => {
                        const isActive = formData.budget === sug.value;
                        return (
                          <button
                            key={sug.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, budget: sug.value })}
                            className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${isActive
                              ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm scale-105 border-transparent"
                              : "bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-800 border-gray-200 dark:border-white/10"
                              }`}
                          >
                            <span>{sug.label}</span>
                            <span className={`text-[10px] font-normal ${isActive ? "text-white/80" : "text-gray-400"}`}>{sug.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p
                      className="text-sm text-gray-600"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "Bao gồm tất cả chi phí (lưu trú, ăn uống, di chuyển, tham quan)" : "Includes all expenses (accommodation, dining, transport, sightseeing)"}
                    </p>
                  </div>

                  <div style={{ marginBottom: LINE_HEIGHT }}>
                    <label
                      className="block font-bold text-gray-900 dark:text-white mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "👥 Số Người *" : "👥 Number of People *"}
                    </label>
                    {/* Stepper UI */}
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const cur = Math.max(1, Number(formData.groupSize) - 1);
                          setFormData({ ...formData, groupSize: String(cur) });
                        }}
                        className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#ff3131] hover:text-[#ff3131] transition-all font-bold text-lg leading-none select-none"
                      >
                        −
                      </button>
                      <div className="flex flex-col items-center min-w-[48px]">
                        <span className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
                          {formData.groupSize || "1"}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          {language === 'vi' ? 'người' : 'people'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = Math.min(99, Number(formData.groupSize) + 1);
                          setFormData({ ...formData, groupSize: String(cur) });
                        }}
                        className="w-9 h-9 rounded-full border-2 border-gray-300 dark:border-neutral-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:border-[#ff3131] hover:text-[#ff3131] transition-all font-bold text-lg leading-none select-none"
                      >
                        +
                      </button>
                      <div className="h-6 w-px bg-gray-200 dark:bg-neutral-700 mx-1" />
                      {/* Quick group chips */}
                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          { n: 1, icon: "🧍", label: language === 'vi' ? "Solo" : "Solo" },
                          { n: 2, icon: "👫", label: language === 'vi' ? "Đôi" : "Couple" },
                          { n: 4, icon: "👨‍👩‍👧‍👦", label: language === 'vi' ? "Gia đình" : "Family" },
                          { n: 6, icon: "🎉", label: language === 'vi' ? "Nhóm" : "Group" },
                        ].map(({ n, icon, label }) => {
                          const isActive = Number(formData.groupSize) === n;
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setFormData({ ...formData, groupSize: String(n) })}
                              className={`flex flex-col items-center px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${isActive
                                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent shadow-sm scale-105"
                                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-[#ff3131] dark:hover:border-[#ff3131]"
                                }`}
                            >
                              <span className="text-base leading-none">{icon}</span>
                              <span className="text-[10px] mt-0.5">{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: `${GRID_HEIGHT}px` }}>
                    <label
                      className="block font-bold text-gray-900 dark:text-white mb-0"
                      style={{ lineHeight: LINE_HEIGHT, height: LINE_HEIGHT }}
                    >
                      {language === 'vi' ? "📝 Mô Tả Chuyến Đi *" : "📝 Trip Description *"}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={language === 'vi' ? "Chia sẻ điều đặc biệt nhất của chuyến đi. Bao gồm điểm nổi bật, trải nghiệm đáng nhớ và đối tượng phù hợp..." : "Share the most special aspects of your trip. Include highlights, memorable experiences and target audience..."}
                      rows={6}
                      className="notebook-input w-full px-0 py-0 border-0 border-b-2 border-gray-300 dark:border-neutral-700 bg-transparent focus:outline-none focus:border-[#ff3131] dark:focus:border-[#ff3131] resize-none"
                      style={{
                        lineHeight: LINE_HEIGHT,
                      }}
                    />

                    {/* AI Assistant Toolbar */}
                    {isAiAssistantEnabled && (
                      <div className="flex items-center justify-between mt-3 py-2 border-t border-dashed border-gray-200 dark:border-neutral-800">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-neutral-400">
                          <Sparkles size={14} className="text-[#ff3131] animate-pulse" />
                          <span>{language === 'vi' ? "Trợ lý Viết AI:" : "AI Writing Assistant:"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={aiLoading}
                            onClick={handleAiPolish}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:shadow-md rounded-lg transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {language === 'vi' ? "Tối ưu / Hoàn thiện" : "Polish & Complete"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* AI Suggestions Display Panel */}
                    {isAiAssistantEnabled && showAiPanel && (
                      <div className="mt-3 bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-[#2e1d13]/90 dark:to-[#271c14]/90 rounded-xl p-4 border border-orange-200 dark:border-orange-950/60 shadow-sm transition-all duration-300">
                        <div className="flex items-center justify-between mb-3 border-b border-orange-100 dark:border-orange-950/40 pb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="text-[#ff3131]" size={16} />
                            <span className="font-bold text-sm text-gray-900 dark:!text-[#ff914d]">
                              {language === 'vi' ? "Gợi ý từ Trợ lý AI" : "AI Recommendation"}
                            </span>
                          </div>
                          {aiLoading && (
                            <div className="flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400 font-semibold animate-pulse">
                              <Loader2 className="animate-spin" size={14} />
                              <span>{language === 'vi' ? "AI đang suy nghĩ..." : "AI is writing..."}</span>
                            </div>
                          )}
                        </div>

                        {aiLoading ? (
                          <div className="space-y-2 py-2">
                            <div className="h-4 bg-orange-200/50 dark:bg-orange-900/30 rounded animate-pulse w-full" />
                            <div className="h-4 bg-orange-200/50 dark:bg-orange-900/30 rounded animate-pulse w-[95%]" />
                            <div className="h-4 bg-orange-200/50 dark:bg-orange-900/30 rounded animate-pulse w-[80%]" />
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-800 dark:text-neutral-200 leading-relaxed italic whitespace-pre-wrap bg-white/60 dark:bg-neutral-900/60 p-3 rounded-lg border border-orange-100 dark:border-orange-950/40">
                              {aiSuggestion}
                            </p>
                            <div className="flex flex-wrap items-center justify-end gap-2 mt-3 pt-3">
                              <button
                                type="button"
                                onClick={() => setShowAiPanel(false)}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 rounded-lg transition-colors cursor-pointer"
                              >
                                {language === 'vi' ? "Bỏ qua" : "Discard"}
                              </button>
                              <button
                                type="button"
                                onClick={handleAppendAiSuggestion}
                                className="px-3 py-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/40 hover:bg-orange-200 dark:hover:bg-orange-900/40 rounded-lg transition-colors cursor-pointer"
                              >
                                {language === 'vi' ? "Chèn tiếp" : "Insert"}
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyAiSuggestion}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#ff3131] to-[#ff914d] hover:shadow-md rounded-lg transition-all cursor-pointer"
                              >
                                {language === 'vi' ? "Áp dụng" : "Apply"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-[#2e1d13] dark:to-[#271c14] rounded-xl p-4 border-l-4 border-[#ff3131]">
                    <div className="flex items-start gap-3">
                      <Sparkles className={`${accentColor} flex-shrink-0 mt-1`} size={20} />
                      <div className="flex-1">
                        <p
                          className="font-bold text-gray-900 dark:!text-[#ff914d] mb-0 flex items-center justify-between"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          <span>{language === 'vi' ? "💡 Gợi Ý AI" : "💡 AI Suggestions"}</span>
                        </p>
                        <p
                          className="text-sm text-gray-600 dark:text-neutral-300 mb-2"
                          style={{ lineHeight: LINE_HEIGHT }}
                        >
                          {language === 'vi' ? "Dựa trên địa điểm và ngày tháng của bạn, AI có thể gợi ý viết mô tả chuyến đi một cách tự nhiên và sinh động hơn." : "Based on your location and dates, AI can suggest writing a more natural and vivid trip description."}
                        </p>

                        <button
                          type="button"
                          onClick={handleToggleAiAssistant}
                          className={`text-sm ${accentColor} font-bold hover:underline flex items-center gap-1 cursor-pointer`}
                        >
                          {isAiAssistantEnabled
                            ? (language === 'vi' ? "Tắt Trợ Lý AI ←" : "Disable AI Assistant ←")
                            : (language === 'vi' ? "Bật Trợ Lý AI →" : "Enable AI Assistant →")}
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
                      <span className="font-bold text-gray-900 dark:text-white">{language === 'vi' ? "Lịch trình chi tiết" : "Detailed itinerary"}</span>
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
                      <div key={day.day} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-neutral-800/90 dark:to-neutral-900/90 rounded-xl p-5 border-l-4 border-[#ff914d] dark:border-[#ff914d]/70">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`inline-flex items-center gap-2 ${primaryBg} text-white px-4 py-1.5 rounded-full font-bold text-sm`}>
                            <Calendar size={14} />
                            {language === 'vi' ? "Ngày" : "Day"} {day.day}
                          </div>
                          {timeline.length > 1 && (
                            <button
                              onClick={() => removeTimelineDay(dayIndex)}
                              className="text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg p-2 transition-colors"
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
                            className={`w-full px-4 py-2.5 border-b-2 border-gray-300 dark:border-neutral-600 bg-white/60 dark:bg-neutral-800/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#ff3131] transition-colors rounded-t-lg font-semibold`}
                          />

                          <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-neutral-250 mb-2">{language === 'vi' ? "Hoạt Động" : "Activities"}</label>
                            <div className="space-y-2">
                              {day.activities.map((activity, activityIndex) => (
                                <div key={activityIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={activity}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                                    placeholder={language === 'vi' ? `Hoạt động ${activityIndex + 1}` : `Activity ${activityIndex + 1}`}
                                    className={`flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                                  />
                                  {day.activities.length > 1 && (
                                    <button
                                      onClick={() => removeActivity(dayIndex, activityIndex)}
                                      className="p-2 text-red-600 dark:text-red-450 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
                            <label className="block text-sm font-bold text-gray-900 dark:text-neutral-250 mb-2">{language === 'vi' ? "Ngân Sách Ngày (VND)" : "Daily Budget (VND)"}</label>
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
                                className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 ${focusRing} focus:border-transparent`}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
                          <label className="block text-sm font-bold text-gray-900 dark:text-neutral-250 mb-3">{language === 'vi' ? "Media (Ảnh/Video/Audio)" : "Media (Image/Video/Audio)"}</label>
                          <div className="flex flex-wrap gap-4">
                            <label className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#ff3131] hover:bg-amber-50/10 transition-all w-24">
                              <Upload size={20} className="text-gray-400 mb-2" />
                              <span className="text-xs font-bold text-gray-600 dark:text-neutral-400">{language === 'vi' ? 'Ảnh' : 'Image'}</span>
                              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                if (!files.length) return;

                                const totalImages = timeline.reduce((acc, curr) => acc + (curr.imageFiles?.length || 0), 0);
                                if (!checkMediaLimits(totalImages, files.length, 0, 0)) return;

                                const newTimeline = [...timeline];
                                const currentImages = newTimeline[dayIndex].imageFiles || [];
                                newTimeline[dayIndex].imageFiles = [...currentImages, ...files];
                                setTimeline(newTimeline);
                              }} />
                            </label>

                            <label className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#ff3131] hover:bg-amber-50/10 transition-all w-24">
                              <Upload size={20} className="text-gray-400 mb-2" />
                              <span className="text-xs font-bold text-gray-600 dark:text-neutral-400">Video</span>
                              <input type="file" multiple accept="video/*" className="hidden" onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (!files.length) return;

                                const totalVideos = timeline.reduce((acc, curr) => acc + (curr.videoFiles?.length || 0), 0);
                                if (!checkMediaLimits(0, 0, totalVideos, files.length)) return;

                                for (const file of files) {
                                  const isValid = await validateVideoResolution(file);
                                  if (!isValid) return;
                                }

                                const newTimeline = [...timeline];
                                const currentVideos = newTimeline[dayIndex].videoFiles || [];
                                newTimeline[dayIndex].videoFiles = [...currentVideos, ...files];
                                setTimeline(newTimeline);
                              }} />
                            </label>

                            <label className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-[#ff3131] hover:bg-amber-50/10 transition-all w-24">
                              <Upload size={20} className="text-gray-400 mb-2" />
                              <span className="text-xs font-bold text-gray-600 dark:text-neutral-400">Audio</span>
                              <input type="file" multiple accept="audio/*" className="hidden" onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const newTimeline = [...timeline];
                                newTimeline[dayIndex].audioFiles = [...(newTimeline[dayIndex].audioFiles || []), ...files];
                                setTimeline(newTimeline);
                              }} />
                            </label>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {(day.imageFiles || []).map((f: File, i: number) => (
                              <div key={`img-${i}`} className="bg-white/60 dark:bg-neutral-800 text-xs px-2 py-1.5 rounded-lg text-gray-700 dark:text-neutral-300 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center gap-1">
                                <span className="text-orange-500">📸</span> <span className="truncate max-w-[100px]">{f.name}</span>
                              </div>
                            ))}
                            {(day.videoFiles || []).map((f: File, i: number) => (
                              <div key={`vid-${i}`} className="bg-white/60 dark:bg-neutral-800 text-xs px-2 py-1.5 rounded-lg text-gray-700 dark:text-neutral-300 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center gap-1">
                                <span className="text-blue-500">🎬</span> <span className="truncate max-w-[100px]">{f.name}</span>
                              </div>
                            ))}
                            {(day.audioFiles || []).map((f: File, i: number) => (
                              <div key={`aud-${i}`} className="bg-white/60 dark:bg-neutral-800 text-xs px-2 py-1.5 rounded-lg text-gray-700 dark:text-neutral-300 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center gap-1">
                                <span className="text-green-500">🎵</span> <span className="truncate max-w-[100px]">{f.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Privacy & Publish */}
              {currentStep === 4 && (
                <div className="space-y-5">

                  {/* Hero Banner */}
                  <div className={`${primaryBg} rounded-2xl p-6 text-white`}>
                    <h3 className="font-bold text-lg mb-1">
                      {language === 'vi' ? '🚀 Sẵn Sàng Đăng Nhật Ký!' : '🚀 Ready to Publish Your Journal!'}
                    </h3>
                    <p className="text-white/85 text-sm mb-3">
                      {language === 'vi'
                        ? 'Hãy kiểm tra lại thông tin trước khi đăng. Nhật ký của bạn sẽ xuất hiện trên cộng đồng WanderLab ngay sau khi đăng.'
                        : 'Review your information before publishing. Your journal will appear on the WanderLab community right after posting.'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Eye size={14} />
                      <span>
                        {language === 'vi'
                          ? 'Ước tính 100+ người dùng sẽ xem nhật ký của bạn trong tuần đầu tiên'
                          : 'Estimated 100+ users will view your journal in the first week'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Preview Card */}
                  <div className="bg-gray-50 dark:bg-neutral-900/60 rounded-2xl p-5 border border-gray-200 dark:border-neutral-800">
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                      <span>📋</span>
                      {language === 'vi' ? 'Tóm tắt nhật ký của bạn' : 'Your journal summary'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {formData.title && (
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff3131] font-bold min-w-[80px]">{language === 'vi' ? 'Tiêu đề:' : 'Title:'}</span>
                          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{formData.title}</span>
                        </div>
                      )}
                      {formData.location && (
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff3131] font-bold min-w-[80px]">{language === 'vi' ? 'Địa điểm:' : 'Location:'}</span>
                          <span className="text-gray-700 dark:text-gray-300">{formData.location}</span>
                        </div>
                      )}
                      {formData.budget && (
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff3131] font-bold min-w-[80px]">{language === 'vi' ? 'Ngân sách:' : 'Budget:'}</span>
                          <span className="text-gray-700 dark:text-gray-300">{Number(formData.budget).toLocaleString('vi-VN')} ₫</span>
                        </div>
                      )}
                      {formData.groupSize && (
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff3131] font-bold min-w-[80px]">{language === 'vi' ? 'Số người:' : 'Group:'}</span>
                          <span className="text-gray-700 dark:text-gray-300">{formData.groupSize} {language === 'vi' ? 'người' : 'people'}</span>
                        </div>
                      )}
                      {timeline.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-[#ff3131] font-bold min-w-[80px]">{language === 'vi' ? 'Lịch trình:' : 'Timeline:'}</span>
                          <span className="text-gray-700 dark:text-gray-300">{timeline.length} {language === 'vi' ? 'ngày' : 'days'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tips for a great post */}
                  <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-5">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-3 flex items-center gap-2">
                      <span>💡</span>
                      {language === 'vi' ? 'Mẹo để nhật ký của bạn nổi bật' : 'Tips to make your journal stand out'}
                    </h4>
                    <ul className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
                      {(language === 'vi' ? [
                        '📸 Ảnh bìa rõ nét, đẹp sẽ thu hút nhiều lượt xem hơn',
                        '✍️ Mô tả chi tiết giúp người đọc hình dung chuyến đi',
                        '📍 Địa điểm chính xác giúp người khác dễ tìm kiếm',
                        '💰 Ngân sách thực tế giúp mọi người lên kế hoạch tốt hơn',
                      ] : [
                        '📸 A clear, beautiful cover photo attracts more views',
                        '✍️ Detailed descriptions help readers visualize the trip',
                        '📍 Accurate location helps others search easily',
                        '💰 Realistic budget helps people plan better',
                      ]).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0">{tip.slice(0, 2)}</span>
                          <span>{tip.slice(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Checklist trước khi đăng */}
                  <div className="rounded-2xl border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 p-5">
                    <h4 className="font-bold text-green-800 dark:text-green-400 text-sm mb-3 flex items-center gap-2">
                      <span>✅</span>
                      {language === 'vi' ? 'Kiểm tra trước khi đăng' : 'Pre-publish checklist'}
                    </h4>
                    <div className="space-y-2 text-sm">
                      {[
                        { done: !!formData.title, label: language === 'vi' ? 'Đã có tiêu đề nhật ký' : 'Journal title added' },
                        { done: !!formData.location, label: language === 'vi' ? 'Đã chọn địa điểm' : 'Location selected' },
                        { done: !!coverFile, label: language === 'vi' ? 'Đã tải ảnh bìa' : 'Cover photo uploaded' },
                        { done: !!formData.budget, label: language === 'vi' ? 'Đã nhập ngân sách' : 'Budget entered' },
                        { done: timeline.length > 0 && timeline.some(d => d.activities?.some((a: string) => a.trim())), label: language === 'vi' ? 'Đã có lịch trình hoạt động' : 'Activities added' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                            item.done
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-neutral-700 text-gray-400'
                          }`}>
                            {item.done ? '✓' : '○'}
                          </span>
                          <span className={item.done ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-neutral-500'}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Page Footer / Navigation */}
            <div className="px-16 py-6 border-t-2 border-gray-200 dark:border-neutral-850 bg-white/80 dark:bg-neutral-900/80 transition-colors">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-gray-300 to-transparent dark:from-neutral-800 rounded-tl-3xl opacity-20 dark:opacity-40" />
        </div>
      </div>
    </div>
  );
}