import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowLeft, RotateCcw, MapPin, Wallet, Compass } from "lucide-react";

type Action = { label: string; href: string };
type Message = { role: "user" | "assistant"; content: string; actions?: Action[] };

const quickSuggestions = [
  { icon: "🗺️", text: "Tạo lịch trình đi Phú Quốc" },
  { icon: "🏝️", text: "Bãi biển đẹp ở Việt Nam" },
  { icon: "💰", text: "Mẹo du lịch tiết kiệm" },
  { icon: "🏔️", text: "Cung trekking tốt nhất" },
  { icon: "🍜", text: "Tour ẩm thực đường phố" },
  { icon: "📅", text: "Lịch trình 5 ngày Hà Nội" },
];

const PHU_QUOC_RESPONSE: Message = {
  role: "assistant",
  content:
    "🌴 **Phú Quốc – Đảo Ngọc của Việt Nam!**\n\nĐây là gợi ý lịch trình 5 ngày phổ biến nhất:\n\n📅 **Ngày 1** – Đến đảo, nhận phòng, khám phá Dương Đông & chợ đêm\n📅 **Ngày 2** – Tour lặn biển 3 đảo nam, ăn hải sản nổi trên biển\n📅 **Ngày 3** – Cáp treo Hòn Thơm (dài nhất TG) + VinWonders Park\n📅 **Ngày 4** – Rừng quốc gia Phú Quốc, làng nghề nước mắm, spa\n📅 **Ngày 5** – Bãi Sao tắm biển lần cuối, mua quà, bay về\n\n💰 **Chi phí ước tính:** 9–15 triệu₫/người (5 ngày trọn gói)\n🌡️ **Thời điểm đẹp nhất:** Tháng 11 – tháng 4 (mùa khô)\n\n✨ Có nhật ký thực tế từ cộng đồng WanderLab:\n• **\"Thiên Đường Phú Quốc\"** – Hương L. · ⭐ 95% tin cậy · 5 ngày · 22.5 triệu₫\n• **\"Đảo Ngọc 4N3Đ\"** – Minh T. · ⭐ 92% tin cậy · khách sạn 3–4 sao\n\nMuốn lịch trình riêng theo ngân sách & sở thích của bạn không? 👇",
  actions: [
    { label: "📋 Xem nhật ký tại trang Khám phá", href: "/explore" },
    { label: "✨ Cá nhân hóa lịch trình của tôi", href: "/create-itinerary" },
  ],
};

const sampleResponses: Record<string, Message> = {
  default: {
    role: "assistant",
    content:
      "Xin chào! Tôi là trợ lý du lịch AI của WanderLab. Tôi có thể giúp bạn:\n\n• Tìm điểm đến phù hợp tại Việt Nam\n• Lập kế hoạch ngân sách chuyến đi\n• Khám phá lộ trình phổ biến\n• Trả lời thắc mắc về WanderLab\n\nBạn muốn khám phá điều gì hôm nay?",
  },
  beach: {
    role: "assistant",
    content:
      "Việt Nam có rất nhiều bãi biển tuyệt đẹp! Đây là những điểm nổi bật:\n\n🏖️ **Phú Quốc** – Đảo Ngọc với bãi cát trắng mịn\n💰 Ngân sách: 1.500.000–2.500.000₫/ngày\n\n🌊 **Nha Trang** – Thành phố biển sôi động, lặn biển cực vui\n💰 Ngân sách: 1.200.000–2.000.000₫/ngày\n\n🏝️ **Côn Đảo** – Đảo hoang sơ, trong lành, ít đông\n💰 Ngân sách: 2.000.000–3.500.000₫/ngày\n\n🌸 **Mũi Né** – Đồi cát hồng, thích hợp thể thao biển\n💰 Ngân sách: 800.000–1.500.000₫/ngày\n\nBạn muốn lộ trình chi tiết cho điểm nào?",
  },
  budget: {
    role: "assistant",
    content:
      "Đây là bí quyết du lịch tiết kiệm tại Việt Nam:\n\n💡 **Lưu trú**: 200.000–600.000₫/đêm (hostel/nhà nghỉ)\n🍜 **Ăn uống**: 30.000–80.000₫/bữa tại quán địa phương\n🚌 **Di chuyển**: 150.000–400.000₫ xe khách liên tỉnh\n✈️ **Bay**: Đặt trước 2–3 tháng giá chỉ từ 500.000₫\n\n**Ngân sách 1 ngày lý tưởng**: 500.000–1.000.000₫\n\n📌 Mẹo vàng:\n• Đi vào mùa thấp điểm (tháng 4–6, tháng 9–11)\n• Dùng xe máy thay vì xe ôm công nghệ\n• Ăn sáng bún/phở địa phương chỉ 30–50k\n\nBạn muốn tôi lập ngân sách cho điểm đến cụ thể không?",
  },
  trekking: {
    role: "assistant",
    content:
      "Việt Nam là thiên đường trekking! Các cung đường hot nhất:\n\n⛰️ **Sa Pa** – Ruộng bậc thang, bản làng dân tộc\nĐộ khó: Trung bình | Mùa đẹp: Tháng 9–11\n\n🏔️ **Vòng Hà Giang** – Địa hình đá tai mèo hùng vĩ\nĐộ khó: Khó | Mùa đẹp: Tháng 9–12\n\n🌲 **Pù Luông** – Thung lũng xanh ít khách\nĐộ khó: Dễ–Trung bình | Mùa đẹp: Tháng 4–5\n\n🦅 **Fansipan** – Nóc nhà Đông Dương, cáp treo tiện lợi\nĐộ khó: Trung bình–Khó | Mùa đẹp: Quanh năm\n\nBạn ưa thích mức độ khó nào? Tôi sẽ gợi ý lộ trình cụ thể!",
  },
  food: {
    role: "assistant",
    content:
      "Ẩm thực Việt Nam là kiệt tác! Hành trình ẩm thực không thể bỏ lỡ:\n\n🍜 **Hà Nội** – Phở, bún chả, bánh cuốn, cà phê trứng\n🥖 **Hội An** – Cao lầu, cơm gà, bánh mì Phượng\n🌮 **Sài Gòn** – Bánh xèo, hủ tiếu Nam Vang, cơm tấm\n🍲 **Huế** – Bún bò, bánh khoái, mì Quảng đậm đà\n\nGợi ý tour ẩm thực:\n• Ăn sáng tại chợ địa phương: 50.000₫\n• Street food tour buổi tối: 300.000₫/người\n• Lớp học nấu ăn tại Hội An: 600.000₫/người\n\nMuốn tôi lập lịch trình ẩm thực cho thành phố nào?",
  },
  hanoi: {
    role: "assistant",
    content:
      "Lịch trình 5 ngày Hà Nội hoàn hảo:\n\n📅 **Ngày 1**: Hồ Hoàn Kiếm → Phố Cổ → Bia Hơi Tạ Hiện\n📅 **Ngày 2**: Lăng Chủ Tịch → Văn Miếu → Hoàng Thành\n📅 **Ngày 3**: Bảo tàng Dân Tộc → Hồ Tây → Cafe Trứng\n📅 **Ngày 4**: Đường tàu Phùng Hưng → Phố Bích Họa → Chợ Đồng Xuân\n📅 **Ngày 5**: Đền Quán Thánh → Chùa Một Cột → mua quà về\n\n💰 Ngân sách ước tính: 4.000.000–6.000.000₫/người\n🏨 Khách sạn gợi ý: Khu phố cổ, giá 400.000–800.000₫/đêm\n\nBạn muốn tôi chi tiết hóa ngày nào?",
  },
};

function getResponse(message: string): Message {
  const lower = message.toLowerCase();
  if (lower.includes("phú quốc") || lower.includes("phu quoc") || lower.includes("lịch trình") || lower.includes("tạo lịch"))
    return PHU_QUOC_RESPONSE;
  if (lower.includes("beach") || lower.includes("biển")) return sampleResponses.beach;
  if (lower.includes("budget") || lower.includes("tiết kiệm") || lower.includes("rẻ")) return sampleResponses.budget;
  if (lower.includes("trek") || lower.includes("leo núi") || lower.includes("trekking")) return sampleResponses.trekking;
  if (lower.includes("food") || lower.includes("ăn") || lower.includes("ẩm thực")) return sampleResponses.food;
  if (lower.includes("hà nội") || lower.includes("hanoi")) return sampleResponses.hanoi;
  return sampleResponses.default;
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { ...sampleResponses.default },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (message: string) => {
    if (!message.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInputMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, getResponse(message)]);
      setIsTyping(false);
    }, 900);
  };

  const handleReset = () => {
    setMessages([{ ...sampleResponses.default }]);
    setInputMessage("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen bg-[#FFF5F3]">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-lg">
        <a
          href="/"
          className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
          title="Quay lại trang chủ"
        >
          <ArrowLeft size={22} />
        </a>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base leading-tight">AI Travel Assistant</h1>
          <p className="text-xs text-white/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
            Trực tuyến • Luôn sẵn sàng hỗ trợ
          </p>
        </div>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-white/20 rounded-xl transition-colors flex-shrink-0"
          title="Cuộc trò chuyện mới"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* ── Capability chips ── */}
      <div className="flex gap-2 px-4 py-2.5 overflow-x-auto flex-shrink-0 bg-white border-b border-gray-100">
        {[
          { icon: <MapPin size={12} />, text: "Điểm đến" },
          { icon: <Wallet size={12} />, text: "Ngân sách" },
          { icon: <Compass size={12} />, text: "Lộ trình" },
        ].map(({ icon, text }) => (
          <span
            key={text}
            className="flex items-center gap-1 px-3 py-1 bg-[#FFF5F3] text-[#ff3131] text-xs font-semibold rounded-full flex-shrink-0 border border-[#FFE8E0]"
          >
            {icon}
            {text}
          </span>
        ))}
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1 shadow-sm">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>

            {/* Action buttons */}
            {msg.actions && msg.actions.length > 0 && (
              <div className="mt-2 ml-10 space-y-2 w-full max-w-[82%] sm:max-w-[70%]">
                {msg.actions.map((action, ai) => (
                  <a
                    key={ai}
                    href={action.href}
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
                      action.href === "/create-itinerary"
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-md hover:scale-[1.02]"
                        : "bg-white border-2 border-[#ff3131]/20 text-[#ff3131] hover:border-[#ff3131] hover:bg-red-50"
                    }`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-4">
                <div className="w-2 h-2 bg-[#ff3131] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#ff6b31] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#ff914d] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Quick suggestions — only on first message */}
        {messages.length === 1 && !isTyping && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-gray-500 text-center font-medium">Gợi ý nhanh:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className={`flex items-center gap-2.5 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all shadow-sm border ${
                    s.text.includes("Phú Quốc")
                      ? "bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10 border-[#ff3131]/30 text-[#ff3131] hover:from-[#ff3131] hover:to-[#ff914d] hover:text-white"
                      : "bg-white border-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#ff3131] hover:to-[#ff914d] hover:text-white hover:border-transparent"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(inputMessage); }}
          className="flex gap-2 items-center"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Hỏi tôi bất cứ điều gì về du lịch..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent text-sm bg-[#FFF5F3]"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="w-11 h-11 flex items-center justify-center bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-2">
          WanderLab AI • Gợi ý dựa trên dữ liệu du lịch thực tế
        </p>
      </div>
    </div>
  );
}
