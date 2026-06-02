import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { UserCard } from "../../components/wander/UserCard";
import { Link } from "react-router";
import { Sparkles, TrendingUp, Compass, MapPin, Shield, BookOpen } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useAuthStore, useLanguageStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { diaryService } from "@/api/diaryService";

// Suggested travelers to follow
const suggestedTravelers = [
  {
    name: "Nguyễn Thị Mai",
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
  const { isAuthenticated } = useAuthStore();
  const { t, language } = useLanguageStore();

  const translateTrendingDestName = (name: string, lang: string) => {
    if (lang === 'vi') return name;
    const dict: Record<string, string> = {
      "Vịnh Hạ Long": "Ha Long Bay",
      "Phú Quốc": "Phu Quoc",
      "Sa Pa": "Sapa",
      "Hội An": "Hoi An",
      "Đà Lạt": "Da Lat",
    };
    return dict[name] || name;
  };

  const { data: feedDiaries, isLoading } = useQuery({
    queryKey: ['feedDiaries'],
    queryFn: diaryService.fetchFeedDiaries,
    enabled: isAuthenticated,
  });  // Guest landing — hero + CTA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#ff3131] via-[#ff5e3a] to-[#ff914d] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white dark:bg-[#030213] rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-white dark:bg-[#030213] rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  {t("heroTitle", "landing")}<br />
                  <span className="text-yellow-200">{t("heroHighlight", "landing")}</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  {t("heroSubtitle", "landing")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-white dark:bg-[#030213] text-[#ff3131] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    {t("startFree", "landing")}
                  </Link>
                  <Link
                    to="/explore"
                    className="px-8 py-4 border-2 border-white/50 text-white rounded-full font-semibold text-lg hover:bg-white/10 dark:hover:bg-[#030213]/10 transition-all"
                  >
                    {t("exploreBtn", "landing")}
                  </Link>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Hạ Long"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Hội An"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-64">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Sa Pa"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl h-48">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Phú Quốc"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-[#030213]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("whyWanderLab", "landing")}</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">{t("whySubtitle", "landing")}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] dark:bg-gray-800 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("feat1Title", "landing")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t("feat1Desc", "landing")}</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] dark:bg-gray-800 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("feat2Title", "landing")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t("feat2Desc", "landing")}</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-[#FFF5F3] dark:bg-gray-800 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("feat3Title", "landing")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t("feat3Desc", "landing")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] dark:from-gray-900 dark:to-[#030213]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t("readyToExplore", "landing")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">{t("readySubtitle", "landing")}</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Sparkles size={24} />
              {t("createAccountFree", "landing")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Authenticated user — social feed
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stories/Reels Section - Facebook Style */}
      <div className="bg-white dark:bg-[#030213] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
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
                <p className="text-xs font-semibold text-gray-900 dark:text-white">{t("createStory", "landing")}</p>
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
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white dark:bg-[#030213]">
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
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white dark:bg-[#030213]">
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
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white dark:bg-[#030213]">
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
                <div className="w-10 h-10 rounded-full border-3 border-[#ff3131] p-0.5 bg-white dark:bg-[#030213]">
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
                <div className="w-10 h-10 rounded-full border-3 border-blue-500 p-0.5 bg-white dark:bg-[#030213]">
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
                <div className="w-10 h-10 rounded-full border-3 border-blue-500 p-0.5 bg-white dark:bg-[#030213]">
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
            <div className="w-10 h-10 bg-white dark:bg-[#030213] rounded-xl flex items-center justify-center shadow-sm">
              <Compass className="text-[#ff3131]" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("feedTitle", "landing")}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t("feedSubtitle", "landing")}</p>
            </div>
          </div>

          {/* Journal Posts Feed */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">{t("loadingDiaries", "landing")}</div>
            ) : feedDiaries?.length === 0 ? (
              <div className="text-center py-10 text-gray-500">{t("noDiaries", "landing")}</div>
            ) : (
              feedDiaries?.map((post) => (
                <JournalPostCard key={post.id} {...post} />
              ))
            )}
          </div>

          {/* Load More */}
          <div className="text-center pt-4">
            <Link
              to="/friends"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#030213] text-[#ff3131] border-2 border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] dark:bg-gray-800 transition-all"
            >
              {t("loadMoreFriends", "landing")}
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Destinations */}
          <div className="bg-white dark:bg-[#030213] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-[#ff3131]" size={20} />
              <h3 className="font-bold text-gray-900 dark:text-white">{t("trendingDestinations", "landing")}</h3>
            </div>
            <div className="space-y-3">
              {trendingDestinations.map((dest, index) => (
                <Link
                  key={dest.name}
                  to={`/explore?destination=${encodeURIComponent(dest.name)}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF5F3] dark:bg-gray-800 transition-all group"
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
          <div className="bg-white dark:bg-[#030213] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t("suggestedTravelers", "landing")}</h3>
            <div className="space-y-3">
              {suggestedTravelers.map((traveler) => (
                <UserCard key={traveler.name} {...traveler} />
              ))}
            </div>
            <Link
              to="/friends"
              className="block text-center text-sm text-[#ff3131] font-semibold mt-4 hover:text-[#ff914d] transition-colors"
            >
              {t("seeMoreTravelers", "landing")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}