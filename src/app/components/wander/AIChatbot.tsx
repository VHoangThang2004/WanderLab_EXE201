import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Minimize2, Maximize2, ExternalLink } from "lucide-react";

type Action = { label: string; href: string; emoji?: string };
type Message = { role: "user" | "assistant"; content: string; actions?: Action[] };

const quickSuggestions = [
  "🏝️ Bãi biển đẹp ở Việt Nam",
  "⛰️ Cung trekking tốt nhất",
  "🍜 Tour ẩm thực đường phố",
  "🗺️ Tạo lịch trình đi Phú Quốc",
  "📸 Địa điểm check-in hot",
];

const PHU_QUOC_RESPONSE: Message = {
  role: "assistant",
  content:
    "🌴 **Phú Quốc – Đảo Ngọc của Việt Nam!**\n\nĐây là gợi ý lịch trình 5 ngày phổ biến:\n\n📅 **Ngày 1** – Đến đảo, khám phá Dương Đông & chợ đêm\n📅 **Ngày 2** – Tour lặn biển 3 đảo nam, ăn hải sản nổi\n📅 **Ngày 3** – Cáp treo Hòn Thơm + VinWonders\n📅 **Ngày 4** – Rừng quốc gia, làng nghề nước mắm\n📅 **Ngày 5** – Bãi Sao, mua quà, bay về\n\n✨ Có 2 nhật ký thực tế từ cộng đồng:\n• **\"Thiên Đường Phú Quốc\"** – Hương L. · 95% tin cậy\n• **\"Đảo Ngọc 4N3Đ\"** – Minh T. · 92% tin cậy\n\nBạn muốn tôi tạo lịch trình cá nhân hóa riêng cho bạn không? 👇",
  actions: [
    { label: "📋 Xem nhật ký", href: "/", emoji: "📋" },
    { label: "✨ Cá nhân hóa lịch trình của tôi", href: "/create-itinerary", emoji: "✨" },
  ],
};

const sampleResponses: Record<string, Message> = {
  default: {
    role: "assistant",
    content:
      "Xin chào! Tôi là trợ lý du lịch AI của WanderLab. Tôi có thể giúp bạn:\n\n• Tìm điểm đến phù hợp tại Việt Nam\n• Lập kế hoạch chuyến đi\n• Khám phá lộ trình phổ biến\n• Trả lời thắc mắc về WanderLab\n\nBạn muốn khám phá điều gì?",
  },
  beach: {
    role: "assistant",
    content:
      "Việt Nam có nhiều bãi biển tuyệt đẹp!\n\n🏖️ **Phú Quốc** – Đảo Ngọc, cát trắng mịn\n🌊 **Nha Trang** – Lặn biển, thể thao nước\n🏝️ **Côn Đảo** – Hoang sơ, trong lành\n🌅 **Quy Nhơn** – Yên tĩnh, ít khách\n\nBạn muốn lộ trình chi tiết cho điểm nào?",
  },
  trekking: {
    role: "assistant",
    content:
      "Các cung trekking đỉnh nhất Việt Nam:\n\n⛰️ **Sa Pa** – Ruộng bậc thang, bản làng\n🏔️ **Hà Giang Loop** – Địa hình đá tai mèo\n🌲 **Pù Luông** – Thung lũng ít khách\n🦅 **Fansipan** – Nóc nhà Đông Dương\n\nBạn ưa độ khó nào? Tôi gợi ý lộ trình phù hợp!",
  },
  food: {
    role: "assistant",
    content:
      "Hành trình ẩm thực Việt Nam:\n\n🍜 **Hà Nội** – Phở, bún chả, cà phê trứng\n🥖 **Hội An** – Cao lầu, bánh mì Phượng\n🌮 **Sài Gòn** – Bánh xèo, cơm tấm, hủ tiếu\n🍲 **Huế** – Bún bò, bánh khoái đậm đà\n\nMuốn lịch trình ẩm thực cho thành phố nào?",
  },
};

function getResponse(message: string): Message {
  const lower = message.toLowerCase();
  if (lower.includes("phú quốc") || lower.includes("phu quoc") || lower.includes("lịch trình")) return PHU_QUOC_RESPONSE;
  if (lower.includes("beach") || lower.includes("biển")) return sampleResponses.beach;
  if (lower.includes("trek") || lower.includes("leo núi")) return sampleResponses.trekking;
  if (lower.includes("food") || lower.includes("ăn") || lower.includes("ẩm thực")) return sampleResponses.food;
  return sampleResponses.default;
}

// ── Draggable hook ────────────────────────────────────────────
function useDraggable(defaultPos: { x: number; y: number }) {
  const [pos, setPos] = useState(defaultPos);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only drag on the handle element itself (header / bubble)
    dragging.current = true;
    hasMoved.current = false;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startMouse.current.x;
    const dy = e.clientY - startMouse.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved.current = true;
    const newX = startPos.current.x + dx;
    const newY = startPos.current.y + dy;
    setPos({ x: newX, y: newY });
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return { pos, setPos, hasMoved, onPointerDown, onPointerMove, onPointerUp };
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ ...sampleResponses.default }]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Default position: bottom-right corner (negative = from bottom-right via transform)
  const { pos, hasMoved, onPointerDown, onPointerMove, onPointerUp } = useDraggable({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  const handleSendMessage = (message: string) => {
    if (!message.trim() || isTyping) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInputMessage("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, getResponse(message)]);
      setIsTyping(false);
    }, 900);
  };

  // The outer wrapper is positioned fixed bottom-right, then translated by drag offset
  const dragStyle = {
    transform: `translate(${pos.x}px, ${pos.y}px)`,
    cursor: "default",
  };

  if (!isOpen) {
    return (
      <div
        style={dragStyle}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 select-none"
      >
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={() => {
            if (!hasMoved.current) setIsOpen(true);
          }}
          style={{ touchAction: "none" }}
          className="w-14 h-14 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center group cursor-grab active:cursor-grabbing"
          title="Di chuyển hoặc nhấn để mở chat"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform pointer-events-none" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse pointer-events-none" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 select-none ${
        isMinimized
          ? "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] max-w-sm"
          : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] max-w-sm h-[min(580px,calc(100dvh-5rem))]"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-gray-100">

        {/* ── Header (drag handle) ── */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{ touchAction: "none" }}
          className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white px-4 py-3 flex items-center justify-between flex-shrink-0 cursor-grab active:cursor-grabbing"
          title="Kéo để di chuyển"
        >
          <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm leading-tight truncate">AI Travel Assistant</h3>
              <p className="text-xs text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Trực tuyến
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 pointer-events-auto">
            <a
              href="/chat"
              onPointerDown={(e) => e.stopPropagation()}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Mở rộng toàn màn hình"
            >
              <ExternalLink size={16} />
            </a>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FFF5F3]">
              {messages.map((message, index) => (
                <div key={index} className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-3 py-2.5 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-br-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  </div>

                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-2 space-y-1.5 w-full max-w-[88%]">
                      {message.actions.map((action, ai) => (
                        <a
                          key={ai}
                          href={action.href}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            action.href === "/create-itinerary"
                              ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-md"
                              : "bg-white border border-gray-200 text-gray-700 hover:border-[#ff3131] hover:text-[#ff3131]"
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
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm rounded-2xl rounded-bl-sm px-3 py-2.5">
                    <div className="flex gap-1 items-center h-4">
                      <div className="w-2 h-2 bg-[#ff3131] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-[#ff6b31] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-[#ff914d] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {messages.length === 1 && !isTyping && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-500 text-center">Gợi ý nhanh:</p>
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(suggestion)}
                      className="w-full text-left px-3 py-2 bg-white rounded-xl text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#ff3131] hover:to-[#ff914d] hover:text-white transition-all shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* ── Input ── */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputMessage); }}
                className="flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Hỏi tôi về du lịch..."
                  className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent text-sm bg-[#FFF5F3] min-w-0"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={17} />
                </button>
              </form>
              <a
                href="/chat"
                className="flex items-center justify-center gap-1 mt-2 text-xs text-[#ff3131] hover:underline font-medium"
              >
                <ExternalLink size={11} />
                Mở chat toàn màn hình
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}