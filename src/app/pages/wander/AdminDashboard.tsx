import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Bell,
  User,
  Users,
  FileText,
  Activity,
  TrendingUp,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Eye,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  DollarSign,
  Heart,
  MessageSquare,
  Flag,
  Trash2,
  Check,
  X,
  Sparkles,
  BarChart3,
  Globe,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// Mock data
const stats: any[] = [];
const users: any[] = [];
const pendingJournals: any[] = [];

const roleColors = {
  Explorer: "bg-blue-100 text-blue-700",
  Planner: "bg-purple-100 text-purple-700",
  "Local Provider": "bg-orange-100 text-orange-700",
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
};

export function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState<"overview" | "users" | "content" | "ai">("overview");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6 flex-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng, nhật ký, báo cáo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-6 border-t border-gray-100">
          <button
            onClick={() => setSelectedTab("overview")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              selectedTab === "overview"
                ? "border-[#ff3131] text-[#ff3131]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Activity size={16} className="inline mr-2" />
            Tổng Quan
          </button>
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              selectedTab === "users"
                ? "border-[#ff3131] text-[#ff3131]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users size={16} className="inline mr-2" />
            Người Dùng & Đối Tác
          </button>
          <button
            onClick={() => setSelectedTab("content")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              selectedTab === "content"
                ? "border-[#ff3131] text-[#ff3131]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            Kiểm Duyệt Nội Dung
          </button>
          <button
            onClick={() => setSelectedTab("ai")}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
              selectedTab === "ai"
                ? "border-[#ff3131] text-[#ff3131]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles size={16} className="inline mr-2" />
            AI & Dữ Liệu
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <AnimatePresence mode="wait">
          {selectedTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(255, 49, 49, 0.1)" }}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                          <motion.p
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                            className="text-3xl font-bold text-gray-900 mb-2"
                          >
                            {stat.value}
                          </motion.p>
                          <div className="flex items-center gap-1 text-sm">
                            <TrendingUp size={14} className="text-green-600" />
                            <span className="text-green-600 font-semibold">{stat.change}</span>
                            <span className="text-gray-500 ml-1">so với tháng trước</span>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="w-12 h-12 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-xl flex items-center justify-center"
                        >
                          <IconComponent className="text-[#ff3131]" size={24} />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Tăng Trưởng Người Dùng</h3>
                    <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff3131]">
                      <option>7 ngày qua</option>
                      <option>30 ngày qua</option>
                      <option>3 tháng qua</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 65, 55, 75, 85, 70, 90].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                          whileHover={{ scale: 1.05, opacity: 0.8 }}
                          className="w-full bg-gradient-to-t from-[#ff3131] to-[#ff914d] rounded-t-lg cursor-pointer"
                        ></motion.div>
                        <span className="text-xs text-gray-500">T{i + 2}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Geographic Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Hoạt Động Theo Địa Lý</h3>
                  <div className="space-y-4">
                    {[
                      { location: "Phú Quốc", count: 342, percent: 85 },
                      { location: "Hà Nội", count: 289, percent: 72 },
                      { location: "Đà Nẵng", count: 256, percent: 64 },
                      { location: "Hội An", count: 198, percent: 50 },
                      { location: "Sa Pa", count: 167, percent: 42 },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{item.location}</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700">{item.count}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full"
                          ></motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hoạt Động Gần Đây</h3>
                <div className="space-y-4">
                  {[
                    { type: "journal", user: "Nguyễn Văn An", action: "đã tạo nhật ký mới", item: '"Thiên Đường Phú Quốc"', time: "2 phút trước" },
                    { type: "report", user: "Hệ thống", action: "đã phát hiện báo cáo", item: "Nội dung vi phạm #1247", time: "15 phút trước" },
                    { type: "user", user: "Trần Thị Bình", action: "đã đăng ký tài khoản", item: "Local Provider", time: "1 giờ trước" },
                    { type: "verify", user: "Admin", action: "đã xác minh đối tác", item: "Sa Pa Adventures", time: "2 giờ trước" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "report" ? "bg-red-500" :
                        activity.type === "verify" ? "bg-green-500" :
                        "bg-blue-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                          <span className="font-semibold text-[#ff3131]">{activity.item}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                    <Filter size={16} />
                    Lọc
                  </button>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3131]">
                    <option>Tất cả vai trò</option>
                    <option>Explorer</option>
                    <option>Planner</option>
                    <option>Local Provider</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3131]">
                    <option>Tất cả trạng thái</option>
                    <option>Đang hoạt động</option>
                    <option>Chờ duyệt</option>
                    <option>Đã đình chỉ</option>
                  </select>
                  <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow">
                    <Download size={16} />
                    Xuất dữ liệu
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Người dùng
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Vai trò
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Uy tín
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Ngày tham gia
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <ImageWithFallback
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role as keyof typeof roleColors]}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status as keyof typeof statusColors]}`}>
                              {user.status === "active" ? "Hoạt động" : user.status === "pending" ? "Chờ duyệt" : "Đình chỉ"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.reputation > 0 ? (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-20">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
                                    style={{ width: `${user.reputation}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{user.reputation}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.joinDate).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {user.status === "pending" && (
                                <>
                                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Phê duyệt">
                                    <Check size={16} />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Từ chối">
                                    <X size={16} />
                                  </button>
                                </>
                              )}
                              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Filter Tabs */}
              <div className="flex items-center gap-4">
                <button className="px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-lg font-medium text-sm">
                  Chờ duyệt ({pendingJournals.filter(j => j.status === "pending").length})
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                  Đã gắn cờ ({pendingJournals.filter(j => j.status === "flagged").length})
                </button>
                <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
                  Báo cáo cộng đồng (5)
                </button>
              </div>

              {/* Journal Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pendingJournals.map((journal) => (
                  <div key={journal.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Cover Image */}
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={journal.cover}
                        alt={journal.title}
                        className="w-full h-full object-cover"
                      />
                      {journal.status === "flagged" && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                          <Flag size={12} />
                          Đã gắn cờ
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                          📷 {journal.images}
                        </span>
                        <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                          🎥 {journal.videos}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{journal.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">bởi {journal.author}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={14} className="text-gray-400" />
                          {journal.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign size={14} className="text-gray-400" />
                          Ngân sách: {journal.budget}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} className="text-gray-400" />
                          {journal.submittedAt}
                        </div>
                      </div>

                      {/* Authenticity Score */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-600">Độ tin cậy AI</span>
                          <span className={`text-xs font-bold ${
                            journal.authenticity >= 90 ? "text-green-600" :
                            journal.authenticity >= 70 ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {journal.authenticity}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              journal.authenticity >= 90 ? "bg-green-500" :
                              journal.authenticity >= 70 ? "bg-yellow-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${journal.authenticity}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-3 gap-2">
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                          <CheckCircle size={14} />
                          Duyệt
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors">
                          <Flag size={14} />
                          Cờ
                        </button>
                        <button className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* AI System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Hệ Thống AI</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mb-2">Hoạt động bình thường</p>
                  <p className="text-sm text-gray-600">Uptime: 99.8%</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Độ Chính Xác</h3>
                    <BarChart3 size={20} className="text-[#ff3131]" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-2">94.2%</p>
                  <p className="text-sm text-gray-600">Gợi ý lịch trình</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Cảnh Báo</h3>
                    <AlertTriangle size={20} className="text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">2</p>
                  <p className="text-sm text-gray-600">Gợi ý quá mainstream</p>
                </div>
              </div>

              {/* Data Flow Visualization */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Luồng Dữ Liệu AI</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Nhật ký du lịch", value: "1,247", icon: FileText, color: "blue" },
                    { label: "Hành vi tìm kiếm", value: "8,392", icon: Search, color: "purple" },
                    { label: "Sở thích người dùng", value: "12,456", icon: Heart, color: "pink" },
                    { label: "Dữ liệu ngân sách", value: "3,891", icon: DollarSign, color: "green" },
                  ].map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <IconComponent size={24} className={`text-${item.color}-600 mb-3`} />
                        <p className="text-2xl font-bold text-gray-900 mb-1">{item.value}</p>
                        <p className="text-xs text-gray-600">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Activity Logs */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Nhật Ký Hoạt Động AI</h3>
                <div className="space-y-3">
                  {[
                    { time: "14:32", action: "Tạo lịch trình cho Nguyễn Văn An", result: "Thành công", confidence: 94 },
                    { time: "14:28", action: "Gắn tag tự động cho nhật ký #1247", result: "Thành công", confidence: 88 },
                    { time: "14:15", action: "Phát hiện nội dung quá mainstream", result: "Cảnh báo", confidence: 76 },
                    { time: "13:58", action: "Gợi ý điểm đến cho Lê Minh Châu", result: "Thành công", confidence: 92 },
                    { time: "13:42", action: "Phân tích độ tin cậy nhật ký", result: "Thành công", confidence: 95 },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs font-mono text-gray-500 w-12">{log.time}</span>
                      <p className="flex-1 text-sm text-gray-900">{log.action}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        log.result === "Thành công" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {log.result}
                      </span>
                      <span className="text-xs text-gray-600">{log.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}