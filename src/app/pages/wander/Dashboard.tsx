import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { Link } from "react-router";
import { Plus, Settings, MapPin, Calendar, Users, Heart, Bookmark, MessageCircle, Image, Route, X, BookOpen, Wallet } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { UserAvatar } from "../../components/wander/UserAvatar";
import { useSavedItineraries } from "../../hooks/useSavedItineraries";
import { VietnamMap } from "../../components/wander/VietnamMap";
import { useState, useEffect } from "react";
import { ItineraryDetailModal } from "../../components/wander/ItineraryDetailModal";
import { useAuthStore, useLanguageStore } from "@/stores";
import { diaryService } from "@/api/diaryService";
import { VIETNAM_PROVINCES, normalizeSearchString } from "@/utils/vietnamProvinces";
import { useUsageLimits } from "@/hooks/useUsageLimits";

// Helper: extract visited provinces from user diaries
const getVisitedProvinces = (diaries: any[]) => {
  const visited = new Set<string>();
  diaries.forEach(diary => {
    if (!diary.location) return;
    const normalizedLoc = normalizeSearchString(diary.location);
    for (const province of VIETNAM_PROVINCES) {
      const normalizedProv = normalizeSearchString(province);
      if (normalizedLoc.includes(normalizedProv)) {
        visited.add(province);
      }
    }
  });
  return Array.from(visited);
};

export function WanderDashboard() {
  const { user, updateProfile, uploadAvatar, uploadCover } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { t, language } = useLanguageStore();
  const { limits, getUsage } = useUsageLimits();
  const { itineraries: savedItineraries, removeItinerary } = useSavedItineraries();
  const [openItinerary, setOpenItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState<"posts" | "saved_posts" | "saved_itineraries" | "trips">("posts");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isUpdatingCover, setIsUpdatingCover] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [showFullAvatar, setShowFullAvatar] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    location: "",
    bio: "",
  });

  const [userDiaries, setUserDiaries] = useState<any[]>([]);
  const [savedDiaries, setSavedDiaries] = useState<any[]>([]);
  const [isLoadingDiaries, setIsLoadingDiaries] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const loadDiaries = async () => {
        setIsLoadingDiaries(true);
        try {
          const res = await diaryService.fetchUserDiaries(user.id);
          setUserDiaries(res);
        } catch (err) {
          console.error("Failed to fetch user diaries", err);
        } finally {
          setIsLoadingDiaries(false);
        }
      };

      const loadSaved = async () => {
        setIsLoadingSaved(true);
        try {
          const res = await diaryService.fetchSavedDiaries(user.id);
          setSavedDiaries(res);
        } catch (err) {
          console.error("Failed to fetch saved diaries", err);
        } finally {
          setIsLoadingSaved(false);
        }
      };

      loadDiaries();
      loadSaved();
    }
  }, [user?.id]);

  const openEditModal = () => {
    setEditForm({
      fullName: user?.full_name || "",
      location: user?.location || "",
      bio: user?.bio || "",
    });
    setIsEditingProfile(true);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdatingAvatar(true);
    try {
      const publicUrl = await uploadAvatar(file);
      await updateProfile({ avatar_url: publicUrl });
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh đại diện:", error);
      alert("Không thể cập nhật ảnh đại diện. Vui lòng thử lại!");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUpdatingCover(true);
    try {
      const publicUrl = await uploadCover(file);
      await updateProfile({ cover_image_url: publicUrl });
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh bìa:", error);
      alert("Không thể cập nhật ảnh bìa. Vui lòng thử lại!");
    } finally {
      setIsUpdatingCover(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: editForm.fullName,
        location: editForm.location,
        bio: editForm.bio,
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin cá nhân:", error);
      alert("Không thể cập nhật thông tin cá nhân. Vui lòng thử lại!");
    }
  };

  const visitedProvinces = getVisitedProvinces(userDiaries);
  const provincesCount = visitedProvinces.length;

  const visitedCountries = new Set<string>();
  userDiaries.forEach(diary => {
    if (diary.country) {
      visitedCountries.add(diary.country.trim());
    } else {
      visitedCountries.add("Việt Nam");
    }
  });
  const countriesCount = visitedCountries.size;

  let totalDays = 0;
  userDiaries.forEach(diary => {
    if (diary.duration) {
      const match = diary.duration.match(/(\d+)/);
      if (match) {
        totalDays += parseInt(match[1]);
      } else {
        totalDays += 1;
      }
    } else {
      totalDays += 1;
    }
  });

  // Calculate dynamic stats for Activity Summary
  const totalLikes = userDiaries.reduce((sum, d) => sum + (d.likes || 0), 0);
  const totalComments = userDiaries.reduce((sum, d) => sum + (d.comments || 0), 0);
  const totalBookmarks = userDiaries.reduce((sum, d) => sum + (d.bookmarksCount || 0), 0);

  const dynamicTravelStats = [
    { label: "Tỉnh thành", value: provincesCount.toString() },
    { label: "Quốc gia", value: countriesCount.toString() },
    { label: "Tổng ngày", value: totalDays.toString() },
  ];

  // Build profile from real auth data
  const userProfile = {
    name: user?.full_name || (language === 'vi' ? 'Du Khách' : 'Traveler'),
    avatar: user?.avatar_url || "",
    coverImage: user?.cover_image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    location: user?.location || (language === 'vi' ? 'Chưa cập nhật' : 'Not updated'),
    bio: user?.bio || (language === 'vi' ? 'Hãy thêm mô tả về bạn... 🎒🌏' : 'Tell us about yourself... 🎒🌏'),
    diariesCount: userDiaries.length || user?.diaries_count || 0,
    followersCount: user?.followers_count || 0,
    followingCount: user?.following_count || 0,
  };

  return (
    <div className="min-h-screen bg-[#FFF5F3]">
      {/* Profile Header with Cover Photo */}
      <div className="bg-white border-b border-gray-100">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-[#ff3131] to-[#ff914d]">
          {userProfile.coverImage && (
            <ImageWithFallback
              src={userProfile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-90"
            />
          )}
          {/* Edit Cover Button */}
          <input
            type="file"
            id="cover-upload"
            className="hidden"
            accept="image/*"
            onChange={handleCoverChange}
            disabled={isUpdatingCover}
          />
          <label
            htmlFor="cover-upload"
            className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {isUpdatingCover ? (
              <span className="text-xs font-semibold animate-pulse">{t("loading")}</span>
            ) : (
              <>
                <Image size={16} />
                {t("changeCover")}
              </>
            )}
          </label>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pb-6 flex flex-col md:flex-row gap-8 justify-between">
            {/* Left Column: Avatar & Profile Details */}
            <div className="flex-1">
              {/* Avatar */}
              <div className="absolute -top-16 md:-top-20 group/avatar cursor-pointer">
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUpdatingAvatar}
                />
                <div
                  onClick={() => setShowAvatarOptions(true)}
                  className="cursor-pointer block relative"
                >
                  {userProfile.avatar ? (
                    <ImageWithFallback
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-6 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-6 border-white shadow-xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-5xl">
                      {userProfile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Hover overlay with Camera Icon */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center text-white">
                    {isUpdatingAvatar ? (
                      <span className="text-xs font-semibold animate-pulse">{t("loading")}</span>
                    ) : (
                      <Image size={24} />
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Actions (Mobile) */}
              <div className="flex justify-end pt-4 gap-3 md:hidden">
                <button
                  onClick={openEditModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <Settings size={16} />
                  {t("edit")}
                </button>
              </div>

              {/* Name & Bio */}
              <div className="mt-4 md:mt-24">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
              {user?.email && (
                <p className="text-sm text-gray-500 mb-1">{user.email}</p>
              )}
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <MapPin size={16} />
                <span>{userProfile.location}</span>
              </div>
              <p className="text-gray-700 max-w-2xl mb-4">{userProfile.bio}</p>

              {/* Stats */}
              {!isAdmin && (
                <div className="flex items-center gap-6 text-sm mb-4">
                  <div>
                    <span className="font-bold text-gray-900">{userProfile.diariesCount}</span>
                    <span className="text-gray-600 ml-1">{t("diariesInfo")}</span>
                  </div>
                  <div>
                    <button className="hover:text-[#ff3131] transition-colors">
                      <span className="font-bold text-gray-900">{userProfile.followersCount.toLocaleString("vi-VN")}</span>
                      <span className="text-gray-600 ml-1">{t("followInfo")}</span>
                    </button>
                  </div>
                  <div>
                    <button className="hover:text-[#ff3131] transition-colors">
                      <span className="font-bold text-gray-900">{userProfile.followingCount}</span>
                      <span className="text-gray-600 ml-1">{t("followingInfo")}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Usage Plan Status */}
              {!isAdmin && (
                <div className="mt-6 max-w-2xl flex flex-col sm:flex-row gap-4">
                  <div className={`flex-1 px-5 py-4 rounded-2xl border shadow-sm ${user?.plan === 'pro'
                      ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                      : user?.plan === 'plus'
                        ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                        : 'bg-white border-gray-100'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Wallet size={18} className={user?.plan === 'pro' ? 'text-orange-500' : 'text-gray-500'} />
                        <span className="font-bold text-gray-900">
                          {language === 'vi' ? 'Gói hiện tại:' : 'Current Plan:'}
                          <span className={`ml-2 uppercase tracking-wide font-extrabold ${user?.plan === 'pro' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#ff914d]'
                              : user?.plan === 'plus' ? 'text-[#ff3131]' : 'text-gray-700'
                            }`}>
                            {user?.plan || 'Free'}
                          </span>
                        </span>
                      </div>
                      {(!user?.plan || user.plan === 'free' || user.plan === 'plus') && (
                        <Link to="/partner" className="px-4 py-1.5 bg-[#ff3131] text-white text-xs rounded-xl font-bold hover:bg-[#e62b2b] transition-colors shadow-sm">
                          {language === 'vi' ? 'Nâng cấp' : 'Upgrade'}
                        </Link>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-xs text-gray-600 font-medium">
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1.5">
                          <span>{language === 'vi' ? 'Đăng Nhật Ký' : 'Journals'}</span>
                          <span className="font-bold text-gray-900">{Math.max(0, limits.create_diary - getUsage('create_diary'))}/{limits.create_diary}</span>
                        </div>
                        <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${getUsage('create_diary') >= limits.create_diary ? 'bg-red-500' : 'bg-gradient-to-r from-[#ff3131] to-[#ff914d]'}`} style={{ width: `${Math.min(100, (Math.max(0, limits.create_diary - getUsage('create_diary')) / limits.create_diary) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1.5">
                          <span>{language === 'vi' ? 'Tạo Lịch Trình' : 'Itineraries'}</span>
                          <span className="font-bold text-gray-900">{Math.max(0, limits.create_itinerary - getUsage('create_itinerary'))}/{limits.create_itinerary}</span>
                        </div>
                        <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${getUsage('create_itinerary') >= limits.create_itinerary ? 'bg-red-500' : 'bg-gradient-to-r from-[#ff3131] to-[#ff914d]'}`} style={{ width: `${Math.min(100, (Math.max(0, limits.create_itinerary - getUsage('create_itinerary')) / limits.create_itinerary) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1.5">
                          <span>AI {language === 'vi' ? 'Nhật Ký' : 'Journal'}</span>
                          <span className="font-bold text-gray-900">{Math.max(0, limits.ai_diary - getUsage('ai_diary'))}/{limits.ai_diary}</span>
                        </div>
                        <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${getUsage('ai_diary') >= limits.ai_diary ? 'bg-red-500' : 'bg-[#4f46e5]'}`} style={{ width: `${Math.min(100, (Math.max(0, limits.ai_diary - getUsage('ai_diary')) / limits.ai_diary) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1.5">
                          <span>AI {language === 'vi' ? 'Lịch Trình' : 'Itinerary'}</span>
                          <span className="font-bold text-gray-900">{Math.max(0, limits.ai_itinerary - getUsage('ai_itinerary'))}/{limits.ai_itinerary}</span>
                        </div>
                        <div className="w-full bg-black/5 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${getUsage('ai_itinerary') >= limits.ai_itinerary ? 'bg-red-500' : 'bg-[#4f46e5]'}`} style={{ width: `${Math.min(100, (Math.max(0, limits.ai_itinerary - getUsage('ai_itinerary')) / limits.ai_itinerary) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar (Quick Actions & Activity) */}
            {!isAdmin && (
              <div className="w-full md:w-[320px] lg:w-[350px] flex-shrink-0 pt-4 md:pt-6 space-y-6">
                {/* Desktop Edit Button */}
                <div className="hidden md:flex justify-end mb-4">
                  <button
                    onClick={openEditModal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                  >
                    <Settings size={16} />
                    {t("edit")}
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3">
                  <h3 className="font-bold text-gray-900 mb-4">{t("quickActions")}</h3>
                  <Link
                    to="/create"
                    className="block w-full px-4 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-md transition-all text-center"
                  >
                    {t("createJournal")}
                  </Link>
                  <Link
                    to="/create-itinerary"
                    className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#ff3131] transition-all text-center flex items-center justify-center gap-2"
                  >
                    <Route size={16} />
                    {t("aiPlanner")}
                  </Link>
                </div>

                {/* Activity Summary */}
                <div className="bg-gradient-to-br from-[#FFF5F3] to-white rounded-3xl border border-red-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">{t("recentActivity")}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Heart size={14} className="text-[#ff3131]" />
                        <span>{t("totalLikes")}</span>
                      </div>
                      <span className="font-bold text-gray-900">{totalLikes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MessageCircle size={14} className="text-[#ff3131]" />
                        <span>{t("comments")}</span>
                      </div>
                      <span className="font-bold text-gray-900">{totalComments.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Bookmark size={14} className="text-[#ff3131]" />
                        <span>{t("bookmarks")}</span>
                      </div>
                      <span className="font-bold text-gray-900">{totalBookmarks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          {!isAdmin && (
            <div className="flex w-full border-t border-gray-100">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 px-4 py-4 font-semibold transition-all relative text-center ${activeTab === "posts"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {t("myJournals")}
                {activeTab === "posts" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("saved_posts")}
                className={`flex-1 px-4 py-4 font-semibold transition-all relative text-center ${activeTab === "saved_posts"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {language === 'vi' ? 'Bài Viết Đã Lưu' : 'Saved Posts'}
                {activeTab === "saved_posts" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("saved_itineraries")}
                className={`flex-1 px-4 py-4 font-semibold transition-all relative text-center ${activeTab === "saved_itineraries"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {t("savedItineraries")}
                {activeTab === "saved_itineraries" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("trips")}
                className={`flex-1 px-4 py-4 font-semibold transition-all relative text-center ${activeTab === "trips"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                {t("itineraryStats")}
                {activeTab === "trips" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {!isAdmin && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "posts" && (
                <div className="space-y-6">
                  {/* Create Post Card */}
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-4">
                      <UserAvatar
                        src={userProfile.avatar}
                        name={userProfile.name}
                        className="w-12 h-12 text-lg"
                      />
                      <Link
                        to="/create"
                        className="flex-1 px-4 py-3 bg-[#FFF5F3] text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                      >
                        {t("shareMemory")}
                      </Link>
                      <Link
                        to="/create"
                        className="px-5 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all flex items-center gap-2"
                      >
                        <Plus size={18} />
                        {t("create")}
                      </Link>
                    </div>
                  </div>

                  {/* Journal Posts */}
                  {isLoadingDiaries ? (
                    <div className="text-center py-10 text-gray-500">
                      {language === 'vi' ? 'Đang tải nhật ký...' : 'Loading journals...'}
                    </div>
                  ) : userDiaries.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                      <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'vi' ? 'Bạn chưa có nhật ký nào' : 'No journals yet'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {language === 'vi' ? 'Hãy tạo nhật ký đầu tiên để lưu giữ kỷ niệm chuyến đi của bạn!' : 'Create your first journal to save your trip memories!'}
                      </p>
                      <Link
                        to="/create"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all"
                      >
                        {t("createJournal")}
                      </Link>
                    </div>
                  ) : (
                    userDiaries.map((post) => (
                      <JournalPostCard key={post.id} {...post} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "saved_posts" && (
                <div className="space-y-6">
                  {isLoadingSaved ? (
                    <div className="text-center py-10 text-gray-500">
                      {language === 'vi' ? 'Đang tải bài viết đã lưu...' : 'Loading saved posts...'}
                    </div>
                  ) : savedDiaries.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                      <Bookmark className="mx-auto text-gray-300 mb-4" size={48} />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {language === 'vi' ? 'Chưa có bài viết nào được lưu' : 'No saved posts yet'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {language === 'vi' ? 'Hãy lưu các bài viết thú vị để xem lại sau!' : 'Save interesting posts to read them later!'}
                      </p>
                    </div>
                  ) : (
                    savedDiaries.map((post) => (
                      <JournalPostCard key={post.id} {...post} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "saved_itineraries" && (
                <div className="space-y-6">
                  <div>
                    {savedItineraries.length === 0 ? (
                      <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center mt-6">
                        <Route className="mx-auto text-gray-300 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {language === 'vi' ? 'Bạn chưa lưu lịch trình nào' : 'No saved itineraries yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {language === 'vi' ? 'Sử dụng AI để lên kế hoạch và lưu lại các lịch trình yêu thích của bạn.' : 'Use AI to plan and save your favorite itineraries.'}
                        </p>
                        <Link
                          to="/create-itinerary"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all"
                        >
                          <Plus size={18} />
                          {language === 'vi' ? 'Lập Kế Hoạch AI' : 'Create AI Itinerary'}
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        {savedItineraries.map((itinerary: any) => (
                          <div key={itinerary.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="h-40 relative cursor-pointer group" onClick={() => setOpenItinerary(itinerary)}>
                              <ImageWithFallback src={itinerary.destinationImage} alt={itinerary.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-[#ff3131] shadow-sm">
                                {itinerary.duration}
                              </div>
                              <div className="absolute bottom-4 left-5 right-5">
                                <h4 className="text-white font-bold text-xl mb-1">{itinerary.destination}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-white/90">
                                  <span className="flex items-center gap-1"><Users size={12} /> {itinerary.groupSize}</span>
                                  <span className="flex items-center gap-1"><Wallet size={12} /> {itinerary.budget}</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{itinerary.savedAt}</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setOpenItinerary(itinerary)}
                                    className="px-4 py-2 text-sm font-semibold text-[#ff3131] bg-[#FFF5F3] hover:bg-red-100 rounded-xl transition-colors"
                                  >
                                    {language === 'vi' ? 'Xem chi tiết' : 'View Details'}
                                  </button>
                                  <button
                                    onClick={() => removeItinerary(itinerary.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                  >
                                    <X size={20} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}



              {activeTab === "trips" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">{t("travelStats")}</h2>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {dynamicTravelStats.map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-2">
                          {stat.value}
                        </p>
                        <p className="text-sm text-gray-600">
                          {stat.label === "Tỉnh thành"
                            ? (language === 'vi' ? 'Tỉnh thành' : 'Provinces')
                            : stat.label === "Quốc gia"
                              ? (language === 'vi' ? 'Quốc gia' : 'Countries')
                              : (language === 'vi' ? 'Tổng ngày' : 'Total Days')}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Travel Map (Animated & Interactive) */}
                  <VietnamMap visitedProvinces={visitedProvinces} />
                </div>
              )}
        </div>
      )}

      {/* Itinerary Modal */}
      {openItinerary && (
        <ItineraryDetailModal
          itinerary={openItinerary}
          onClose={() => setOpenItinerary(null)}
          onDelete={removeItinerary}
        />
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("editProfile")}</h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("fullNameLabel")}
                </label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] outline-none"
                  placeholder={t("placeholderName")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("locationLabel")}
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] outline-none"
                  placeholder={t("placeholderLocation")}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("bioLabel")}
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#ff3131] focus:ring-1 focus:ring-[#ff3131] outline-none resize-none"
                  placeholder={t("placeholderBio")}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-md hover:scale-105 transition-all"
                >
                  {t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Options Modal */}
      {showAvatarOptions && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAvatarOptions(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-xl space-y-2 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-2">
              {language === 'vi' ? 'Ảnh đại diện' : 'Profile Picture'}
            </h3>

            <button
              onClick={() => {
                setShowAvatarOptions(false);
                setShowFullAvatar(true);
              }}
              className="w-full py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#FFF5F3] hover:text-[#ff3131] rounded-xl transition-all"
            >
              {language === 'vi' ? 'Xem ảnh đại diện' : 'View profile picture'}
            </button>

            <button
              onClick={() => {
                setShowAvatarOptions(false);
                document.getElementById('avatar-upload')?.click();
              }}
              className="w-full py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#FFF5F3] hover:text-[#ff3131] rounded-xl transition-all"
            >
              {language === 'vi' ? 'Thay đổi ảnh đại diện' : 'Change profile picture'}
            </button>

            <button
              onClick={() => setShowAvatarOptions(false)}
              className="w-full py-2.5 text-sm font-semibold text-gray-400 hover:bg-gray-50 rounded-xl transition-all"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Full Avatar View Modal */}
      {showFullAvatar && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullAvatar(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2"
            onClick={() => setShowFullAvatar(false)}
          >
            <X size={28} />
          </button>
          <div
            className="max-w-2xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {userProfile.avatar ? (
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border-4 border-white/20"
              />
            ) : (
              <div className="w-64 h-64 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-7xl shadow-2xl">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}