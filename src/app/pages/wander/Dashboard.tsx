import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { Link } from "react-router";
import { Plus, Settings, MapPin, Calendar, Users, Heart, Bookmark, MessageCircle, Image, Route, X, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useSavedItineraries } from "../../hooks/useSavedItineraries";
import { useState, useEffect } from "react";
import { ItineraryDetailModal } from "../../components/wander/ItineraryDetailModal";
import { useAuthStore, useLanguageStore } from "@/stores";
import { diaryService } from "@/api/diaryService";

// User's travel journal posts
const myJournalPosts = [
  {
    id: "1",
    author: {
      name: "Phan Văn Minh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Vịnh Hạ Long, Quảng Ninh",
    date: "20 tháng 6, 2026",
    caption: "5 ngày trên vịnh Hạ Long thật không thể quên! Sáng sớm nhìn mặt trời mọc từ boong tàu, không khí trong lành và cảnh đẹp như tranh vẽ. Chèo kayak qua những hang động nhỏ, tắm biển ở đảo Ti Tốp, và ngắm hoàng hôn lãng mạn. 🌅⛵",
    likes: 324,
    comments: 47,
    isLiked: false,
    isSaved: false,
    groupSize: "2 người",
  },
  {
    id: "3",
    author: {
      name: "Phan Văn Minh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Sa Pa, Lào Cai",
    date: "18 tháng 9, 2026",
    caption: "Tháng 9 đến Sa Pa chính là thời điểm vàng! Ruộng bậc thang chuyển màu vàng óng tuyệt đẹp như tranh. Trek qua các bản làng H'Mông, gặp những nụ cười thật thà và chân thành. Chinh phc Fansipan 3143m - cảm giác đứng trên nóc nhà Đông Dương thật tuyệt vời! 🌾⛰️",
    likes: 412,
    comments: 62,
    isLiked: false,
    isSaved: false,
    groupSize: "3 người",
  },
  {
    id: "4",
    author: {
      name: "Phan Văn Minh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Hội An, Quảng Nam",
    date: "14 tháng 4, 2026",
    caption: "Đêm rằm Hội An lung linh huyền ảo với hàng ngàn chiếc đèn lồng! Dạo phố cổ, học làm cao lầu và mì Quảng, thả hoa đăng trên sông Hoài. Cảm giác như lạc vào thế giới cổ tích. 🏮✨",
    likes: 389,
    comments: 51,
    isLiked: true,
    isSaved: false,
    groupSize: "2 người",
  },
];

// Travel stats
const travelStats = [
  { label: "Tỉnh thành", value: "15" },
  { label: "Quốc gia", value: "3" },
  { label: "Tổng ngày", value: "48" },
];

export function WanderDashboard() {
  const { user, updateProfile, uploadAvatar, uploadCover } = useAuthStore();
  const { t, language } = useLanguageStore();
  const { itineraries: savedItineraries, removeItinerary } = useSavedItineraries();
  const [openItinerary, setOpenItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "trips">("posts");
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
          <div className="relative pb-6">
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

            {/* Profile Actions */}
            <div className="flex justify-end pt-4 gap-3">
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Settings size={16} />
                {t("edit")}
              </button>
            </div>

            {/* Name & Bio */}
            <div className="mt-4">
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
              <div className="flex items-center gap-6 text-sm">
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
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-t border-gray-100">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-4 font-semibold transition-all relative ${activeTab === "posts"
                ? "text-[#ff3131]"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {t("myJournals")}
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-4 font-semibold transition-all relative ${activeTab === "saved"
                ? "text-[#ff3131]"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {t("savedJournals")}
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("trips")}
              className={`px-4 py-4 font-semibold transition-all relative ${activeTab === "trips"
                ? "text-[#ff3131]"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {t("itineraryStats")}
              {activeTab === "trips" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "posts" && (
              <div className="space-y-6">
                {/* Create Post Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-12 h-12 rounded-full object-cover"
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

            {activeTab === "saved" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">{t("savedJournals")}</h2>
                {isLoadingSaved ? (
                  <div className="text-center py-10 text-gray-500">
                    {language === 'vi' ? 'Đang tải...' : 'Loading...'}
                  </div>
                ) : savedDiaries.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <Bookmark className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'vi' ? 'Chưa có nhật ký đã lưu' : 'No saved journals yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {language === 'vi' ? 'Lưu những nhật ký yêu thích để xem lại sau' : 'Save your favorite journals to view them later'}
                    </p>
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all"
                    >
                      {language === 'vi' ? 'Khám Phá Nhật Ký' : 'Explore Journals'}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {savedDiaries.map((post) => (
                      <JournalPostCard key={post.id} {...post} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "trips" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">{t("travelStats")}</h2>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {travelStats.map((stat) => (
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

                {/* Travel Map Placeholder */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
                  <div className="w-full h-64 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-2xl flex items-center justify-center">
                    <div>
                      <MapPin className="mx-auto text-[#ff3131] mb-3" size={48} />
                      <p className="text-gray-600">
                        {language === 'vi' ? 'Bản đồ hành trình của bạn' : 'Your travel journey map'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
              <Link
                to="/explore"
                className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#ff3131] transition-all text-center"
              >
                {t("searchExplore")}
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
                  <span className="font-bold text-gray-900">1,125</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={14} className="text-[#ff3131]" />
                    <span>{t("comments")}</span>
                  </div>
                  <span className="font-bold text-gray-900">160</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bookmark size={14} className="text-[#ff3131]" />
                    <span>{t("bookmarks")}</span>
                  </div>
                  <span className="font-bold text-gray-900">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Modal */}
      {openItinerary && (
        <ItineraryDetailModal
          itinerary={openItinerary}
          onClose={() => setOpenItinerary(null)}
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