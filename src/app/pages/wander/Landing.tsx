import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { UserCard } from "../../components/wander/UserCard";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Compass, MapPin, Shield, BookOpen, Plus, X, Upload, ChevronLeft, ChevronRight, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useAuthStore, useLanguageStore } from "@/stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { diaryService } from "@/api/diaryService";
import { storyService } from "@/api/storyService";
import { useState, useEffect, useRef } from "react";

// Dữ liệu sẽ được fetch từ API trong tương lai
const suggestedTravelers: any[] = [];
const trendingDestinations: any[] = [];
const mockStories: any[] = [];

export function WanderLanding() {
  const { isAuthenticated, user } = useAuthStore();
  const { t, language } = useLanguageStore();

  const translateTrendingDestName = (name: string, lang: string) => {
    if (lang === 'vi') return name;
    const dict: Record<string, string> = {
      "Vịnh Hạ Long": "Ha Long Bay",
      "Phú Quốc": "Phu Quoc",
      "Sa Pa": "Sapa",
      "Hội An": "Hoi An",
      "Đà Lạt": "Da Lat",
    };
    return dict[name] || name;
  };

  const { data: feedDiaries, isLoading } = useQuery({
    queryKey: ['feedDiaries'],
    queryFn: diaryService.fetchFeedDiaries,
    enabled: isAuthenticated,
  });

  const { data: dbStories, refetch: refetchStories } = useQuery({
    queryKey: ['activeStories'],
    queryFn: storyService.fetchActiveStories,
    enabled: isAuthenticated,
  });

  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [storyFile, setStoryFile] = useState<File | null>(null);
  const [storyPreview, setStoryPreview] = useState("");
  const [storyCaption, setStoryCaption] = useState("");
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [editStoryCaption, setEditStoryCaption] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const combinedStories = [
    ...(dbStories || []),
  ];

  const handleNextStory = () => {
    setActiveStoryIndex((prev) => {
      if (prev === null) return null;
      if (prev < combinedStories.length - 1) {
        return prev + 1;
      }
      return null;
    });
  };

  const handlePrevStory = () => {
    setActiveStoryIndex((prev) => {
      if (prev === null) return null;
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  // Slideshow progress timer
  useEffect(() => {
    if (activeStoryIndex === null || isActionMenuOpen || isEditStoryOpen) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleNextStory();
          return 0;
        }
        return prev + 2; // Increments by 2% every 100ms => 5000ms total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex]);

  const handleCreateStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyFile) {
      alert(language === 'vi' ? "Vui lòng chọn ảnh!" : "Please select an image!");
      return;
    }

    try {
      setIsSubmittingStory(true);
      const imageUrl = await storyService.uploadStoryImage(storyFile);
      await storyService.createStory(imageUrl, storyCaption);
      
      alert(language === 'vi' ? "Đăng tin thành công!" : "Story shared successfully!");
      setIsCreateStoryOpen(false);
      setStoryFile(null);
      setStoryPreview("");
      setStoryCaption("");
      refetchStories();
    } catch (err: any) {
      console.error(err);
      alert(`${language === 'vi' ? "Lỗi đăng tin" : "Failed to share story"}: ${err.message}`);
    } finally {
      setIsSubmittingStory(false);
    }
  };

  const handleEditStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeStoryIndex === null) return;
    const storyId = combinedStories[activeStoryIndex].id;
    
    try {
      setIsSubmittingEdit(true);
      await storyService.updateStory(storyId, editStoryCaption);
      alert(language === 'vi' ? "Cập nhật thành công!" : "Story updated successfully!");
      setIsEditStoryOpen(false);
      refetchStories();
    } catch (err: any) {
      alert(`${language === 'vi' ? "Lỗi cập nhật" : "Failed to update"}: ${err.message}`);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleDeleteStory = async () => {
    if (activeStoryIndex === null) return;
    const confirmDelete = window.confirm(language === 'vi' ? "Bạn có chắc chắn muốn xoá tin này không?" : "Are you sure you want to delete this story?");
    if (!confirmDelete) return;

    const storyId = combinedStories[activeStoryIndex].id;
    try {
      await storyService.deleteStory(storyId);
      setIsActionMenuOpen(false);
      setActiveStoryIndex(null);
      refetchStories();
    } catch (err: any) {
      alert(`${language === 'vi' ? "Lỗi xoá tin" : "Failed to delete"}: ${err.message}`);
    }
  };

  // Guest landing — hero + CTA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#ff3131] via-[#ff5e3a] to-[#ff914d] text-white overflow-hidden">
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-yellow-300 rounded-full blur-3xl pointer-events-none" 
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-8"
              >
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                  {t("heroTitle", "landing")}<br />
                  <span className="text-white">{t("heroHighlight", "landing")}</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  {t("heroSubtitle", "landing")}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0px 20px 40px rgba(0,0,0,0.2)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white/90 backdrop-blur-md text-[#ff3131] rounded-full font-bold text-lg transition-colors hover:bg-white"
                    >
                      {t("startFree", "landing")}
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="hidden lg:grid grid-cols-2 gap-4"
              >
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Hạ Long"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Hội An"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Sa Pa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Phú Quốc"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("whyWanderLab", "landing")}</h2>
              <p className="text-xl text-gray-600">{t("whySubtitle", "landing")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feat1Title", "landing")}</h3>
                <p className="text-gray-600">{t("feat1Desc", "landing")}</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feat2Title", "landing")}</h3>
                <p className="text-gray-600">{t("feat2Desc", "landing")}</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t("feat3Title", "landing")}</h3>
                <p className="text-gray-600">{t("feat3Desc", "landing")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{t("readyToExplore", "landing")}</h2>
            <p className="text-xl text-gray-600 mb-8">{t("readySubtitle", "landing")}</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Sparkles size={24} />
              {t("createAccountFree", "landing")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user — social feed
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stories/Reels Section - Facebook Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Create Story */}
          <button
            onClick={() => setIsCreateStoryOpen(true)}
            className="flex-shrink-0 group focus:outline-none"
          >
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 hover:shadow-lg transition-all cursor-pointer">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center mb-2">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-xs font-semibold text-gray-900">{t("createStory", "landing")}</p>
              </div>
            </div>
          </button>

          {/* Dynamic Stories */}
          {combinedStories.map((story, index) => (
            <div
              key={story.id}
              onClick={() => setActiveStoryIndex(index)}
              className="flex-shrink-0 group cursor-pointer"
            >
              <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={story.image_url}
                    alt={story.caption || "Story"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                </div>
                <div className="absolute top-2 left-2">
                  <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white">
                    {story.author?.avatar ? (
                      <ImageWithFallback
                        src={story.author.avatar}
                        alt={story.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-xs">
                        {story.author?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-semibold text-white truncate drop-shadow-lg">
                    {story.author?.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Feed Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Compass className="text-[#ff3131]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t("feedTitle", "landing")}</h2>
              <p className="text-gray-600">{t("feedSubtitle", "landing")}</p>
            </div>
          </div>

          {/* Journal Posts Feed */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">{t("loadingDiaries", "landing")}</div>
            ) : feedDiaries?.length === 0 ? (
              <div className="text-center py-10 text-gray-500">{t("noDiaries", "landing")}</div>
            ) : (
              feedDiaries?.map((post) => (
                <JournalPostCard key={post.id} {...post} />
              ))
            )}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <Link
              to="/friends"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#ff3131] border-2 border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all"
            >
              {t("loadMoreFriends", "landing")}
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Destinations */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-[#ff3131]" size={20} />
              <h3 className="font-bold text-gray-900">{t("trendingDestinations", "landing")}</h3>
            </div>
            <div className="space-y-3">
              {trendingDestinations.map((dest, index) => (
                <Link
                  key={dest.name}
                  to={`/explore?destination=${encodeURIComponent(dest.name)}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5F3] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-[#ff3131] transition-colors">
                        {translateTrendingDestName(dest.name, language)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'vi' ? dest.count : dest.count.replace("nhật ký", "journals")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Suggested Travelers */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">{t("suggestedTravelers", "landing")}</h3>
            <div className="space-y-3">
              {suggestedTravelers.map((traveler) => (
                <UserCard key={traveler.name} {...traveler} />
              ))}
            </div>
            <Link
              to="/friends"
              className="block text-center text-sm text-[#ff3131] font-semibold mt-4 hover:text-[#ff914d] transition-colors"
            >
              {t("seeMoreTravelers", "landing")}
            </Link>
          </div>
        </div>
      </div>

      {/* Create Story Modal */}
      {isCreateStoryOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => {
                setIsCreateStoryOpen(false);
                setStoryFile(null);
                setStoryPreview("");
                setStoryCaption("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'vi' ? "Tạo Tin Mới" : "Create New Story"}
            </h2>

            <form onSubmit={handleCreateStorySubmit} className="space-y-4">
              <div
                className={`border-2 border-dashed ${
                  storyFile ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-[#ff3131] hover:bg-amber-50/20'
                } rounded-2xl p-8 text-center transition-all cursor-pointer relative`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setStoryFile(file);
                      setStoryPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {storyPreview ? (
                  <div className="flex flex-col items-center">
                    <img src={storyPreview} alt="Preview" className="h-40 object-cover rounded-xl mb-3 shadow-md" />
                    <p className="font-bold text-green-600 text-sm truncate max-w-full">
                      {storyFile?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vi' ? 'Nhấn để thay đổi' : 'Click to change'}
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto mb-3 text-gray-400" size={40} />
                    <p className="font-bold text-gray-900 text-sm">
                      {language === 'vi' ? '📸 Tải ảnh lên' : '📸 Upload photo'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'vi' ? 'Hỗ trợ JPG, PNG (Tối đa 10MB)' : 'Supports JPG, PNG (Max 10MB)'}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'vi' ? 'Mô tả ngắn (Caption)' : 'Caption'}
                </label>
                <textarea
                  rows={3}
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] outline-none resize-none text-sm"
                  placeholder={language === 'vi' ? "Viết mô tả ngắn cho câu chuyện của bạn..." : "Write a short caption for your story..."}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateStoryOpen(false);
                    setStoryFile(null);
                    setStoryPreview("");
                    setStoryCaption("");
                  }}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingStory}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-md transition-all text-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingStory ? (language === 'vi' ? "Đang đăng..." : "Posting...") : (language === 'vi' ? "Đăng tin" : "Share")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Story Lightbox/Slideshow Modal */}
      {activeStoryIndex !== null && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 select-none">
          {/* Close Button */}
          <button
            onClick={() => setActiveStoryIndex(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 z-55 bg-black/40 rounded-full"
          >
            <X size={28} />
          </button>

          {/* Navigation Controls */}
          {activeStoryIndex > 0 && (
            <button
              onClick={handlePrevStory}
              className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all z-55 hidden md:block"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {activeStoryIndex < combinedStories.length - 1 && (
            <button
              onClick={handleNextStory}
              className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all z-55 hidden md:block"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Main Story Container */}
          <div className="max-w-md w-full h-[90vh] md:h-[85vh] relative flex flex-col justify-between bg-black/20 rounded-3xl overflow-hidden shadow-2xl mx-4">
            
            {/* Top Indicator & Author */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-55 space-y-3">
              {/* Progress Bar Indicators */}
              <div className="flex gap-1.5 w-full">
                {combinedStories.map((s, idx) => (
                  <div key={s.id} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all ease-linear duration-100"
                      style={{
                        width: idx === activeStoryIndex ? `${progress}%` : idx < activeStoryIndex ? "100%" : "0%"
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Author Details & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#ff3131] overflow-hidden p-0.5 bg-white flex-shrink-0">
                    {combinedStories[activeStoryIndex].author?.avatar ? (
                      <img
                        src={combinedStories[activeStoryIndex].author.avatar}
                        alt={combinedStories[activeStoryIndex].author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-xs">
                        {combinedStories[activeStoryIndex].author?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm drop-shadow-md">
                      {combinedStories[activeStoryIndex].author?.name}
                    </h3>
                    <p className="text-white/60 text-xs drop-shadow-md">
                      {combinedStories[activeStoryIndex].created_at ? new Date(combinedStories[activeStoryIndex].created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ""}
                    </p>
                  </div>
                </div>

                {/* 3-dots menu for story owner */}
                {user?.id && combinedStories[activeStoryIndex].user_id === user.id && (
                  <div className="relative">
                    <button
                      onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                      className="text-white p-2 hover:bg-white/20 rounded-full transition-colors focus:outline-none"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {isActionMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-[60] overflow-hidden">
                        <button
                          onClick={() => {
                            setEditStoryCaption(combinedStories[activeStoryIndex].caption || "");
                            setIsActionMenuOpen(false);
                            setIsEditStoryOpen(true);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <Edit2 size={16} />
                          {language === 'vi' ? 'Sửa nội dung' : 'Edit Caption'}
                        </button>
                        <button
                          onClick={handleDeleteStory}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          {language === 'vi' ? 'Xóa tin' : 'Delete Story'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Story Image */}
            <div
              className="flex-1 flex items-center justify-center cursor-pointer h-full"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 3) {
                  handlePrevStory();
                } else {
                  handleNextStory();
                }
              }}
            >
              <img
                src={combinedStories[activeStoryIndex].image_url}
                alt="Story content"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Bottom Caption */}
            {combinedStories[activeStoryIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white text-center pointer-events-none">
                <p className="text-sm font-medium leading-relaxed drop-shadow-md">
                  {combinedStories[activeStoryIndex].caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Story Caption Modal */}
      {isEditStoryOpen && activeStoryIndex !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsEditStoryOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'vi' ? "Sửa nội dung tin" : "Edit Story Caption"}
            </h2>

            <form onSubmit={handleEditStorySubmit} className="space-y-4">
              <div>
                <textarea
                  rows={3}
                  value={editStoryCaption}
                  onChange={(e) => setEditStoryCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] outline-none resize-none text-sm"
                  placeholder={language === 'vi' ? "Viết mô tả ngắn cho câu chuyện của bạn..." : "Write a short caption for your story..."}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditStoryOpen(false)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all text-sm"
                >
                  {language === 'vi' ? 'Hủy' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="px-5 py-2 bg-[#ff3131] text-white rounded-xl font-semibold hover:bg-[#e62b2b] transition-all text-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingEdit ? (language === 'vi' ? "Đang lưu..." : "Saving...") : (language === 'vi' ? "Lưu" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}