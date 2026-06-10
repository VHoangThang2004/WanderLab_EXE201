import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ArrowLeft, RotateCcw, MapPin, Wallet, Compass } from "lucide-react";
import { sendAIChat, type ChatMessage } from "@/api/aiService";

type Action = { label: string; href: string };
type UIMessage = { role: "user" | "assistant"; content: string; actions?: Action[] };

const quickSuggestions = [
  { icon: "🗺️", text: "Tạo lịch trình đi Phú Quốc" },
  { icon: "🏝️", text: "Bãi biển đẹp ở Việt Nam" },
  { icon: "💰", text: "Mẹo du lịch tiết kiệm" },
  { icon: "🏔️", text: "Cung trekking tốt nhất" },
  { icon: "🍜", text: "Tour ẩm thực đường phố" },
  { icon: "📅", text: "Lịch trình 5 ngày Hà Nội" },
];

const WELCOME_MESSAGE: UIMessage = {
  role: "assistant",
  content:
    "Xin chào! Tôi là trợ lý du lịch AI của WanderLab 🌍\n\nTôi có thể giúp bạn:\n\n• Tìm điểm đến phù hợp tại Việt Nam\n• Lập kế hoạch ngân sách chuyến đi\n• Khám phá lộ trình phổ biến\n• Trả lời thắc mắc về du lịch\n\nBạn muốn khám phá điều gì hôm nay?",
};

export function ChatPage() {
  const [messages, setMessages] = useState<UIMessage[]>([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isTyping) return;

    const userMessage: UIMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setStreamingContent("");

    // Build chat history for context
    const chatHistory: ChatMessage[] = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));
    chatHistory.push({ role: "user", content: message });

    const controller = new AbortController();
    abortRef.current = controller;

    const result = await sendAIChat({
      messages: chatHistory,
      stream: true,
      onChunk: (text) => setStreamingContent(text),
      signal: controller.signal,
    });

    abortRef.current = null;
    setIsTyping(false);
    setStreamingContent("");

    if (result.error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${result.error}\n\nVui lòng thử lại sau.`,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.content },
      ]);
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setInputMessage("");
    setIsTyping(false);
    setStreamingContent("");
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

        {/* Streaming response */}
        {isTyping && streamingContent && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="max-w-[82%] sm:max-w-[70%] bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <p className="text-sm whitespace-pre-line leading-relaxed">{streamingContent}</p>
            </div>
          </div>
        )}

        {/* Typing indicator (before stream starts) */}
        {isTyping && !streamingContent && (
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
