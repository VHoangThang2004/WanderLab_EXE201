import { useState } from "react";
import { X, Search, Users, MessageCircle, Globe, Lock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedGroups = [
  {
    id: "1",
    name: "Chinh phục núi non Việt Nam",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 3421,
    posts: 8567,
    isPrivate: false,
    category: "Núi non",
    description: "Cộng đồng yêu thích leo núi, trekking và khám phá thiên nhiên",
  },
  {
    id: "2",
    name: "Hội mê biển Việt Nam",
    coverImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 5234,
    posts: 12456,
    isPrivate: false,
    category: "Biển đảo",
    description: "Khám phá các bãi biển đẹp nhất Việt Nam",
  },
  {
    id: "3",
    name: "Food Tour Việt Nam",
    coverImage: "https://images.unsplash.com/photo-1562563575-80774d31732b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 2890,
    posts: 9845,
    isPrivate: false,
    category: "Ẩm thực",
    description: "Săn lùng món ngon khắp ba miền Tổ quốc",
  },
  {
    id: "4",
    name: "Du lịch Solo VN",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    members: 1567,
    posts: 4321,
    isPrivate: true,
    category: "Solo Travel",
    description: "Cộng đồng những người thích đi du lịch một mình",
  },
];

export function JoinGroupModal({ isOpen, onClose }: JoinGroupModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Núi non", "Biển đảo", "Ẩm thực", "Solo Travel", "Phượt bụi"];

  const filteredGroups = suggestedGroups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-3xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Tham Gia Nhóm Du Lịch</h2>
                <p className="text-white/80 text-sm">Khám phá và kết nối với cộng đồng</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Search & Filter */}
            <div className="p-6 bg-gray-50 border-b border-gray-200">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm nhóm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category === "all" ? "Tất cả" : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Groups List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy nhóm</h3>
                  <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                    >
                      {/* Cover */}
                      <div className="relative h-32">
                        <ImageWithFallback
                          src={group.coverImage}
                          alt={group.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                          {group.isPrivate ? (
                            <>
                              <Lock size={12} className="text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">Riêng tư</span>
                            </>
                          ) : (
                            <>
                              <Globe size={12} className="text-green-600" />
                              <span className="text-xs font-medium text-gray-700">Công khai</span>
                            </>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-1 bg-[#ff3131] text-white text-xs font-semibold rounded-full">
                            {group.category}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{group.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>

                        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{group.members.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={14} />
                            <span>{group.posts.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            <span className="text-green-600 font-semibold">+{Math.floor(Math.random() * 50 + 10)}/ngày</span>
                          </div>
                        </div>

                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all">
                          {group.isPrivate ? "Gửi yêu cầu" : "Tham gia ngay"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
