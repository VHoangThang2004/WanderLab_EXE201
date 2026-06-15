import { useState } from "react";
import { Link } from "react-router";
import {
  MapPin, Calendar, Wallet, Users, Sparkles, ChevronRight, ChevronLeft,
  Check, Clock, Utensils, Camera, Waves, Mountain, Building2, Heart,
  Download, Share2, RefreshCw, Star, ArrowRight, BookmarkCheck, Bookmark,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useSavedItineraries } from "../../hooks/useSavedItineraries";
import { useLanguageStore } from "@/stores";

const translateItineraryItem = (text: string, lang: string) => {
  if (lang === 'vi') return text;
  const dict: Record<string, string> = {
    "Bắc Đảo & Hoàng Hôn": "North Island & Sunset",
    "Sáng: Đến Phú Quốc, check-in resort": "Morning: Arrive in Phu Quoc, check-in resort",
    "Trưa: Ăn hải sản tươi tại chợ Dương Đông": "Noon: Fresh seafood at Duong Dong market",
    "Chiều: Tham quan dinh Cậu ngắm hoàng hôn": "Afternoon: Visit Dinh Cau for sunset view",
    "Tối: Chợ đêm Phú Quốc – thưởng thức đặc sản": "Evening: Phu Quoc Night Market – enjoy local specialties",
    "Lặn Biển & Cáp Treo": "Snorkeling & Cable Car",
    "Sáng sớm: Tour lặn biển 3 đảo": "Early morning: 3-island snorkeling tour",
    "Trưa: Ăn trưa tại nhà hàng nổi": "Noon: Lunch at floating restaurant",
    "Chiều: Cáp treo Hòn Thơm – view đỉnh": "Afternoon: Hon Thom Cable Car - scenic view",
    "Tối: Sunset Sanato Beach Club": "Evening: Sunset Sanato Beach Club",
    "Nam Đảo & Bay Về": "South Island & Return",
    "Sáng: Tắm biển Bãi Sao – đẹp nhất đảo": "Morning: Swim at Bai Sao Beach – most beautiful",
    "Trưa: Ăn nhum biển tại bãi biển": "Noon: Eat sea urchin on the beach",
    "Chiều: Mua quà lưu niệm, check-out": "Afternoon: Buy souvenirs, check-out",
    "Tối: Bay về": "Evening: Flight back home",
    "Đến Đảo & Khám Phá Bắc": "Arrive & Explore North",
    "Bay đến Phú Quốc, nhận phòng": "Fly to Phu Quoc, check-in",
    "Thăm Làng Chài & khu nuôi cấy ngọc trai": "Visit Fishing Village & pearl farm",
    "Chiều: Dinh Cậu – ngắm hoàng hôn": "Afternoon: Dinh Cau – sunset watching",
    "Tối: Bia hơi tươi & hải sản chợ đêm": "Evening: Fresh draft beer & night market seafood",
    "Tour 3 Đảo & Lặn Biển": "3-Island Tour & Snorkeling",
    "7h sáng: Xuất phát tour 3 đảo nam": "7:00 AM: Start south 3-island tour",
    "Lặn ngắm san hô tại Hòn Mây Rút": "Snorkel & view coral at Hon May Rut",
    "Câu cá & bơi lội tại bãi trống": "Fishing & swimming at open beach",
    "Ăn hải sản BBQ ngay trên thuyền": "BBQ seafood lunch on the boat",
    "VinWonders & Cáp Treo": "VinWonders & Cable Car",
    "Sáng: Cáp treo Hòn Thơm – dài nhất TG": "Morning: Hon Thom Cable Car – longest globally",
    "Trưa: Ăn trưa tại Grand World": "Noon: Lunch at Grand World",
    "Chiều: VinWonders Park – đủ trò vui": "Afternoon: VinWonders Park – full of activities",
    "Tối: Vinpearl Safari nếu thích": "Evening: Vinpearl Safari if desired",
    "Bắc Đảo & Rừng Nguyên Sinh": "North Island & Primeval Forest",
    "Sáng: Khám phá rừng quốc gia Phú Quốc": "Morning: Explore Phu Quoc National Forest",
    "Trưa: Ăn cơm rừng tại nhà hàng sinh thái": "Noon: Forest rice at eco-restaurant",
    "Chiều: Tham quan làng nghề nước mắm": "Afternoon: Visit fish sauce craft village",
    "Tối: Spa thư giãn tại resort": "Evening: Relaxing spa at resort",
    "Bãi Sao & Về Nhà": "Bai Sao Beach & Going Home",
    "Sáng: Bãi Sao – tắm biển lần cuối": "Morning: Bai Sao Beach – final swim",
    "Trưa: Ăn bánh mì Phú Quốc, dừa tươi": "Noon: Eat Phu Quoc banh mi, fresh coconut",
    "Chiều: Check-out, ra sân bay": "Afternoon: Check-out, transfer to airport",
    "Về với hàng ngàn kỷ niệm đẹp 💫": "Return with thousands of beautiful memories 💫",
    "Vé máy bay (khứ hồi)": "Flight ticket (round trip)",
    "Khách sạn / Resort": "Hotel / Resort",
    "Ăn uống": "Dining",
    "Tour & Vui chơi": "Tour & Activities",
    "Di chuyển nội đảo": "On-island transport",
    "Tổng ước tính": "Total estimate"
  };
  return dict[text] || text;
};

const translateCategory = (text: string, lang: string) => {
  if (lang === 'vi') return text;
  const dict: Record<string, string> = {
    // Tags
    "Biển & Đảo": "Beach & Island",
    "Kỳ quan": "Wonder",
    "Thành phố": "City",
    "Văn hóa": "Culture",
    "Biển": "Beach",
    "Trekking": "Trekking",
    "Nghỉ dưỡng": "Resort",
    "Ẩm thực": "Culinary",
    "Lặn biển": "Snorkeling",
    
    // Group sizes
    "1 mình": "Solo",
    "Cặp đôi": "Couple",
    "Nhóm bạn (3–5)": "Friends Group (3–5)",
    "Gia đình": "Family",
    "Đoàn lớn (6+)": "Large Group (6+)",
    
    // Budgets
    "Tiết kiệm": "Budget",
    "Trung bình": "Moderate",
    "Thoải mái": "Comfortable",
    "Sang trọng": "Luxury",
    "< 5 triệu/người": "< 5m VND/person",
    "5–15 triệu/người": "5–15m VND/person",
    "15–30 triệu/người": "15–30m VND/person",
    "> 30 triệu/người": "> 30m VND/person",

    // Durations
    "3 ngày": "3 days",
    "4 ngày": "4 days",
    "5 ngày": "5 days",
    "6 ngày": "6 days",
    "7 ngày": "7 days",
    "10+ ngày": "10+ days",
    
    // Interests
    "Biển & Bơi lội": "Beach & Swimming",
    "Chụp ảnh": "Photography",
    "Leo núi": "Mountain Climbing",
    "Văn hóa & Lịch sử": "Culture & History",
  };
  return dict[text] || text;
};

const DESTINATIONS = [
  { id: "pq", name: "Phú Quốc", region: "Kiên Giang", tag: "Biển & Đảo", image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "hl", name: "Hạ Long", region: "Quảng Ninh", tag: "Kỳ quan", image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "hn", name: "Hà Nội", region: "Miền Bắc", tag: "Thành phố", image: "https://images.unsplash.com/photo-1727860628226-2d545134f8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "hoi", name: "Hội An", region: "Quảng Nam", tag: "Văn hóa", image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "dn", name: "Đà Nẵng", region: "Miền Trung", tag: "Biển", image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { id: "sp", name: "Sa Pa", region: "Lào Cai", tag: "Trekking", image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

const DURATIONS = ["3 ngày", "4 ngày", "5 ngày", "6 ngày", "7 ngày", "10+ ngày"];
const GROUP_SIZES = ["1 mình", "Cặp đôi", "Nhóm bạn (3–5)", "Gia đình", "Đoàn lớn (6+)"];
const BUDGETS = [
  { label: "Tiết kiệm", range: "< 5 triệu/người", icon: "💰" },
  { label: "Trung bình", range: "5–15 triệu/người", icon: "💳" },
  { label: "Thoải mái", range: "15–30 triệu/người", icon: "✨" },
  { label: "Sang trọng", range: "> 30 triệu/người", icon: "👑" },
];
const INTERESTS = [
  { label: "Biển & Bơi lội", icon: <Waves size={16} /> },
  { label: "Ẩm thực", icon: <Utensils size={16} /> },
  { label: "Chụp ảnh", icon: <Camera size={16} /> },
  { label: "Leo núi", icon: <Mountain size={16} /> },
  { label: "Văn hóa & Lịch sử", icon: <Building2 size={16} /> },
  { label: "Nghỉ dưỡng", icon: <Heart size={16} /> },
];

// Pre-generated itineraries for Phú Quốc
const PHU_QUOC_ITINERARY = {
  "3 ngày": [
    { day: 1, title: "Bắc Đảo & Hoàng Hôn", emoji: "🌅", activities: ["Sáng: Đến Phú Quốc, check-in resort", "Trưa: Ăn hải sản tươi tại chợ Dương Đông", "Chiều: Tham quan dinh Cậu ngắm hoàng hôn", "Tối: Chợ đêm Phú Quốc – thưởng thức đặc sản"], budget: "1.800.000₫" },
    { day: 2, title: "Lặn Biển & Cáp Treo", emoji: "🤿", activities: ["Sáng sớm: Tour lặn biển 3 đảo", "Trưa: Ăn trưa tại nhà hàng nổi", "Chiều: Cáp treo Hòn Thơm – view đỉnh", "Tối: Sunset Sanato Beach Club"], budget: "2.200.000₫" },
    { day: 3, title: "Nam Đảo & Bay Về", emoji: "🏖️", activities: ["Sáng: Tắm biển Bãi Sao – đẹp nhất đảo", "Trưa: Ăn nhum biển tại bãi biển", "Chiều: Mua quà lưu niệm, check-out", "Tối: Bay về"], budget: "1.500.000₫" },
  ],
  "5 ngày": [
    { day: 1, title: "Đến Đảo & Khám Phá Bắc", emoji: "✈️", activities: ["Bay đến Phú Quốc, nhận phòng", "Thăm Làng Chài & khu nuôi cấy ngọc trai", "Chiều: Dinh Cậu – ngắm hoàng hôn", "Tối: Bia hơi tươi & hải sản chợ đêm"], budget: "1.600.000₫" },
    { day: 2, title: "Tour 3 Đảo & Lặn Biển", emoji: "🤿", activities: ["7h sáng: Xuất phát tour 3 đảo nam", "Lặn ngắm san hô tại Hòn Mây Rút", "Câu cá & bơi lội tại bãi trống", "Ăn hải sản BBQ ngay trên thuyền"], budget: "1.900.000₫" },
    { day: 3, title: "VinWonders & Cáp Treo", emoji: "🎡", activities: ["Sáng: Cáp treo Hòn Thơm – dài nhất TG", "Trưa: Ăn trưa tại Grand World", "Chiều: VinWonders Park – đủ trò vui", "Tối: Vinpearl Safari nếu thích"], budget: "2.500.000₫" },
    { day: 4, title: "Bắc Đảo & Rừng Nguyên Sinh", emoji: "🌿", activities: ["Sáng: Khám phá rừng quốc gia Phú Quốc", "Trưa: Ăn cơm rừng tại nhà hàng sinh thái", "Chiều: Tham quan làng nghề nước mắm", "Tối: Spa thư giãn tại resort"], budget: "1.700.000₫" },
    { day: 5, title: "Bãi Sao & Về Nhà", emoji: "🌊", activities: ["Sáng: Bãi Sao – tắm biển lần cuối", "Trưa: Ăn bánh mì Phú Quốc, dừa tươi", "Chiều: Check-out, ra sân bay", "Về với hàng ngàn kỷ niệm đẹp 💫"], budget: "1.400.000₫" },
  ],
};

const RELATED_FROM_EXPLORE: any[] = [];

type Step = 1 | 2 | 3 | 4;

export function CreateItinerary() {
  const { t, language } = useLanguageStore();
  const [step, setStep] = useState<Step>(1);
  const [destination, setDestination] = useState("pq");
  const [duration, setDuration] = useState("5 ngày");
  const [groupSize, setGroupSize] = useState("Cặp đôi");
  const [budget, setBudget] = useState("Trung bình");
  const [interests, setInterests] = useState<string[]>(["Biển & Bơi lội", "Ẩm thực"]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { saveItinerary } = useSavedItineraries();

  const selectedDest = DESTINATIONS.find((d) => d.id === destination) ?? DESTINATIONS[0];

  const toggleInterest = (label: string) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setIsSaved(false);
    setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
      setStep(4);
    }, 1800);
  };

  // Pick itinerary template based on duration
  const itineraryKey = duration.startsWith("3") ? "3 ngày" : "5 ngày";
  const itinerary = PHU_QUOC_ITINERARY[itineraryKey as keyof typeof PHU_QUOC_ITINERARY] ?? PHU_QUOC_ITINERARY["5 ngày"];
  const durationNum = parseInt(duration);
  const isPhúQuoc = destination === "pq";

  const gradientBtn = "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg transition-all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero banner ── */}
      <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={22} />
            <span className="font-semibold text-sm tracking-wide uppercase">{t("title", "createItinerary")}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">{t("subtitle", "createItinerary")}</h1>
          <p className="text-white/80 text-sm sm:text-base">
            {t("desc", "createItinerary")}
          </p>
        </div>

        {/* Progress steps */}
        <div className="max-w-2xl mx-auto mt-8 flex items-center gap-0">
          {[
            { n: 1, label: t("step1", "createItinerary") },
            { n: 2, label: t("step2", "createItinerary") },
            { n: 3, label: t("step3", "createItinerary") },
            { n: 4, label: t("step4", "createItinerary") },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step > n
                      ? "bg-white text-[#ff3131] border-white"
                      : step === n
                      ? "bg-white/30 text-white border-white"
                      : "bg-transparent text-white/50 border-white/30"
                  }`}
                >
                  {step > n ? <Check size={14} /> : n}
                </div>
                <span className={`text-xs mt-1 hidden sm:block ${step >= n ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-0.5 mx-1 mb-4 sm:mb-0 ${step > n ? "bg-white" : "bg-white/30"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ══════ STEP 1: Destination ══════ */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("question1", "createItinerary")}</h2>
              <p className="text-sm text-gray-500">{t("selectDestDesc", "createItinerary")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => setDestination(dest.id)}
                  className={`relative rounded-2xl overflow-hidden aspect-[4/3] group transition-all ${
                    destination === dest.id ? "ring-3 ring-[#ff3131] shadow-lg scale-[1.02]" : "hover:scale-[1.02]"
                  }`}
                >
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {destination === dest.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#ff3131] rounded-full flex items-center justify-center">
                      <Check size={13} className="text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
                    <p className="text-white font-bold text-sm leading-tight">{dest.name}</p>
                    <p className="text-white/70 text-xs">{translateCategory(dest.tag, language)}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Duration picker */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-[#ff3131]" /> {t("tripDuration", "createItinerary")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      duration === d
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#ff3131]"
                    }`}
                  >
                    {translateCategory(d, language)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 ${gradientBtn}`}
            >
              {t("nextBtn", "createItinerary")} <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* ══════ STEP 2: Group & Budget ══════ */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("step2", "createItinerary")}</h2>
              <p className="text-sm text-gray-500">{t("optimizeDesc", "createItinerary")}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Users size={16} className="text-[#ff3131]" /> {t("question2", "createItinerary")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GROUP_SIZES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroupSize(g)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                      groupSize === g
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white border-transparent"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#ff3131]"
                    }`}
                  >
                    {translateCategory(g, language)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-[#ff3131]" /> {t("question3", "createItinerary")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => setBudget(b.label)}
                    className={`p-4 rounded-2xl text-left border-2 transition-all ${
                      budget === b.label
                        ? "border-[#ff3131] bg-red-50"
                        : "border-gray-200 bg-white hover:border-[#ff914d]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{b.icon}</div>
                    <p className={`font-semibold text-sm ${budget === b.label ? "text-[#ff3131]" : "text-gray-800"}`}>
                      {translateCategory(b.label, language)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{translateCategory(b.range, language)}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-700 flex items-center justify-center gap-2 hover:border-[#ff3131] transition-all"
              >
                <ChevronLeft size={18} /> {t("backBtn", "createItinerary")}
              </button>
              <button
                onClick={() => setStep(3)}
                className={`flex-[2] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 ${gradientBtn}`}
              >
                {t("nextBtn", "createItinerary")} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 3: Interests ══════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{t("question4", "createItinerary")}</h2>
              <p className="text-sm text-gray-500">{t("activitiesDesc", "createItinerary")}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INTERESTS.map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => toggleInterest(label)}
                  className={`flex items-center gap-2.5 p-4 rounded-2xl border-2 text-left transition-all ${
                    interests.includes(label)
                      ? "border-[#ff3131] bg-red-50 text-[#ff3131]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#ff914d]"
                  }`}
                >
                  <span className={interests.includes(label) ? "text-[#ff3131]" : "text-gray-400"}>{icon}</span>
                  <span className="text-sm font-medium leading-tight">{translateCategory(label, language)}</span>
                  {interests.includes(label) && (
                    <Check size={14} className="ml-auto text-[#ff3131] flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-[#FFF5F3] to-white rounded-2xl p-4 border border-red-100">
              <p className="text-xs font-semibold text-[#ff3131] uppercase tracking-wide mb-3">{t("itinerarySummary", "createItinerary")}</p>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><MapPin size={14} className="text-[#ff3131]" /> {selectedDest.name}</div>
                <div className="flex items-center gap-2 text-gray-600"><Clock size={14} className="text-[#ff3131]" /> {translateCategory(duration, language)}</div>
                <div className="flex items-center gap-2 text-gray-600"><Users size={14} className="text-[#ff3131]" /> {translateCategory(groupSize, language)}</div>
                <div className="flex items-center gap-2 text-gray-600"><Wallet size={14} className="text-[#ff3131]" /> {translateCategory(budget, language)}</div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3.5 rounded-2xl font-bold border-2 border-gray-200 text-gray-700 flex items-center justify-center gap-2 hover:border-[#ff3131] transition-all"
              >
                <ChevronLeft size={18} /> {t("backBtn", "createItinerary")}
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`flex-[2] py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 ${gradientBtn} disabled:opacity-70`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    {t("generating", "createItinerary")}
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> {t("generateBtn", "createItinerary")}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 4: Generated Itinerary ══════ */}
        {step === 4 && generated && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} />
                <span className="text-sm font-semibold">{t("resultTitle", "createItinerary")}</span>
              </div>
              <h2 className="text-xl font-bold mb-1">
                {selectedDest.name} · {translateCategory(duration, language)}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-white/90">
                <span className="flex items-center gap-1"><Users size={13} /> {translateCategory(groupSize, language)}</span>
                <span className="flex items-center gap-1"><Wallet size={13} /> {translateCategory(budget, language)}</span>
                <span className="flex items-center gap-1"><Star size={13} /> {t("fitLabel", "createItinerary")} 96%</span>
              </div>
            </div>

            {/* Day-by-day */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={16} className="text-[#ff3131]" /> {t("dailyItinerary", "createItinerary")}
              </h3>
              {(isPhúQuoc ? itinerary : itinerary).map((day) => (
                <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{day.emoji}</span>
                      <div>
                        <span className="text-xs font-semibold text-[#ff3131] uppercase">{t("dayLabel", "createItinerary")} {day.day}</span>
                        <p className="font-bold text-gray-900 text-sm">{translateItineraryItem(day.title, language)}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#ff3131] bg-white px-2 py-1 rounded-lg">
                      ~{day.budget}
                    </span>
                  </div>
                  <ul className="px-4 py-3 space-y-1.5">
                    {day.activities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-[#ff914d] rounded-full mt-1.5 flex-shrink-0" />
                        {translateItineraryItem(act, language)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Budget estimate */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-[#ff3131]" /> {t("costEstimate", "createItinerary")}
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Vé máy bay (khứ hồi)", amount: "2.400.000₫" },
                  { label: "Khách sạn / Resort", amount: "4.500.000₫" },
                  { label: "Ăn uống", amount: "1.800.000₫" },
                  { label: "Tour & Vui chơi", amount: "2.200.000₫" },
                  { label: "Di chuyển nội đảo", amount: "500.000₫" },
                ].map(({ label, amount }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-600">{translateItineraryItem(label, language)}</span>
                    <span className="font-semibold text-gray-900">{amount}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-gray-200 mt-2 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">{t("totalEstimate", "createItinerary")}</span>
                  <span className="font-bold text-[#ff3131] text-base">~11.400.000₫/{language === 'vi' ? 'người' : 'person'}</span>
                </div>
              </div>
            </div>

            {/* Related diaries from Explore */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Star size={16} className="text-[#ff3131]" /> {t("communityJournals", "createItinerary")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RELATED_FROM_EXPLORE.map((diary) => (
                  <Link
                    key={diary.id}
                    to={`/diary/${diary.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <ImageWithFallback
                        src={diary.image}
                        alt={diary.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[#ff3131] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        ✓ {t("trustScoreLabel", "createItinerary")} {diary.trustScore}%
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm mb-1">{diary.title}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        <span className="flex items-center gap-1"><Clock size={11} />{translateCategory(diary.duration, language)}</span>
                        <span className="flex items-center gap-1"><Wallet size={11} />{diary.budget}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {diary.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-red-50 text-[#ff3131] rounded-full text-xs font-medium">
                            {translateCategory(tag, language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link
                to="/explore"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-[#ff3131] font-semibold hover:underline"
              >
                {t("viewMoreJournals", "createItinerary")} <ArrowRight size={14} />
              </Link>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setStep(1); setGenerated(false); setIsSaved(false); }}
                className="flex-1 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold flex items-center justify-center gap-2 hover:border-[#ff3131] transition-all"
              >
                <RefreshCw size={16} /> {t("regenerate", "createItinerary")}
              </button>
              <button
                onClick={() => {
                  if (isSaved) return;
                  saveItinerary({
                    destination: selectedDest.name,
                    destinationRegion: selectedDest.region,
                    destinationImage: selectedDest.image,
                    duration,
                    groupSize,
                    budget,
                    interests,
                    estimatedTotal: "~11.400.000₫/người",
                    days: itinerary,
                    budgetBreakdown: [
                      { label: "Vé máy bay (khứ hồi)", amount: "2.400.000₫" },
                      { label: "Khách sạn / Resort", amount: "4.500.000₫" },
                      { label: "Ăn uống", amount: "1.800.000₫" },
                      { label: "Tour & Vui chơi", amount: "2.200.000₫" },
                      { label: "Di chuyển nội đảo", amount: "500.000₫" },
                    ],
                  });
                  setIsSaved(true);
                }}
                className={`flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all border-2 ${
                  isSaved
                    ? "bg-green-50 border-green-500 text-green-600"
                    : "border-[#ff3131] text-[#ff3131] hover:bg-red-50"
                }`}
              >
                {isSaved ? (
                  <><BookmarkCheck size={16} /> {t("saved", "createItinerary")}</>
                ) : (
                  <><Bookmark size={16} /> {t("saveItinerary", "createItinerary")}</>
                )}
              </button>
              <button className={`flex-1 py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 ${gradientBtn}`}>
                <Share2 size={16} /> {t("share", "createItinerary")}
              </button>
            </div>

            {isSaved && (
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-semibold hover:shadow-lg transition-all"
              >
                <BookmarkCheck size={18} /> {t("viewSavedDashboard", "createItinerary")}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}