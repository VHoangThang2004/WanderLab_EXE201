import { useState, useRef, useEffect } from "react";
import { X, Send, Smile, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "friend";
  timestamp: string;
}

interface ChatBoxProps {
  friend: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  onClose: () => void;
}

export function ChatBox({ friend, onClose }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Chào bạn! Mình thấy bạn vừa đi Hạ Long phải không?",
      sender: "friend",
      timestamp: "10:30",
    },
    {
      id: "2",
      text: "Đúng rồi! Mình mới về hôm qua. Cảnh đẹp lắm luôn!",
      sender: "me",
      timestamp: "10:32",
    },
    {
      id: "3",
      text: "Mình đang lên kế hoạch đi tháng sau nè. Bạn có tips gì không?",
      sender: "friend",
      timestamp: "10:33",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        sender: "me",
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ImageWithFallback
              src={friend.avatar}
              alt={friend.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            {friend.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-white">{friend.name}</h3>
            <p className="text-xs text-white/80">
              {friend.isOnline ? "Đang hoạt động" : "Không hoạt động"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Phone size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Video size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <MoreVertical size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                message.sender === "me"
                  ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === "me" ? "text-white/70" : "text-gray-400"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-[#ff3131] transition-colors"
          >
            <Paperclip size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-[#ff3131] transition-colors"
          >
            <Smile size={20} />
          </motion.button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="w-10 h-10 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full flex items-center justify-center hover:shadow-md transition-all"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
