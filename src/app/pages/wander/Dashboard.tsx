import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { Link } from "react-router";
import { Plus, Settings, MapPin, Calendar, Users, Heart, Bookmark, MessageCircle, Image, Route } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useSavedItineraries } from "../../hooks/useSavedItineraries";
import { useState } from "react";
import { ItineraryDetailModal } from "../../components/wander/ItineraryDetailModal";
import { useAuthStore } from "@/stores";

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
  const { user } = useAuthStore();
  const { itineraries: savedItineraries, removeItinerary } = useSavedItineraries();
  const [openItinerary, setOpenItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState<"posts" | "saved" | "trips">("posts");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Build profile from real auth data
  const userProfile = {
    name: user?.full_name || "Du Khách",
    avatar: user?.avatar_url || "",
    coverImage: user?.cover_image_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    location: user?.location || "Chưa cập nhật",
    bio: user?.bio || "Hãy thêm mô tả về bạn... 🎒🌏",
    diariesCount: user?.diaries_count || 0,
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
          <button className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-xl font-semibold hover:bg-white transition-all flex items-center gap-2">
            <Image size={16} />
            Đổi ảnh bìa
          </button>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 md:-top-20">
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
            </div>

            {/* Profile Actions */}
            <div className="flex justify-end pt-4 gap-3">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <Settings size={16} />
                Chỉnh sửa
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
                  <span className="text-gray-600 ml-1">nhật ký</span>
                </div>
                <div>
                  <button className="hover:text-[#ff3131] transition-colors">
                    <span className="font-bold text-gray-900">{userProfile.followersCount.toLocaleString("vi-VN")}</span>
                    <span className="text-gray-600 ml-1">người theo dõi</span>
                  </button>
                </div>
                <div>
                  <button className="hover:text-[#ff3131] transition-colors">
                    <span className="font-bold text-gray-900">{userProfile.followingCount}</span>
                    <span className="text-gray-600 ml-1">đang theo dõi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-t border-gray-100">
            <button
              onClick={() => setActiveTab("posts")}
              className={`px-4 py-4 font-semibold transition-all relative ${
                activeTab === "posts"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nhật Ký
              {activeTab === "posts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-4 font-semibold transition-all relative ${
                activeTab === "saved"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Đã Lưu
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("trips")}
              className={`px-4 py-4 font-semibold transition-all relative ${
                activeTab === "trips"
                  ? "text-[#ff3131]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Thống Kê
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
                      Chia sẻ kỷ niệm du lịch của bạn...
                    </Link>
                    <Link
                      to="/create"
                      className="px-5 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Tạo
                    </Link>
                  </div>
                </div>

                {/* Journal Posts */}
                {myJournalPosts.map((post) => (
                  <JournalPostCard key={post.id} {...post} />
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Nhật Ký Đã Lưu</h2>
                {savedItineraries.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                    <Bookmark className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có nhật ký đã lưu</h3>
                    <p className="text-gray-600 mb-6">
                      Lưu những nhật ký yêu thích để xem lại sau
                    </p>
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all"
                    >
                      Khám Phá Nhật Ký
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedItineraries.map((itinerary) => (
                      <div
                        key={itinerary.id}
                        className="bg-white rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => setOpenItinerary(itinerary)}
                          className="text-left flex-1 flex gap-4"
                        >
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                            {/* Placeholder for itinerary preview */}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {itinerary.destination}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {itinerary.days.length} ngày • {itinerary.budget}
                            </p>
                          </div>
                        </button>
                        <button
                          onClick={() => removeItinerary(itinerary.id)}
                          className="px-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Bookmark size={20} className="fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "trips" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Thống Kê Du Lịch</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4">
                  {travelStats.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
                      <p className="text-3xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Travel Map Placeholder */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
                  <div className="w-full h-64 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-2xl flex items-center justify-center">
                    <div>
                      <MapPin className="mx-auto text-[#ff3131] mb-3" size={48} />
                      <p className="text-gray-600">Bản đồ hành trình của bạn</p>
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
              <h3 className="font-bold text-gray-900 mb-4">Hành Động Nhanh</h3>
              <Link
                to="/create"
                className="block w-full px-4 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-md transition-all text-center"
              >
                📝 Tạo Nhật Ký Mới
              </Link>
              <Link
                to="/create-itinerary"
                className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#ff3131] transition-all text-center flex items-center justify-center gap-2"
              >
                <Route size={16} />
                Lập Kế Hoạch AI
              </Link>
              <Link
                to="/explore"
                className="block w-full px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#ff3131] transition-all text-center"
              >
                🔍 Khám Phá
              </Link>
            </div>

            {/* Activity Summary */}
            <div className="bg-gradient-to-br from-[#FFF5F3] to-white rounded-3xl border border-red-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Hoạt Động Gần Đây</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart size={14} className="text-[#ff3131]" />
                    <span>Tổng lượt thích</span>
                  </div>
                  <span className="font-bold text-gray-900">1,125</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={14} className="text-[#ff3131]" />
                    <span>Bình luận</span>
                  </div>
                  <span className="font-bold text-gray-900">160</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bookmark size={14} className="text-[#ff3131]" />
                    <span>Lượt lưu</span>
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
    </div>
  );
}