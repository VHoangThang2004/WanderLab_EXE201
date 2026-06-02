import { WanderNav } from "../../components/wander/WanderNav";
import { WanderFooter } from "../../components/wander/WanderFooter";
import { Lightbox } from "../../components/wander/Lightbox";
import { CommentsSection } from "../../components/wander/CommentsSection";
import { Link, useParams, useNavigate } from "react-router";
import { useState, useCallback } from "react";
import {
  MapPin,
  Calendar,
  Wallet,
  Users,
  Shield,
  Bookmark,
  Share2,
  Copy,
  Star,
  Heart,
  MessageCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Camera,
  Quote,
  Expand,
  ThumbsUp,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { DIARY_DATA } from "../../data/diaries";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diaryService } from "@/api/diaryService";
import { interactionService } from "@/api/interactionService";
import { useAuthStore, useLanguageStore } from "@/stores";

export function WanderDiaryDetail() {
  const { id } = useParams();
  const { t, language } = useLanguageStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"timeline" | "budget" | "tips">("timeline");
  const [heroIndex, setHeroIndex] = useState(0);

  // Fetch from API
  const { data: diary, isLoading } = useQuery({
    queryKey: ['diary', id],
    queryFn: () => diaryService.fetchDiaryById(id!),
    enabled: !!id
  });

  const { data: interactionState } = useQuery({
    queryKey: ['diaryInteraction', id, user?.id],
    queryFn: async () => {
      if (!isAuthenticated || !user) return { reaction: null, isSaved: false };
      const [reaction, isSaved] = await Promise.all([
        interactionService.getUserReaction(id!, user.id),
        interactionService.checkUserBookmarked(id!, user.id)
      ]);
      return { reaction, isSaved };
    },
    enabled: !!id && isAuthenticated
  });

  const reaction = interactionState?.reaction || null;
  const isLiked = !!reaction;

  const likeMutation = useMutation({
    mutationFn: (type: string = 'like') => {
      if (!isAuthenticated || !user) {
        throw new Error(language === 'vi' ? "Vui lòng đăng nhập để thích" : "Please log in to like");
      }
      return interactionService.setReactionDiary(id!, user.id, type, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryInteraction', id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['diary', id] }); // Refresh like count
    },
    onError: (err: any) => alert(err.message)
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => {
      if (!isAuthenticated || !user) {
        throw new Error(language === 'vi' ? "Vui lòng đăng nhập để lưu" : "Please log in to save");
      }
      return interactionService.toggleBookmarkDiary(id!, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaryInteraction', id, user?.id] });
    },
    onError: (err: any) => alert(err.message)
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ url: string; caption?: string; reviewer?: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxPrev = useCallback(() =>
    setLightboxIndex((i) => (i === 0 ? lightboxImages.length - 1 : i - 1)),
    [lightboxImages.length]
  );
  const lightboxNext = useCallback(() =>
    setLightboxIndex((i) => (i === lightboxImages.length - 1 ? 0 : i + 1)),
    [lightboxImages.length]
  );

  if (isLoading || !diary) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#030213] flex flex-col">
        <WanderNav />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t("loading")}</p>
        </div>
        <WanderFooter />
      </div>
    );
  }

  const heroImages = [diary.image, ...(diary.gallery || [])];

  const activeTabClass = "text-[#ff3131] border-b-2 border-[#ff3131]";
  const inactiveTabClass = "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300";

  // Hero slideshow
  const prevHero = () => setHeroIndex((i) => (i === 0 ? heroImages.length - 1 : i - 1));
  const nextHero = () => setHeroIndex((i) => (i === heroImages.length - 1 ? 0 : i + 1));

  // Open lightbox helpers
  const openHeroLightbox = (index: number) => {
    setLightboxImages(heroImages.map((url) => ({ url })));
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const openReviewLightbox = (index: number) => {
    setLightboxImages(
      diary.reviewPhotos.map((p) => ({ url: p.url, caption: p.caption, reviewer: p.reviewer }))
    );
    setLightboxIndex(index);
    setLightboxOpen(true);
  };


  return (
    <div className="min-h-screen bg-white dark:bg-[#030213]">
      <WanderNav />

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}

      {/* ── Hero Slideshow ── */}
      <section className="relative h-[65vh] min-h-[440px] overflow-hidden">
        {/* Images — key forces re-mount so src always updates */}
        {heroImages.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${i === heroIndex ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img
              src={src}
              alt={`${diary.title} - ảnh ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

        {/* Expand / fullscreen button */}
        <button
          onClick={() => openHeroLightbox(heroIndex)}
          className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-all backdrop-blur-sm z-10"
          title="Xem toàn màn hình"
        >
          <Expand size={20} />
        </button>

        {/* Prev / Next */}
        <button
          onClick={prevHero}
          className="absolute left-4 top-1/3 sm:top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all backdrop-blur-sm z-10"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-4 top-1/3 sm:top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2.5 transition-all backdrop-blur-sm z-10"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`h-2 rounded-full transition-all ${i === heroIndex ? "w-6 bg-white dark:bg-[#030213]" : "w-2 bg-white dark:bg-[#030213]/50"}`}
            />
          ))}
        </div>

        {/* Thumbnail strip */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:flex gap-2 z-10">
          {heroImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-14 h-9 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === heroIndex ? "border-white opacity-100" : "border-white/30 opacity-50 hover:opacity-80"
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Hero Text */}
        <div className="absolute bottom-0 left-0 right-0 text-white z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-14">
            <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <Link to="/" className="hover:text-white transition-colors">{t("home")}</Link>
              <span>/</span>
              <Link to="/explore" className="hover:text-white transition-colors">{t("explore")}</Link>
              <span>/</span>
              <span className="text-white">{diary.location}</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white dark:bg-[#030213]/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Shield className="text-white" size={16} />
                <span className="font-semibold text-sm">{t("trustScore", "diaryDetail")} {diary.trustScore}%</span>
              </div>
              <div className="bg-white dark:bg-[#030213]/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <TrendingUp className="text-white" size={16} />
                <span className="font-semibold text-sm">{t("verified", "diaryDetail")}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{diary.title}</h1>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base">
              <span className="flex items-center gap-1.5"><MapPin size={16} />{diary.location}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><Calendar size={16} />{diary.dates}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><Wallet size={16} />{diary.totalBudget}</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><Clock size={16} />{diary.duration}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Review Photo Section ── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-xl flex items-center justify-center flex-shrink-0">
              <Camera className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t("travelerPhotos", "diaryDetail")}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{diary.reviewPhotos.length} {t("photosDesc", "diaryDetail")}</p>
            </div>
          </div>

          {/* Desktop: featured + 2 side */}
          <div className="hidden md:grid grid-cols-3 gap-4">
            {/* Large featured */}
            <div
              className="col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer h-[420px]"
              onClick={() => openReviewLightbox(0)}
            >
              <img
                src={diary.reviewPhotos[0].url}
                alt={diary.reviewPhotos[0].caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {/* Expand icon */}
              <div className="absolute top-3 right-3 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <Expand size={16} />
              </div>
              {/* Reviewer badge */}
              <div className="absolute top-4 left-4 bg-white dark:bg-[#030213]/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1.5">
                <img src={diary.reviewPhotos[0].avatar} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{diary.reviewPhotos[0].reviewer}</span>
                <div className="flex gap-0.5 ml-1">
                  {Array.from({ length: diary.reviewPhotos[0].rating }).map((_, i) => (
                    <Star key={i} size={10} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-start gap-2">
                  <Quote size={16} className="text-white/60 flex-shrink-0 mt-0.5" />
                  <p className="text-white text-sm leading-relaxed">{diary.reviewPhotos[0].caption}</p>
                </div>
                <p className="text-white/60 text-xs mt-2">{diary.reviewPhotos[0].date}</p>
              </div>
            </div>

            {/* Right: 2 stacked */}
            <div className="flex flex-col gap-4">
              {diary.reviewPhotos.slice(1).map((photo, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer flex-1"
                  style={{ minHeight: "196px" }}
                  onClick={() => openReviewLightbox(idx + 1)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Expand size={14} />
                  </div>
                  <div className="absolute top-3 left-3 bg-white dark:bg-[#030213]/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                    <img src={photo.avatar} alt="" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{photo.reviewer}</span>
                    <div className="flex gap-0.5 ml-0.5">
                      {Array.from({ length: photo.rating }).map((_, i) => (
                        <Star key={i} size={9} className="text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-xs leading-snug line-clamp-2">{photo.caption}</p>
                    <p className="text-white/55 text-xs mt-1">{photo.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {diary.reviewPhotos.map((photo, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl overflow-hidden flex-shrink-0 snap-start cursor-pointer"
                style={{ width: "85vw", height: "280px" }}
                onClick={() => openReviewLightbox(idx)}
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white dark:bg-[#030213]/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
                  <img src={photo.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{photo.reviewer}</span>
                  <div className="flex gap-0.5 ml-0.5">
                    {Array.from({ length: photo.rating }).map((_, i) => (
                      <Star key={i} size={9} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm leading-snug">{photo.caption}</p>
                  <p className="text-white/60 text-xs mt-1">{photo.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <button
                  onClick={() => likeMutation.mutate(reaction || 'like')}
                  disabled={likeMutation.isPending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                    isLiked
                      ? "bg-[#FFE8E0] dark:bg-gray-800 text-[#ff3131]"
                      : "bg-[#FFF5F3] dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[#FFE8E0] dark:bg-gray-800"
                  }`}
                >
                  {reaction === 'love' ? '❤️' : reaction === 'haha' ? '😆' : reaction === 'wow' ? '😮' : reaction === 'sad' ? '😢' : reaction === 'angry' ? '😡' : <ThumbsUp size={20} className={isLiked ? "text-[#ff3131] fill-[#ff3131]" : ""} />}
                  {diary.likesCount || 0}
                </button>
                {/* Emoji picker on hover */}
                <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-white dark:bg-gray-800 shadow-xl rounded-full px-3 py-2 gap-2 border border-gray-100 dark:border-gray-700 z-20">
                  {['like', 'love', 'haha', 'wow', 'sad', 'angry'].map(type => (
                    <button key={type} onClick={() => likeMutation.mutate(type)} className="text-xl hover:scale-125 transition-transform" title={type}>
                      {type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'haha' ? '😆' : type === 'wow' ? '😮' : type === 'sad' ? '😢' : '😡'}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => bookmarkMutation.mutate()}
                disabled={bookmarkMutation.isPending}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  isSaved
                    ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-lg"
                    : "bg-[#FFF5F3] dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[#FFE8E0] dark:bg-gray-800"
                }`}
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                {isSaved ? t("savedToPlan", "diaryDetail") : t("saveToPlan", "diaryDetail")}
              </button>
              <Link
                to="/create"
                className="flex items-center gap-2 px-6 py-3 bg-[#FFE8E0] dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-[#FFD5C8] transition-all"
              >
                <Copy size={20} />
                {t("copyItinerary", "diaryDetail")}
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#FFF5F3] dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-[#FFE8E0] dark:bg-gray-800 transition-all">
                <Share2 size={20} />
                {t("share", "diaryDetail")}
              </button>
              
              {/* Author Actions (Edit/Delete) */}
              {user?.id === diary.author.id && (
                <div className="flex items-center gap-2 ml-auto">
                  <button onClick={() => navigate(`/edit/${id}`)} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Sửa
                  </button>
                  <button onClick={async () => {
                    if (confirm('Bạn có chắc chắn muốn xóa nhật ký này?')) {
                      await diaryService.deleteDiary(id!);
                      window.location.href = '/explore';
                    }
                  }} className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                    Xóa
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-[#FFF5F3] dark:bg-gray-900 rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("aboutTrip", "diaryDetail")}</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{diary.description}</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex gap-1 sm:gap-4 overflow-x-auto">
                {(["timeline", "budget", "tips"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-semibold transition-all whitespace-nowrap ${activeTab === tab ? activeTabClass : inactiveTabClass}`}
                  >
                    {tab === "timeline" ? t("dailyItinerary", "diaryDetail") : tab === "budget" ? t("budgetDetail", "diaryDetail") : t("tipsExperience", "diaryDetail")}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            {activeTab === "timeline" && (
              <div className="space-y-6">
                {diary.timeline.map((day) => (
                  <div key={day.day} className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="inline-block bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white px-4 py-1 rounded-full font-semibold mb-2 text-sm">
                          {language === 'vi' ? 'Ngày' : 'Day'} {day.day}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{day.title}</h3>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">{language === 'vi' ? 'Ngân Sách' : 'Budget'}</p>
                        <p className="text-lg font-bold text-[#ff3131]">{day.budget}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                          <span className="text-[#ff3131] mt-1 flex-shrink-0">•</span>
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Budget */}
            {activeTab === "budget" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    {language === 'vi' ? 'Tổng Chi Phí:' : 'Total Cost:'} <span className="text-[#ff3131]">{diary.totalBudget}</span>
                  </h3>
                  <div className="space-y-5">
                    {diary.budgetBreakdown.map((item) => (
                      <div key={item.category}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{item.category}</span>
                          <span className="font-bold text-[#ff3131]">{item.amount}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] h-full rounded-full transition-all duration-700"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.percentage}% {t("budgetPct", "diaryDetail")}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#FFF5F3] dark:bg-gray-900 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t("budgetNotes", "diaryDetail")}</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    {diary.budgetNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#ff3131] mt-1 flex-shrink-0">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tips */}
            {activeTab === "tips" && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("tipsExperience", "diaryDetail")}</h3>
                  <ul className="space-y-4">
                    {diary.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 pt-1">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-[#FFF5F3] dark:bg-gray-900 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-3">{t("interactiveMap", "diaryDetail")}</h4>
                  <div className="bg-white dark:bg-[#030213] rounded-xl p-12 text-center text-gray-500 dark:text-gray-400">
                    <MapPin className="mx-auto mb-3 text-[#ff914d]" size={40} />
                    <p className="font-medium">{t("mapComingSoon", "diaryDetail")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("communityReviews", "diaryDetail")}
                <span className="ml-3 text-base font-normal text-gray-500 dark:text-gray-400">({diary.reviews.length} {t("reviewsUnit", "diaryDetail")})</span>
              </h3>
              <div className="space-y-5">
                {diary.reviews.map((review, index) => (
                  <div key={index} className="pb-5 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{review.author}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">{review.date}</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">{review.text}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-[#ff3131] transition-colors">
                        <ThumbsUp size={15} /><span>{language === 'vi' ? 'Hữu Ích' : 'Helpful'}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-[#ff3131] transition-colors">
                        <MessageCircle size={15} /><span>{language === 'vi' ? 'Trả Lời' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1">
                {t("commentsTitle", "diaryDetail")}
                <span className="ml-3 text-base font-normal text-gray-500 dark:text-gray-400">({diary.commentsCount || 0} {t("commentsUnit", "diaryDetail")})</span>
              </h3>
              <CommentsSection diaryId={id!} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author */}
            <div className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <ImageWithFallback src={diary.author.avatar} alt={diary.author.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{diary.author.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("creator", "diaryDetail")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center bg-[#FFF5F3] dark:bg-gray-900 rounded-xl p-3">
                  <p className="font-bold text-[#ff3131] text-lg">{diary.author.diariesCount}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{t("myJournals", "common")}</p>
                </div>
                <div className="text-center bg-[#FFF5F3] dark:bg-gray-900 rounded-xl p-3">
                  <p className="font-bold text-[#ff3131] text-lg">{diary.author.followersCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{language === 'vi' ? 'Người Theo Dõi' : 'Followers'}</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                {t("follow", "diaryDetail")}
              </button>
            </div>

            {/* Quick Info */}
            <div className="bg-[#FFF5F3] dark:bg-gray-900 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t("tripInfo", "diaryDetail")}</h3>
              {[
                { icon: Calendar, label: language === 'vi' ? "Thời Gian" : "Duration", value: language === 'vi' ? diary.duration : diary.duration.replace("ngày", "days") },
                { icon: Wallet, label: language === 'vi' ? "Tổng Ngân Sách" : "Total Budget", value: diary.totalBudget },
                { icon: Users, label: language === 'vi' ? "Số Người" : "Group Size", value: language === 'vi' ? diary.groupSize : (diary.groupSize === 'Cặp đôi' ? 'Couple' : diary.groupSize === '1 mình' ? 'Solo' : diary.groupSize === 'Gia đình' ? 'Family' : diary.groupSize) },
                { icon: Shield, label: t("trustScore", "diaryDetail"), value: `${diary.trustScore}% ${t("verified", "diaryDetail")}` },
                { icon: MapPin, label: language === 'vi' ? "Điểm Đến" : "Destination", value: diary.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white dark:bg-[#030213] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="text-[#ff3131]" size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Related */}
            <div className="bg-white dark:bg-[#030213] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t("similarTrips", "diaryDetail")}</h3>
              <div className="space-y-4">
                {diary.related.map((rel) => (
                  <Link key={rel.id} to={`/diary/${rel.id}`} className="block group">
                    <div className="flex gap-3">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <ImageWithFallback src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm leading-snug group-hover:text-[#ff3131] transition-colors">{rel.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{language === 'vi' ? rel.duration : rel.duration.replace("ngày", "days")} • {rel.budget}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Shield className="text-[#ff3131]" size={12} />
                          <p className="text-xs text-[#ff3131] font-semibold">{rel.trustScore}% {language === 'vi' ? 'Tin Cậy' : 'Trust'}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link to="/explore" className="mt-4 w-full py-3 border-2 border-[#ff3131] text-[#ff3131] rounded-xl font-semibold hover:bg-[#FFF5F3] dark:bg-gray-900 transition-all text-center block text-sm">
                {t("viewAllDiaries", "diaryDetail")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WanderFooter />
    </div>
  );
}
