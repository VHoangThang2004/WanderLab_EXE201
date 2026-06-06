import { useState } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useLanguageStore } from "@/stores";
import { Users, UserPlus, Check, X, MessageCircle, MoreVertical, Search, Globe, Lock, Settings } from "lucide-react";
import { Link } from "react-router";
import { useAuthStore, useUIStore } from "@/stores";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "@/api/friendService";

export function WanderFriends() {
  const [activeTab, setActiveTab] = useState<"requests" | "friends" | "groups">("requests");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const queryClient = useQueryClient();

  // Local state for dynamic groups (since there is no DB table for groups yet)
  const [localGroups, setLocalGroups] = useState<any[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  // Fetch real data from Supabase follows table
  const { data, isLoading } = useQuery({
    queryKey: ['friendData', user?.id],
    queryFn: () => friendService.fetchFriendData(user?.id || ''),
    enabled: !!user?.id,
    retry: false,
  });

  const hasRealData = !!(user?.id && data && !isLoading);

  const displayRequests = hasRealData
    ? data.requests.map((r: any) => ({
      id: r.id,
      name: r.full_name,
      avatar: r.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
      mutualFriends: 0,
      location: r.location || "Chưa cập nhật",
    }))
    : [];

  const displayFriends = hasRealData
    ? data.friends.map((f: any) => ({
      id: f.id,
      name: f.full_name,
      avatar: f.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200",
      location: f.location || "Chưa cập nhật",
      diariesCount: f.diaries_count || 0,
      isOnline: true,
    }))
    : [];

  // Mutations
  const acceptMutation = useMutation({
    mutationFn: (requesterId: string) => friendService.followUser(user?.id || '', requesterId),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Đã chấp nhận lời mời kết bạn!' });
      queryClient.invalidateQueries({ queryKey: ['friendData', user?.id] });
    },
    onError: (error: any) => {
      addToast({ type: 'error', message: 'Lỗi: ' + error.message });
    }
  });

  const declineMutation = useMutation({
    mutationFn: (requesterId: string) => friendService.unfollowUser(requesterId, user?.id || ''),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Đã từ chối lời mời kết bạn.' });
      queryClient.invalidateQueries({ queryKey: ['friendData', user?.id] });
    },
    onError: (error: any) => {
      addToast({ type: 'error', message: 'Lỗi: ' + error.message });
    }
  });

  const unfriendMutation = useMutation({
    mutationFn: (friendId: string) => friendService.unfollowUser(user?.id || '', friendId),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Đã hủy kết bạn thành công.' });
      queryClient.invalidateQueries({ queryKey: ['friendData', user?.id] });
    },
    onError: (error: any) => {
      addToast({ type: 'error', message: 'Lỗi: ' + error.message });
    }
  });

  // Handlers
  const handleAccept = async (requesterId: string) => {
    if (hasRealData && data.requests.some((r: any) => r.id === requesterId)) {
      acceptMutation.mutate(requesterId);
    }
  };

  const handleDecline = async (requesterId: string) => {
    if (hasRealData && data.requests.some((r: any) => r.id === requesterId)) {
      declineMutation.mutate(requesterId);
    }
  };

  const handleUnfriend = async (friendId: string) => {
    if (hasRealData && data.friends.some((f: any) => f.id === friendId)) {
      unfriendMutation.mutate(friendId);
    }
  };

  const handleToggleGroup = (groupId: string, groupName: string) => {
    if (joinedGroupIds.includes(groupId)) {
      setJoinedGroupIds(prev => prev.filter(id => id !== groupId));
      addToast({ type: 'success', message: `Đã rời khỏi nhóm "${groupName}"` });
    } else {
      setJoinedGroupIds(prev => [...prev, groupId]);
      addToast({ type: 'success', message: `Đã tham gia nhóm "${groupName}" thành công!` });
    }
  };

  const handleCreateGroup = () => {
    const groupName = prompt('Nhập tên nhóm du lịch mới:');
    if (!groupName) return;
    const groupDesc = prompt('Nhập mô tả nhóm:') || '';

    const newGroup = {
      id: `group_${Date.now()}`,
      name: groupName,
      coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
      members: 1,
      posts: 0,
      isPrivate: false,
      description: groupDesc,
    };

    setLocalGroups(prev => [newGroup, ...prev]);
    setJoinedGroupIds(prev => [...prev, newGroup.id]);
    addToast({ type: 'success', message: `Đã tạo nhóm "${groupName}" thành công!` });
  };

  // Search filtering
  const filteredRequests = displayRequests.filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.name.toLowerCase().includes(q) || (r.location && r.location.toLowerCase().includes(q));
  });

  const filteredFriends = displayFriends.filter(f => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return f.name.toLowerCase().includes(q) || (f.location && f.location.toLowerCase().includes(q));
  });

  const filteredGroups = localGroups.filter(g => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center shadow-sm">
            <Users className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bạn Bè</h1>
            <p className="text-gray-600">Kết nối và chia sẻ trải nghiệm du lịch</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-6 py-3 font-semibold transition-all relative ${activeTab === "requests"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Lời mời kết bạn
          {filteredRequests.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-[#ff3131] text-white text-xs rounded-full">
              {filteredRequests.length}
            </span>
          )}
          {activeTab === "requests" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-6 py-3 font-semibold transition-all relative ${activeTab === "friends"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Bạn bè ({filteredFriends.length})
          {activeTab === "friends" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-6 py-3 font-semibold transition-all relative ${activeTab === "groups"
              ? "text-[#ff3131]"
              : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Nhóm du lịch ({filteredGroups.length})
          {activeTab === "groups" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ff3131] to-[#ff914d]" />
          )}
        </button>
      </div>

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <div>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
              Đang tải danh sách lời mời...
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
              Không có lời mời kết bạn nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <ImageWithFallback
                      src={request.avatar}
                      alt={request.name}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                    <h3 className="font-bold text-gray-900 mb-1">{request.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{request.location}</p>
                    {request.mutualFriends > 0 && (
                      <p className="text-xs text-gray-400 mb-4">{request.mutualFriends} bạn chung</p>
                    )}

                    <div className="flex gap-2 w-full mt-2">
                      <button
                        onClick={() => handleAccept(request.id)}
                        disabled={acceptMutation.isPending}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Check size={16} />
                        {acceptMutation.isPending ? 'Đang xử lý...' : 'Chấp nhận'}
                      </button>
                      <button
                        onClick={() => handleDecline(request.id)}
                        disabled={declineMutation.isPending}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X size={16} />
                        {declineMutation.isPending ? 'Đang từ chối...' : 'Từ chối'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friends List Tab */}
      {activeTab === "friends" && (
        <div>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
              Đang tải danh sách bạn bè...
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
              Chưa có bạn bè nào trong danh sách.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
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
                        <h3 className="font-bold text-gray-900">{friend.name}</h3>
                        <p className="text-sm text-gray-500">{friend.location}</p>
                        <p className="text-xs text-gray-400">{friend.diariesCount} nhật ký</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Bạn có chắc muốn hủy kết bạn với ${friend.name}?`)) {
                          handleUnfriend(friend.id);
                        }
                      }}
                      disabled={unfriendMutation.isPending}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                      title="Hủy kết bạn"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/profile/${friend.id}`}
                      className="flex-1 px-4 py-2 bg-[#FFF5F3] text-[#ff3131] rounded-full font-semibold hover:bg-[#FFE5E0] transition-all text-center"
                    >
                      Trang cá nhân
                    </Link>
                    <Link
                      to={`/chat?userId=${friend.id}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all flex items-center justify-center"
                    >
                      <MessageCircle size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Travel Groups Tab */}
      {activeTab === "groups" && (
        <div>
          {/* Create Group Button */}
          <div className="mb-6">
            <button
              onClick={handleCreateGroup}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-md transition-all"
            >
              <UserPlus size={20} />
              Tạo nhóm mới
            </button>
          </div>

          {/* Groups Grid */}
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
              Chưa có nhóm du lịch nào. Hãy nhấp vào "Tạo nhóm mới" để tạo nhóm đầu tiên của bạn!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGroups.map((group) => {
                const isJoined = joinedGroupIds.includes(group.id);
                return (
                  <div
                    key={group.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* Group Cover */}
                    <div className="relative h-40">
                      <ImageWithFallback
                        src={group.coverImage}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {group.isPrivate ? (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                          <Lock size={14} className="text-white" />
                          <span className="text-xs text-white font-medium">Riêng tư</span>
                        </div>
                      ) : (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 backdrop-blur-sm rounded-full flex items-center gap-1.5">
                          <Globe size={14} className="text-white" />
                          <span className="text-xs text-white font-medium">Công khai</span>
                        </div>
                      )}
                    </div>

                    {/* Group Info */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{group.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 ml-2">
                          <Settings size={20} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users size={16} />
                          <span>{group.members.toLocaleString()} thành viên</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={16} />
                          <span>{group.posts.toLocaleString()} bài viết</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleToggleGroup(group.id, group.name)}
                        className={`w-full px-4 py-2.5 rounded-full font-semibold transition-all ${isJoined
                            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            : "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-md"
                          }`}
                      >
                        {isJoined ? "Rời nhóm" : "Tham gia nhóm"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
