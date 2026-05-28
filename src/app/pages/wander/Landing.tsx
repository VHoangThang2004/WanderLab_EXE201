import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { UserCard } from "../../components/wander/UserCard";
import { Link } from "react-router";
import { Sparkles, TrendingUp, Compass } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// Travel memory posts from friends - social feed style
const travelFeed = [
  {
    id: "1",
    author: {
      name: "Nguyễn Thị Mai",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Vịnh Hạ Long, Quảng Ninh",
    date: "20 tháng 6, 2026",
    caption: "5 ngày trên vịnh Hạ Long thật không thể quên! Sáng sớm nhìn mặt trời mọc từ boong tàu, không khí trong lành và cảnh đẹp như tranh vẽ. Chèo kayak qua những hang động nhỏ, tắm biển ở đảo Ti Tốp, và ngắm hoàng hôn lãng mạn. Đây thực sự là thiên đường trên mặt đất! 🌅⛵",
    likes: 324,
    comments: 47,
    isLiked: false,
    isSaved: false,
    groupSize: "2 người",
  },
  {
    id: "2",
    author: {
      name: "Trần Thị H��ơng",
      avatar: "https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Đảo Phú Quốc, Kiên Giang",
    date: "5 tháng 7, 2026",
    caption: "Phú Quốc quả không hổ danh là đảo ngọc! Nước biển trong xanh như pha lê, cát trắng mịn màng. Đi cáp treo Hòn Thơm dài nhất thế giới, lặn ngắm san hô tuyệt đẹp, và ăn ghẹ Hàm Ninh nướng đến tận khuya. Mỗi khoảnh khắc đều đáng nhớ! 🏝️🐚",
    likes: 256,
    comments: 38,
    isLiked: true,
    isSaved: true,
    groupSize: "2 người",
  },
  {
    id: "3",
    author: {
      name: "Lê Văn Tuấn",
      avatar: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Sa Pa, Lào Cai",
    date: "18 tháng 9, 2026",
    caption: "Tháng 9 đến Sa Pa chính là thời điểm vàng! Ruộng bậc thang chuyển màu vàng óng tuyệt đẹp như tranh. Trek qua các bản làng H'Mông, gặp những nụ cưi thật thà và chân thành. Chinh phục Fansipan 3143m - cảm giác đứng trên nóc nhà Đông Dương thật tuyệt vời! 🌾⛰️",
    likes: 412,
    comments: 62,
    isLiked: false,
    isSaved: false,
    groupSize: "3 người",
  },
  {
    id: "4",
    author: {
      name: "Trần Phương Linh",
      avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Hội An, Quảng Nam",
    date: "14 tháng 4, 2026",
    caption: "Đêm rằm Hội An lung linh huyền ảo với hàng ngàn chiếc đèn lồng! Dạo phố cổ, học làm cao lầu và mì Quảng, thả hoa đăng trên sông Hoài. Cảm giác như lạc vào thế giới cổ tích. Hội An về đêm đẹp đến nao lòng! 🏮✨",
    likes: 389,
    comments: 51,
    isLiked: true,
    isSaved: false,
    groupSize: "2 người",
  },
  {
    id: "5",
    author: {
      name: "Phạm Minh Anh",
      avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Đà Nẵng",
    date: "10 tháng 3, 2026",
    caption: "Đà Nẵng - thành phố đáng sống nhất Việt Nam! Cầu Rồng phun lửa cuối tuần, chill trên bãi Mỹ Khê tuyệt đẹp, leo Bà Nà Hills ngắm Cầu Vàng nổi tiếng. Ăn hải sản tươi rói và uống cà phê ngắm biển. Perfect weekend getaway! 🌊🍤",
    likes: 298,
    comments: 43,
    isLiked: false,
    isSaved: true,
    groupSize: "4 người",
  },
  {
    id: "6",
    author: {
      name: "Võ Thị Lan",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: "https://images.unsplash.com/photo-1727860628226-2d545134f8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    location: "Hà Nội",
    date: "25 tháng 2, 2026",
    caption: "7 ngày khám phá thủ đô ngàn năm văn hiến. Phố cổ Hà Nội với bún chả, phở, cà phê trứng đỉnh của chóp. Hồ Hoàn Kiếm yên bình buổi sáng, Văn Miếu Quốc Tử Giám cổ kính. Mỗi góc phố đều có câu chuyện riêng! 🏛️☕",
    likes: 267,
    comments: 35,
    isLiked: false,
    isSaved: false,
    groupSize: "1 người",
  },
];

// Suggested travelers to follow
const suggestedTravelers = [
  {
    name: "Nguyn Thị Mai",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Hà Nội",
    diariesCount: 15,
    followersCount: 3200,
    isFollowing: false,
  },
  {
    name: "Lê Văn Tuấn",
    avatar: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "TP. Hồ Chí Minh",
    diariesCount: 22,
    followersCount: 5100,
    isFollowing: false,
  },
  {
    name: "Trần Phương Linh",
    avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    location: "Đà Nẵng",
    diariesCount: 18,
    followersCount: 4200,
    isFollowing: true,
  },
];

// Trending destinations
const trendingDestinations = [
  { name: "Vịnh Hạ Long", count: "1,234 nhật ký" },
  { name: "Phú Quốc", count: "987 nhật ký" },
  { name: "Sa Pa", count: "856 nhật ký" },
  { name: "Hội An", count: "723 nhật ký" },
  { name: "Đà Lạt", count: "654 nhật ký" },
];

export function WanderLanding() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stories/Reels Section - Facebook Style */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
          {/* Create Story */}
          <Link
            to="/create"
            className="flex-shrink-0 group"
          >
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 hover:shadow-lg transition-all cursor-pointer">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center mb-2">
                  <Sparkles className="text-white" size={24} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                <p className="text-xs font-semibold text-gray-900">Tạo tin</p>
              </div>
            </div>
          </Link>

          {/* Story 1: Phan Văn Minh */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Vịnh Hạ Long"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Phan Văn Minh"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Phan Văn Minh</p>
              </div>
            </div>
          </div>

          {/* Story 2: Hương Trần */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Phú Quốc"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Hương Trần"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Hương Trần</p>
              </div>
            </div>
          </div>

          {/* Story 3: Nam Nguyễn */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Sa Pa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Nam Nguyễn"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Nam Nguyễn</p>
              </div>
            </div>
          </div>

          {/* Story 4: Linh Phạm */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Hội An"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Linh Phạm"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Linh Phạm</p>
              </div>
            </div>
          </div>

          {/* Story 5: Tuấn Lê */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Đà Lạt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-blue-500 p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Tuấn Lê"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Tuấn Lê</p>
              </div>
            </div>
          </div>

          {/* Story 6: Mai Vũ */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative w-28 h-48 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                  alt="Nha Trang"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
              </div>
              <div className="absolute top-2 left-2">
                <div className="w-10 h-10 rounded-full border-3 border-blue-500 p-0.5 bg-white">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Mai Vũ"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-xs font-semibold text-white drop-shadow-lg">Mai Vũ</p>
              </div>
            </div>
          </div>
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
              <h2 className="text-2xl font-bold text-gray-900">Nhật Ký Du Lịch</h2>
              <p className="text-gray-600">Khám phá trải nghiệm thật từ cộng đồng</p>
            </div>
          </div>

          {/* Journal Posts Feed */}
          <div className="space-y-6">
            {travelFeed.map((post) => (
              <JournalPostCard key={post.id} {...post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <Link
              to="/friends"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#ff3131] border-2 border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all"
            >
              Kết Nối Với Bạn Bè
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Destinations */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-[#ff3131]" size={20} />
              <h3 className="font-bold text-gray-900">Điểm Đn Nổi Bật</h3>
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
                        {dest.name}
                      </p>
                      <p className="text-xs text-gray-500">{dest.count}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Suggested Travelers */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Du Khách Nổi Bật</h3>
            <div className="space-y-3">
              {suggestedTravelers.map((traveler) => (
                <UserCard key={traveler.name} {...traveler} />
              ))}
            </div>
            <Link
              to="/friends"
              className="block text-center text-sm text-[#ff3131] font-semibold mt-4 hover:text-[#ff914d] transition-colors"
            >
              Xem thêm du khách →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}