import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore, useLanguageStore } from '@/stores';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { Search, Phone, Video, Info, MoreVertical, Send, Image as ImageIcon, Smile, Paperclip, Check, CheckCheck, MessageCircle } from 'lucide-react';
import { CallModal } from '../../components/wander/CallModal';
import { useSearchParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, ChatContact, ChatMessage } from '@/api/messageService';

export function MessagesPage() {
  const { user } = useAuthStore();
  const { language } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const userIdParam = searchParams.get("userId");

  const queryClient = useQueryClient();

  const { data: contactsData, isLoading: isLoadingContacts } = useQuery({
    queryKey: ['recentChats', user?.id],
    queryFn: () => messageService.fetchRecentChats(user?.id || ''),
    enabled: !!user?.id,
  });

  const chats: ChatContact[] = contactsData || [];

  const [activeChatId, setActiveChatId] = useState<string | null>(userIdParam || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  
  // Set first chat as active if none selected and chats are loaded
  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const { data: messagesData } = useQuery({
    queryKey: ['messages', user?.id, activeChatId],
    queryFn: () => messageService.fetchMessages(user?.id || '', activeChatId!),
    enabled: !!(user?.id && activeChatId),
    refetchInterval: 3000, // simple polling for real-time feel
  });

  const messages: ChatMessage[] = messagesData || [];
  
  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => messageService.sendMessage(user?.id || '', activeChatId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['recentChats', user?.id] });
    }
  });
  
  // Call Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark as read when active chat changes
  useEffect(() => {
    if (activeChatId && user?.id) {
      messageService.markAsRead(user.id, activeChatId).then(() => {
        queryClient.invalidateQueries({ queryKey: ['recentChats', user.id] });
      });
    }
  }, [activeChatId, user?.id, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;

    sendMessageMutation.mutate(inputMessage);
    setInputMessage("");
  };

  const handleStartCall = (video: boolean) => {
    setIsVideoCall(video);
    setIsCallModalOpen(true);
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-0px)] bg-white dark:bg-black rounded-tl-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 m-2 lg:m-4">
      {/* ── Left Sidebar (Chat List) ── */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-card ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'vi' ? 'Đoạn chat' : 'Chats'}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={language === 'vi' ? 'Tìm kiếm trên Messenger' : 'Search Messenger'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-gray-800 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:bg-white dark:focus:bg-gray-900 transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full flex items-center gap-3 p-3 transition-colors ${
                activeChatId === chat.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative flex-shrink-0">
                <ImageWithFallback src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full object-cover" />
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {chat.name}
                  </h3>
                  <span className={`text-xs flex-shrink-0 ml-2 ${chat.unread > 0 ? 'text-[#ff3131] font-bold' : 'text-gray-500'}`}>
                    {chat.time}
                  </span>
                </div>
                <p className={`text-sm truncate ${chat.unread > 0 ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                  {chat.lastMessage}
                </p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-[#ff3131] text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Content (Chat Area) ── */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-black ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3 cursor-pointer">
                {/* Back button for mobile */}
                <button 
                  className="md:hidden p-2 -ml-2 text-[#ff3131] hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                  onClick={() => setActiveChatId(null)}
                >
                  <Search size={20} />
                </button>
                <div className="relative">
                  <ImageWithFallback src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                  {activeChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{activeChat.name}</h2>
                  <p className="text-xs text-gray-500">
                    {activeChat.isOnline ? 'Đang hoạt động' : activeChat.lastActive || 'Ngoại tuyến'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 text-[#ff3131]">
                <button onClick={() => handleStartCall(false)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors" title="Gọi thoại">
                  <Phone size={20} />
                </button>
                <button onClick={() => handleStartCall(true)} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors" title="Gọi video">
                  <Video size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 rounded-full transition-colors hidden sm:block">
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === user?.id;
                const showAvatar = !isMe && (i === messages.length - 1 || messages[i + 1]?.sender_id === user?.id);
                const msgTime = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex max-w-[75%] sm:max-w-[65%] gap-2 items-end">
                      {!isMe && (
                        <div className="w-7 h-7 flex-shrink-0">
                          {showAvatar && <ImageWithFallback src={activeChat.avatar} alt={activeChat.name} className="w-7 h-7 rounded-full object-cover" />}
                        </div>
                      )}
                      
                      <div className={`relative group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          isMe 
                            ? 'bg-[#ff3131] text-white rounded-br-sm' 
                            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                        </div>
                        
                        {/* Timestamp & Status on Hover/Focus */}
                        <div className={`flex items-center gap-1 mt-1 px-1 text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? 'flex-row-reverse' : ''}`}>
                          <span>{msgTime}</span>
                          {isMe && (
                            msg.status === 'read' ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex gap-1 text-[#ff3131] pb-1.5 hidden sm:flex">
                  <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><Paperclip size={20} /></button>
                  <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
                </div>
                
                <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-colors">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={language === 'vi' ? "Aa" : "Message..."}
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm text-gray-900 dark:text-white max-h-32"
                    autoComplete="off"
                  />
                  <button type="button" className="p-2 mr-1 text-[#ff3131] hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <Smile size={20} />
                  </button>
                </div>
                
                {inputMessage.trim() ? (
                  <button 
                    type="submit" 
                    className="p-3 mb-0.5 bg-[#ff3131] text-white hover:bg-[#ff1f1f] rounded-full transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="p-3 mb-0.5 text-[#ff3131] hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-all"
                  >
                    <span className="text-xl leading-none">👍</span>
                  </button>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-black/50 text-gray-500">
            <MessageCircle size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {language === 'vi' ? 'Tin nhắn của bạn' : 'Your Messages'}
            </h3>
            <p className="text-sm text-gray-400">
              {language === 'vi' ? 'Chọn một đoạn chat hoặc bắt đầu cuộc trò chuyện mới.' : 'Select a chat or start a new conversation.'}
            </p>
          </div>
        )}
      </div>

      {/* Call Modal Overlay */}
      {activeChat && (
        <CallModal 
          isOpen={isCallModalOpen} 
          onClose={() => setIsCallModalOpen(false)} 
          callerName={activeChat.name}
          callerAvatar={activeChat.avatar}
          isVideoCall={isVideoCall}
        />
      )}
    </div>
  );
}
