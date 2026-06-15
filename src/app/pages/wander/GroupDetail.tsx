import { useState } from "react";
import { useParams, Link } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import {
  Users,
  Globe,
  Lock,
  Settings,
  UserPlus,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Smile,
  MapPin,
  Calendar
} from "lucide-react";
import { motion } from "motion/react";

// Mock group data
const groupsData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Phượt Miền Bắc",
    coverImage: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    members: 248,
    posts: 1234,
    isPrivate: false,
    description: "Chia sẻ kinh nghiệm du lịch các tỉnh miền Bắc Việt Nam. Cộng đồng yêu thích khám phá vùng đất phía Bắc với những cảnh đẹp hùng vĩ, văn hóa đa dạng.",
    createdDate: "15/01/2024",
  },
  "2": {
    id: "2",
    name: "Du Lịch Bụi Việt Nam",
    coverImage: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    members: 1520,
    posts: 5680,
    isPrivate: false,
    description: "Cộng đồng yêu thích du lịch bụi, tiết kiệm, trải nghiệm văn hóa địa phương",
    createdDate: "10/12/2023",
  },
  "3": {
    id: "3",
    name: "Hội Mê Biển 🌊",
    coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    members: 892,
    posts: 3420,
    isPrivate: false,
    description: "Khám phá các bãi biển đẹp nhất Việt Nam",
    createdDate: "20/02/2024",
  },
  "4": {
    id: "4",
    name: "Sống Ảo Check-In",
    coverImage: "https://images.unsplash.com/photo-1643030080539-b411caf44c037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    members: 645,
    posts: 2890,
    isPrivate: true,
    description: "Chia sẻ địa điểm check-in hot, góc chụp đẹp",
    createdDate: "05/03/2024",
  },
};

// Mock posts data
const mockPosts = [
  {
    id: "1",
    author: {
      name: "Nguyễn Văn A",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    timestamp: "2 giờ trước",
    content: "Vừa mới về từ chuyến phượt Hà Giang 4 ngày 3 đêm. Cảnh đẹp quá mọi người ơi! Chia sẻ một vài tips cho các bạn sắp đi nhé 🏍️",
    images: [
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    likes: 124,
    comments: 18,
    location: "Hà Giang",
  },
  {
    id: "2",
    author: {
      name: "Trần Thị B",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    timestamp: "5 giờ trước",
    content: "Mình đang lên kế hoạch đi Sapa vào tháng sau. Có bạn nào muốn cùng đi không? Chi phí khoảng 2-3tr/người cho 3 ngày 2 đêm",
    images: [],
    likes: 45,
    comments: 32,
    location: "Sapa, Lào Cai",
  },
  {
    id: "3",
    author: {
      name: "Lê Văn C",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    timestamp: "1 ngày trước",
    content: "Review homestay ở Mộc Châu siêu xịn với giá sinh viên! View cực đẹp luôn 😍",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    ],
    likes: 89,
    comments: 15,
    location: "Mộc Châu, Sơn La",
  },
];

// Mock members data
const mockMembers = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    role: "Admin",
    joinedDate: "15/01/2024",
  },
  {
    id: "2",
    name: "Trần Thị B",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    role: "Thành viên",
    joinedDate: "20/01/2024",
  },
  {
    id: "3",
    name: "Lê Văn C",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    role: "Thành viên",
    joinedDate: "25/01/2024",
  },
];

export function GroupDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<"posts" | "about" | "members">("posts");
  const [newPost, setNewPost] = useState("");
  const [showPostInput, setShowPostInput] = useState(false);

  const group = groupsData[id || "1"];

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy nhóm</h2>
          <Link to="/friends?tab=groups" className="text-[#ff3131] hover:underline">
            Quay lại danh sách nhóm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F3] pb-8">
      {/* Cover Image */}
      <div className="relative h-80 bg-gray-200">
        <ImageWithFallback
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Group Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 -mt-20 relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                {group.isPrivate ? (
                  <div className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1.5">
                    <Lock size={14} className="text-gray-600" />
                    <span className="text-xs text-gray-600 font-medium">Riêng tư</span>
                  </div>
                ) : (
                  <div className="px-3 py-1 bg-blue-50 rounded-full flex items-center gap-1.5">
                    <Globe size={14} className="text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Công khai</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{group.members.toLocaleString()} thành viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} />
                  <span>{group.posts.toLocaleString()} bài viết</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all flex items-center gap-2"
              >
                <UserPlus size={18} />
                Mời bạn bè
              </motion.button>
              <button className="p-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all">
                <Settings size={18} />
              </button>
              <button className="p-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-1 p-2 border-b border-gray-100">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "posts"
                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Bài viết
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "about"
                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Giới thiệu
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === "members"
                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Thành viên
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                {/* Create Post */}
                <div className="bg-gray-50 rounded-xl p-4">
                  {!showPostInput ? (
                    <button
                      onClick={() => setShowPostInput(true)}
                      className="w-full text-left px-4 py-3 bg-white rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                    >
                      Bạn muốn chia sẻ điều gì?
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn..."
                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent resize-none"
                        rows={4}
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-all">
                            <ImageIcon size={20} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-all">
                            <MapPin size={20} />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-white rounded-lg transition-all">
                            <Smile size={20} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowPostInput(false);
                              setNewPost("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all"
                          >
                            Hủy
                          </button>
                          <button className="px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all">
                            Đăng
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Posts List */}
                {mockPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl p-6 border border-gray-100">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <ImageWithFallback
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-gray-900">{post.author.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{post.timestamp}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <MapPin size={14} />
                                  <span>{post.location}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 mb-4">{post.content}</p>

                    {/* Post Images */}
                    {post.images.length > 0 && (
                      <div className={`grid gap-2 mb-4 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {post.images.map((image, index) => (
                          <ImageWithFallback
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-xl"
                          />
                        ))}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#ff3131] transition-colors">
                        <Heart size={20} />
                        <span className="font-semibold">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#ff3131] transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-semibold">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-600 hover:text-[#ff3131] transition-colors">
                        <Share2 size={20} />
                        <span className="font-semibold">Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-3">Giới thiệu</h3>
                  <p className="text-gray-700 leading-relaxed">{group.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-4">Thông tin</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Users size={20} className="text-gray-400" />
                      <span>{group.members.toLocaleString()} thành viên</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar size={20} className="text-gray-400" />
                      <span>Được tạo ngày {group.createdDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      {group.isPrivate ? (
                        <>
                          <Lock size={20} className="text-gray-400" />
                          <span>Nhóm riêng tư</span>
                        </>
                      ) : (
                        <>
                          <Globe size={20} className="text-gray-400" />
                          <span>Nhóm công khai</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === "members" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    Thành viên · {group.members.toLocaleString()}
                  </h3>
                  <button className="text-[#ff3131] hover:text-[#ff914d] font-semibold text-sm">
                    Xem tất cả
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <ImageWithFallback
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{member.name}</h4>
                        <p className="text-sm text-gray-500">
                          {member.role} · Tham gia {member.joinedDate}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm border border-gray-200">
                        Nhắn tin
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
