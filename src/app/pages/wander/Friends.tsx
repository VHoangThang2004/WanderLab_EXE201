import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Users, UserPlus, Check, X, MessageCircle, MoreVertical, Search, Globe, Lock, Settings } from "lucide-react";
import { Link } from "react-router";
import { useLanguageStore } from "@/stores";

// Friend requests data
const friendRequests = [
  {
    id: "1",
    name: "Nguyễn Thị Lan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    mutualFriends: 12,
    location: "Hà Nội",
  },
  {
    id: "2",
    name: "Trần Minh Tuấn",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    mutualFriends: 8,
    location: "Đà Nẵng",
  },
  {
    id: "3",
    name: "Lê Hương Giang",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    mutualFriends: 15,
    location: "TP. Hồ Chí Minh",
  },
];

// Friends list
const myFriends = [
  {
    id: "1",
    name: "Nguyễn Thị Mai",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Hà Nội",
    diariesCount: 15,
    isOnline: true,
  },
  {
    id: "2",
    name: "Lê Văn Tuấn",
    avatar: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "TP. Hồ Chí Minh",
    diariesCount: 22,
    isOnline: false,
  },
  {
    id: "3",
    name: "Trần Phương Linh",
    avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Đà Nẵng",
    diariesCount: 18,
    isOnline: true,
  },
  {
    id: "4",
    name: "Phạm Minh Anh",
    avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Huế",
    diariesCount: 12,
    isOnline: false,
  },
  {
    id: "5",
    name: "Võ Thị Lan",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Nha Trang",
    diariesCount: 9,
    isOnline: true,
  },
  {
    id: "6",
    name: "Hoàng Văn Nam",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Cần Thơ",
    diariesCount: 14,
    isOnline: false,
  },
];

// Travel groups
const travelGroups = [
  {
    id: "1",
    name: "Phượt Miền Bắc",
    coverImage: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 248,
    posts: 1234,
    isPrivate: false,
    description: "Chia sẻ kinh nghiệm du lịch các tỉnh miền Bắc Việt Nam",
  },
  {
    id: "2",
    name: "Du Lịch Bụi Việt Nam",
    coverImage: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 1520,
    posts: 5680,
    isPrivate: false,
    description: "Cộng đồng yêu thích du lịch bụi, tiết kiệm, trải nghiệm văn hóa địa phương",
  },
  {
    id: "3",
    name: "Hội Mê Biển 🌊",
    coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 892,
    posts: 3420,
    isPrivate: false,
    description: "Khám phá các bãi biển đẹp nhất Việt Nam",
  },
  {
    id: "4",
    name: "Sống Ảo Check-In",
    coverImage: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 645,
    posts: 2890,
    isPrivate: true,
    description: "Chia sẻ địa điểm check-in hot, góc chụp đẹp",
  },
];

export function WanderFriends() {
  const [activeTab, setActiveTab] = useState<"requests" | "friends" | "groups">("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useLanguageStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center shadow-sm">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("title", "friends")}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t("subtitle", "friends")}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t("searchPlaceholder", "friends")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#030213] rounded-full border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "requests"
              ? "text-[#ff3131]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
          }`}
        >
          {t("requests", "friends")}
          {friendRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#ff3131] text-white text-xs rounded-full">
              {friendRequests.length}
            </span>
          )}
          {activeTab === "requests" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "friends"
              ? "text-[#ff3131]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
          }`}
        >
          {t("friendsList", "friends")} ({myFriends.length})
          {activeTab === "friends" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-6 py-3 font-semibold transition-all relative ${
            activeTab === "groups"
              ? "text-[#ff3131]"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white"
          }`}
        >
          {t("groups", "friends")} ({travelGroups.length})
          {activeTab === "groups" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
      </div>

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friendRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-[#030213] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <ImageWithFallback
                  src={request.avatar}
                  alt={request.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{request.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{request.location}</p>
                <p className="text-xs text-gray-400 mb-4">{request.mutualFriends} {t("mutualFriends", "friends")}</p>
                
                <div className="flex gap-2 w-full">
                  <button className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2">
                    <Check size={16} />
                    {t("accept", "friends")}
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                    <X size={16} />
                    {t("decline", "friends")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friends List Tab */}
      {activeTab === "friends" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-white dark:bg-[#030213] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <ImageWithFallback
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    {friend.isOnline && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{friend.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{friend.location}</p>
                    <p className="text-xs text-gray-400">{friend.diariesCount} {t("diaries", "friends")}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/profile/${friend.id}`}
                  className="flex-1 px-4 py-2 bg-[#FFF5F3] text-[#ff3131] rounded-full font-semibold hover:bg-[#FFE5E0] transition-all text-center"
                >
                  {t("dashboard", "common")}
                </Link>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Travel Groups Tab */}
      {activeTab === "groups" && (
        <div>
          {/* Create Group Button */}
          <div className="mb-6">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all">
              <UserPlus size={20} />
              {t("create", "common")}
            </button>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travelGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white dark:bg-[#030213] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all"
              >
                {/* Group Cover */}
                <div className="relative h-40">
                  <ImageWithFallback
                    src={group.coverImage}
                    alt={group.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {group.isPrivate && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                      <Lock size={14} className="text-white" />
                      <span className="text-xs text-white font-medium">{t("privacyPrivate", "createDiary")}</span>
                    </div>
                  )}
                  {!group.isPrivate && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                      <Globe size={14} className="text-white" />
                      <span className="text-xs text-white font-medium">{t("privacyPublic", "createDiary")}</span>
                    </div>
                  )}
                </div>

                {/* Group Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{group.description}</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400 ml-2">
                      <Settings size={20} />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{group.members.toLocaleString()} {t("members", "friends")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      <span>{group.posts.toLocaleString()} {t("posts", "friends")}</span>
                    </div>
                  </div>

                  <button className="w-full px-4 py-2.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all">
                    {t("join", "friends")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
