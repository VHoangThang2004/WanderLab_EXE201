import { JournalPostCard } from "../../components/wander/JournalPostCard";
import { useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import {
  Search, SlidersHorizontal, MapPin, DollarSign, Clock, Shield,
  Map, X, ChevronDown, ChevronUp, Check, RotateCcw,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { VIETNAMESE_DESTINATIONS, TRAVEL_STYLES, ALL_INTERESTS, DURATION_OPTIONS } from "../../data/destinations";

const PRICE_MIN = 5;   // triệu VNĐ
const PRICE_MAX = 50;

export function WanderExplore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Filter states
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [selectedDuration, setSelectedDuration] = useState("Tất cả");

  // Track which section is expanded
  const [expandedSections, setExpandedSections] = useState({
    style: true,
    interest: true,
    price: true,
    duration: true,
  });

  const priceTrackRef = useRef<HTMLDivElement>(null);

  const toggleSection = (key: keyof typeof expandedSections) =>
    setExpandedSections((s) => ({ ...s, [key]: !s[key] }));

  const toggleStyle = (style: string) => {
    if (style === "Tất cả") { setSelectedStyles([]); return; }
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const resetFilters = () => {
    setSelectedStyles([]);
    setSelectedInterests([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setSelectedDuration("Tất cả");
  };

  const activeFilterCount =
    selectedStyles.length +
    selectedInterests.length +
    (selectedDuration !== "Tất cả" ? 1 : 0) +
    (priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX ? 1 : 0);

  // Dual-thumb price slider logic
  const handlePriceMouseDown = useCallback(
    (thumb: "min" | "max") => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const track = priceTrackRef.current;
      if (!track) return;

      const move = (clientX: number) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const val = Math.round(PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN));
        setPriceRange((prev) => {
          if (thumb === "min") return [Math.min(val, prev[1] - 1), prev[1]];
          return [prev[0], Math.max(val, prev[0] + 1)];
        });
      };

      const onMouseMove = (ev: MouseEvent) => move(ev.clientX);
      const onTouchMove = (ev: TouchEvent) => move(ev.touches[0].clientX);
      const cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", cleanup);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", cleanup);
      };
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", cleanup);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", cleanup);

      if ("clientX" in e) move(e.clientX);
    },
    []
  );

  const minPct = ((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const durOpt = DURATION_OPTIONS.find((d) => d.label === selectedDuration)!;

  const filteredDiaries = VIETNAMESE_DESTINATIONS.filter((d) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (selectedStyles.length && !selectedStyles.includes(d.style)) return false;
    if (selectedInterests.length && !selectedInterests.some((i) => d.interests.includes(i))) return false;
    if (d.budgetNum < priceRange[0] || d.budgetNum > priceRange[1]) return false;
    if (selectedDuration !== "Tất cả" && (d.durationDays < durOpt.min || d.durationDays > durOpt.max)) return false;
    return true;
  });

  // After imports, update the explore data to use journal style
  const exploreJournals = VIETNAMESE_DESTINATIONS.map((dest) => ({
    id: dest.id || dest.name,
    author: {
      name: dest.bestMonth ? "Nguyễn Thị Mai" : "Trần Văn Minh",
      avatar: dest.bestMonth 
        ? "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    },
    image: dest.image,
    location: dest.name,
    date: dest.bestMonth || "Tháng 6, 2026",
    caption: dest.highlight || `Khám phá vẻ đẹp tuyệt vời của ${dest.name}. Một trải nghiệm du lịch khó quên với cảnh đẹp thiên nhiên và văn hóa địa phương độc đáo.`,
    likes: Math.floor(Math.random() * 500) + 100,
    comments: Math.floor(Math.random() * 80) + 10,
    isLiked: false,
    isSaved: false,
    groupSize: `${Math.floor(Math.random() * 4) + 1} người`,
    budget: dest.budget,
    duration: dest.duration,
    trustScore: Math.floor(Math.random() * 10) + 90,
  }));

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search */}
      <section className="bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
              Khám Phá Nhật Ký Du Lịch
            </h1>
            <p className="text-xl text-gray-600">
              Khám phá trải nghiệm thực tế từ du khách Việt Nam đã được xác minh
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-2 flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-gray-400 flex-shrink-0" size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm điểm đến, tỉnh thành hoặc trải nghiệm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-gray-900"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative px-5 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-lg"
                    : "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg"
                }`}
              >
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">Bộ Lọc</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-[#ff3131] rounded-full text-xs font-bold flex items-center justify-center shadow">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="mb-8 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF5F3] to-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-[#ff3131]" size={20} />
                <span className="font-bold text-gray-900">Bộ Lọc Nâng Cao</span>
                {activeFilterCount > 0 && (
                  <span className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {activeFilterCount} đang dùng
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 text-sm text-[#ff3131] font-semibold hover:underline"
                  >
                    <RotateCcw size={14} />
                    Xóa tất cả
                  </button>
                )}
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">

              {/* ── 1. Sở Thích ── */}
              <div className="p-5">
                <button
                  className="w-full flex items-center justify-between mb-3"
                  onClick={() => toggleSection("interest")}
                >
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-lg flex items-center justify-center text-white text-xs">✦</span>
                    Sở Thích
                    {selectedInterests.length > 0 && (
                      <span className="text-xs bg-[#FFE8E0] text-[#ff3131] font-bold px-2 py-0.5 rounded-full">
                        {selectedInterests.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.interest ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedSections.interest && (
                  <div className="flex flex-wrap gap-2">
                    {ALL_INTERESTS.map((interest) => {
                      const active = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                            active
                              ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent shadow-sm"
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#ff914d] hover:text-[#ff3131]"
                          }`}
                        >
                          {active && <Check size={12} />}
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── 2. Kiểu Du Lịch ── */}
              <div className="p-5">
                <button
                  className="w-full flex items-center justify-between mb-3"
                  onClick={() => toggleSection("style")}
                >
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-lg flex items-center justify-center text-white text-xs">🗺</span>
                    Kiểu Du Lịch
                    {selectedStyles.length > 0 && (
                      <span className="text-xs bg-[#FFE8E0] text-[#ff3131] font-bold px-2 py-0.5 rounded-full">
                        {selectedStyles.length}
                      </span>
                    )}
                  </span>
                  {expandedSections.style ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedSections.style && (
                  <div className="space-y-2">
                    {TRAVEL_STYLES.filter((s) => s !== "Tất cả").map((style) => {
                      const active = selectedStyles.includes(style);
                      return (
                        <button
                          key={style}
                          onClick={() => toggleStyle(style)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                            active
                              ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent shadow-sm"
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#ff914d] hover:bg-[#FFF5F3]"
                          }`}
                        >
                          <span>{style}</span>
                          {active && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── 3. Giá Tiền ── */}
              <div className="p-5">
                <button
                  className="w-full flex items-center justify-between mb-3"
                  onClick={() => toggleSection("price")}
                >
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-lg flex items-center justify-center text-white text-xs">₫</span>
                    Ngân Sách
                    {(priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
                      <span className="text-xs bg-[#FFE8E0] text-[#ff3131] font-bold px-2 py-0.5 rounded-full">1</span>
                    )}
                  </span>
                  {expandedSections.price ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedSections.price && (
                  <div className="space-y-5">
                    {/* Display values */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-0.5">Từ</p>
                        <p className="font-bold text-[#ff3131] text-sm">{priceRange[0]}tr ₫</p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-[#ff3131] to-[#ff914d] mx-3 opacity-30" />
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-0.5">Đến</p>
                        <p className="font-bold text-[#ff914d] text-sm">
                          {priceRange[1] === PRICE_MAX ? `${priceRange[1]}tr+ ₫` : `${priceRange[1]}tr ₫`}
                        </p>
                      </div>
                    </div>

                    {/* Dual-thumb slider track */}
                    <div className="pt-2 pb-4 px-2">
                      <div
                        ref={priceTrackRef}
                        className="relative h-2 bg-gray-200 rounded-full select-none"
                      >
                        {/* Filled range */}
                        <div
                          className="absolute h-full rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d]"
                          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                        />

                        {/* Min thumb */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#ff3131] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                          style={{ left: `${minPct}%` }}
                          onMouseDown={handlePriceMouseDown("min")}
                          onTouchStart={handlePriceMouseDown("min")}
                        />

                        {/* Max thumb */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-[#ff914d] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10"
                          style={{ left: `${maxPct}%` }}
                          onMouseDown={handlePriceMouseDown("max")}
                          onTouchStart={handlePriceMouseDown("max")}
                        />
                      </div>

                      {/* Scale labels */}
                      <div className="flex justify-between mt-3 text-xs text-gray-400">
                        <span>{PRICE_MIN}tr</span>
                        <span>{Math.round((PRICE_MIN + PRICE_MAX) / 2)}tr</span>
                        <span>{PRICE_MAX}tr+</span>
                      </div>
                    </div>

                    {/* Quick preset buttons */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Dưới 15tr", range: [PRICE_MIN, 15] as [number, number] },
                        { label: "15–25tr",   range: [15, 25]       as [number, number] },
                        { label: "Trên 25tr", range: [25, PRICE_MAX] as [number, number] },
                      ].map(({ label, range }) => {
                        const active = priceRange[0] === range[0] && priceRange[1] === range[1];
                        return (
                          <button
                            key={label}
                            onClick={() => setPriceRange(active ? [PRICE_MIN, PRICE_MAX] : range)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              active
                                ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent"
                                : "border-gray-200 text-gray-600 hover:border-[#ff914d] hover:text-[#ff3131]"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ── 4. Thời Gian ── */}
              <div className="p-5">
                <button
                  className="w-full flex items-center justify-between mb-3"
                  onClick={() => toggleSection("duration")}
                >
                  <span className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-lg flex items-center justify-center text-white text-xs">⏱</span>
                    Thời Gian
                    {selectedDuration !== "Tất cả" && (
                      <span className="text-xs bg-[#FFE8E0] text-[#ff3131] font-bold px-2 py-0.5 rounded-full">1</span>
                    )}
                  </span>
                  {expandedSections.duration ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </button>

                {expandedSections.duration && (
                  <div className="space-y-2">
                    {DURATION_OPTIONS.map(({ label }) => {
                      const active = selectedDuration === label;
                      return (
                        <button
                          key={label}
                          onClick={() => setSelectedDuration(label)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                            active
                              ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent shadow-sm"
                              : "bg-white text-gray-700 border-gray-200 hover:border-[#ff914d] hover:bg-[#FFF5F3]"
                          }`}
                        >
                          <span>{label}</span>
                          {active && <Check size={14} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Active filter tags */}
            {activeFilterCount > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-[#FFF5F3] flex flex-wrap gap-2 items-center">
                <span className="text-xs text-gray-500 font-medium">Đang lọc:</span>
                {selectedStyles.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 bg-white border border-[#ff3131] text-[#ff3131] text-xs font-semibold px-3 py-1 rounded-full">
                    {s}
                    <button onClick={() => toggleStyle(s)}><X size={11} /></button>
                  </span>
                ))}
                {selectedInterests.map((i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white border border-[#ff914d] text-[#ff914d] text-xs font-semibold px-3 py-1 rounded-full">
                    {i}
                    <button onClick={() => toggleInterest(i)}><X size={11} /></button>
                  </span>
                ))}
                {selectedDuration !== "Tất cả" && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ⏱ {selectedDuration}
                    <button onClick={() => setSelectedDuration("Tất cả")}><X size={11} /></button>
                  </span>
                )}
                {(priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX) && (
                  <span className="inline-flex items-center gap-1 bg-white border border-gray-300 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                    ₫ {priceRange[0]}tr – {priceRange[1]}tr
                    <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Style quick pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStyles([])}
              className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
                selectedStyles.length === 0
                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-md"
                  : "bg-[#FFF5F3] text-gray-700 hover:bg-[#FFE8E0]"
              }`}
            >
              Tất cả
            </button>
            {TRAVEL_STYLES.filter((s) => s !== "Tất cả").map((style) => (
              <button
                key={style}
                onClick={() => toggleStyle(style)}
                className={`px-5 py-2 rounded-full font-medium transition-all text-sm ${
                  selectedStyles.includes(style)
                    ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-md"
                    : "bg-[#FFF5F3] text-gray-700 hover:bg-[#FFE8E0]"
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white" : "bg-[#FFF5F3] text-gray-700"
              }`}
              title="Dạng lưới"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "map" ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white" : "bg-[#FFF5F3] text-gray-700"
              }`}
              title="Dạng bản đồ"
            >
              <Map size={20} />
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 flex items-center gap-3">
          <p className="text-gray-600">
            Hiển thị <span className="font-semibold text-[#ff3131]">{filteredDiaries.length}</span> nhật ký
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-[#ff3131] flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={13} /> Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Map view */}
        {viewMode === "map" && (
          <div className="bg-[#FFF5F3] rounded-2xl p-12 mb-8 text-center">
            <Map className="mx-auto mb-4 text-[#ff3131]" size={48} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chế Độ Bản Đồ</h3>
            <p className="text-gray-600">Bản đồ tương tác sẽ ra mắt sớm! Chuyển sang chế độ lưới để xem nhật ký.</p>
          </div>
        )}

        {/* Diary grid */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiaries.map((diary) => (
              <Link
                key={diary.id}
                to={`/diary/${diary.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all group"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback
                    src={diary.image}
                    alt={diary.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-[#ff3131]">{diary.style}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Shield className="text-[#ff3131]" size={14} />
                    <span className="text-sm font-semibold text-[#ff3131]">{diary.trustScore}%</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{diary.title}</h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin size={16} className="flex-shrink-0" />
                    <span className="line-clamp-1">{diary.location}</span>
                  </p>

                  {/* Interest tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {diary.interests.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          selectedInterests.includes(tag)
                            ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white"
                            : "bg-[#FFF5F3] text-[#ff3131]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm">
                      <span className="font-semibold text-[#ff3131]">{diary.budget}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-900">{diary.duration}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">bởi {diary.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {filteredDiaries.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-[#FFF5F3] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-[#ff914d]" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy nhật ký</h3>
            <p className="text-gray-600 mb-6">Thử điều chỉnh tìm kiếm hoặc bộ lọc của bạn</p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Xóa Tất Cả Bộ Lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}