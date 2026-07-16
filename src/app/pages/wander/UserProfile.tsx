import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Calendar,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  UserPlus,
  UserMinus,
  Mail,
  MoreVertical,
  Camera,
  Map,
  Award,
  Globe
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { UserAvatar } from "../../components/wander/UserAvatar";

// Mock user data - in real app, this would be fetched based on userId
const userData = {
  "1": {
    id: "1",
    name: "Nguyễn Thị Mai",
    username: "@mai.traveler",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    location: "Hà Nội, Việt Nam",
    bio: "Yêu thích khám phá văn hóa địa phương 🌏 | Phượt thủ chính hiệu 🎒 | Mê ẩm thực đường phố 🍜",
    joinDate: "Tham gia từ tháng 3/2024",
    stats: {
      diaries: 15,
      followers: 1234,
      following: 456,
      countriesVisited: 8,
      citiesVisited: 24
    },
    isFollowing: false,
    diaries: [
      {
        id: "1",
        title: "Hành trình khám phá Sapa mùa lúa chín",
        coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Sapa, Lào Cai",
        date: "15/05/2024",
        likes: 234,
        comments: 45,
        destination: "Sapa"
      },
      {
        id: "2",
        title: "Một tuần lang thang cổ trấn Hội An",
        coverImage: "https://images.unsplash.com/photo-1583416750470-965b2707b355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Hội An, Quảng Nam",
        date: "10/04/2024",
        likes: 456,
        comments: 78,
        destination: "Hội An"
      },
      {
        id: "3",
        title: "Chinh phục đỉnh Fansipan cùng bạn bè",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Fansipan, Lào Cai",
        date: "28/03/2024",
        likes: 567,
        comments: 92,
        destination: "Fansipan"
      },
      {
        id: "4",
        title: "Khám phá ẩm thực đường phố Sài Gòn",
        coverImage: "https://images.unsplash.com/photo-1562563575-80774d31732b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "TP. Hồ Chí Minh",
        date: "05/03/2024",
        likes: 389,
        comments: 61,
        destination: "Sài Gòn"
      }
    ]
  },
  "2": {
    id: "2",
    name: "Lê Văn Tuấn",
    username: "@tuan.explorer",
    avatar: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    location: "TP. Hồ Chí Minh, Việt Nam",
    bio: "Nhiếp ảnh gia du lịch 📸 | Yêu biển và núi 🏔️🌊 | Chia sẻ khoảnh khắc đẹp",
    joinDate: "Tham gia từ tháng 1/2024",
    stats: {
      diaries: 22,
      followers: 2456,
      following: 678,
      countriesVisited: 12,
      citiesVisited: 38
    },
    isFollowing: true,
    diaries: [
      {
        id: "5",
        title: "Bình minh tuyệt đẹp tại Phú Quốc",
        coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Phú Quốc, Kiên Giang",
        date: "20/05/2024",
        likes: 789,
        comments: 123,
        destination: "Phú Quốc"
      },
      {
        id: "6",
        title: "Trekking ngắm hoàng hôn Đà Lạt",
        coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Đà Lạt, Lâm Đồng",
        date: "12/04/2024",
        likes: 654,
        comments: 98,
        destination: "Đà Lạt"
      }
    ]
  },
  "3": {
    id: "3",
    name: "Trần Phương Linh",
    username: "@linh.wanderlust",
    avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    coverImage: "https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    location: "Đà Nẵng, Việt Nam",
    bio: "Digital nomad 💻 | Foodie chính hiệu 🍴 | Săn lùng những góc check-in đẹp",
    joinDate: "Tham gia từ tháng 2/2024",
    stats: {
      diaries: 18,
      followers: 1876,
      following: 523,
      countriesVisited: 10,
      citiesVisited: 31
    },
    isFollowing: false,
    diaries: [
      {
        id: "7",
        title: "Cung đường ven biển Đà Nẵng - Hội An",
        coverImage: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        location: "Đà Nẵng",
        date: "18/05/2024",
        likes: 512,
        comments: 76,
        destination: "Đà Nẵng"
      }
    ]
  }
};

export function WanderUserProfile() {
  const { username: userId } = useParams<{ username: string }>();
  const currentUser = useAuthStore(state => state.user);
  
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      // If it's a mock data ID (1, 2, 3), fallback to mock
      if (userData[userId as keyof typeof userData]) {
        return userData[userId as keyof typeof userData];
      }

      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (profileError) {
        console.error("Profile fetch error:", profileError);
      }
      if (!profile) return null;

      const { data: diaries, error: diariesError } = await supabase.from('diaries').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (diariesError) {
        console.error("Diaries fetch error:", diariesError);
      }

      const uniqueCities = new Set(diaries?.map(d => d.location).filter(Boolean));
      const citiesVisited = uniqueCities.size > 0 ? uniqueCities.size : 0;
      const countriesVisited = citiesVisited > 0 ? 1 : 0; // Simple estimation

      return {
        id: profile.id,
        name: profile.full_name || 'Người dùng',
        username: `@${profile.username || profile.full_name?.toLowerCase().replace(/\s+/g, '')}`,
        avatar: profile.avatar_url,
        coverImage: profile.cover_url || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
        location: profile.location || "Chưa cập nhật",
        bio: profile.bio || "Thích đi du lịch và khám phá những vùng đất mới 🌏",
        joinDate: "Tham gia từ " + new Date(profile.created_at).toLocaleDateString('vi-VN'),
        stats: {
          diaries: diaries?.length || 0,
          followers: profile.followers_count || 0,
          following: profile.following_count || 0,
          countriesVisited: countriesVisited,
          citiesVisited: citiesVisited
        },
        isFollowing: false, // Could be checked with friendService
        diaries: diaries?.map(d => ({
          id: d.id,
          title: d.title,
          coverImage: (d.images && d.images.length > 0) ? d.images[0] : "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
          location: d.location || "Không rõ",
          date: new Date(d.created_at).toLocaleDateString('vi-VN'),
          likes: d.likes_count || 0,
          comments: d.comments_count || 0,
          destination: d.location || "Không rõ"
        })) || []
      };
    },
    enabled: !!userId,
  });

  const user = dbUser;
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"diaries" | "saved" | "stats">("diaries");

  useEffect(() => {
    if (user) {
      setIsFollowing(user.isFollowing || false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang tải thông tin...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy người dùng</h2>
        <Link to="/friends" className="text-[#ff3131] hover:text-[#ff914d] font-semibold">
          ← Quay lại danh sách bạn bè
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Cover Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 shadow-lg"
      >
        <ImageWithFallback
          src={user.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <Link
          to="/friends"
          className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full font-semibold hover:bg-white transition-all shadow-sm"
        >
          ← Quay lại
        </Link>

        {/* More Options */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm">
          <MoreVertical size={20} className="text-gray-700" />
        </button>
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 -mt-20 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="relative">
            <UserAvatar
              src={user.avatar}
              name={user.name}
              className="w-32 h-32 border-4 border-white shadow-lg text-5xl"
            />
            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-600 mb-2">{user.username}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">

                <Link
                  to="/messages"
                  className="px-6 py-2.5 bg-[#FFF5F3] text-[#ff3131] rounded-full font-semibold hover:bg-[#FFE5E0] transition-all flex items-center gap-2"
                >
                  <Mail size={18} />
                  Nhắn tin
                </Link>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 mb-4">{user.bio}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center">
                  <Camera className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{user.stats.diaries}</p>
                  <p className="text-xs text-gray-500">Nhật ký</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center">
                  <Globe className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{user.stats.countriesVisited}</p>
                  <p className="text-xs text-gray-500">Quốc gia</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center">
                  <Map className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{user.stats.citiesVisited}</p>
                  <p className="text-xs text-gray-500">Thành phố</p>
                </div>
              </div>
            </div>

            {/* Join Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{user.joinDate}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("diaries")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "diaries"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Nhật ký du lịch ({user.diaries.length})
          {activeTab === "diaries" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "saved"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đã lưu
          {activeTab === "saved" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "stats"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thống kê
          {activeTab === "stats" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
            />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "diaries" && (
          <motion.div
            key="diaries"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {user.diaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/diary/${diary.id}`}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all block"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={diary.coverImage}
                      alt={diary.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1 text-white text-sm mb-2">
                        <MapPin size={14} />
                        <span>{diary.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#ff3131] transition-colors">
                      {diary.title}
                    </h3>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{diary.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart size={14} />
                          <span>{diary.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={14} />
                          <span>{diary.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "saved" && (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có nhật ký đã lưu</h3>
            <p className="text-gray-500">Nhật ký được lưu sẽ hiển thị ở đây</p>
          </motion.div>
        )}

        {activeTab === "stats" && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Travel Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center">
                  <Map className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thống kê du lịch</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Tổng số nhật ký</span>
                  <span className="text-2xl font-bold text-[#ff3131]">{user.stats.diaries}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Quốc gia đã đến</span>
                  <span className="text-2xl font-bold text-[#ff3131]">{user.stats.countriesVisited}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Thành phố đã đến</span>
                  <span className="text-2xl font-bold text-[#ff3131]">{user.stats.citiesVisited}</span>
                </div>
              </div>
            </div>

            {/* Social Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Thống kê cộng đồng</h3>
              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span className="text-gray-700">Tỷ lệ tương tác</span>
                  <span className="text-2xl font-bold text-[#ff3131]">12.5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
