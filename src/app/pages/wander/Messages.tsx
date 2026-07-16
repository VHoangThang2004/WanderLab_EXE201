import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore, useLanguageStore } from '@/stores';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { UserAvatar } from '../../components/wander/UserAvatar';
import { Search, Phone, Video, Info, MoreVertical, Send, Image as ImageIcon, Smile, Paperclip, Check, CheckCheck, MessageCircle, PhoneMissed, PhoneCall, Edit2, Trash2, Plus, X, Palette, Type } from 'lucide-react';
import { CallModal } from '../../components/wander/CallModal';
import { useSearchParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService, ChatContact, ChatMessage } from '@/api/messageService';
import { friendService } from '@/api/friendService';
import { supabase } from '@/lib/supabase';

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '👽', '👾', '🤖',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
  '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '👍', '👎',
  '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🤚', '🖐', '✋', '🖖'
];

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
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  
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
  });

  const messages: ChatMessage[] = messagesData || [];
  
  const sendMessageMutation = useMutation({
    mutationFn: ({ content, mediaUrl, mediaType }: { content: string, mediaUrl?: string, mediaType?: string }) => 
      messageService.sendMessage(user?.id || '', activeChatId!, content, mediaUrl, mediaType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['recentChats', user?.id] });
    }
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: string, content: string }) => 
      messageService.updateMessage(messageId, user?.id || '', content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, activeChatId] });
      setEditingMessageId(null);
      setInputMessage("");
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => 
      messageService.deleteMessage(messageId, user?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id, activeChatId] });
    }
  });

  const deleteChatMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !activeChatId) throw new Error("Missing IDs");
      const success = await messageService.deleteChat(user.id, activeChatId);
      if (!success) throw new Error("Failed to delete chat");
      return success;
    },
    onSuccess: () => {
      // Update cache immediately to prevent useEffect from re-selecting the deleted chat
      queryClient.setQueryData(['recentChats', user?.id], (old: ChatContact[] | undefined) => {
        if (!old) return [];
        return old.filter(c => c.id !== activeChatId);
      });
      
      setActiveChatId(null);
      setShowInfoPanel(false);
      
      queryClient.invalidateQueries({ queryKey: ['recentChats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['messages', user?.id] });
    },
    onError: () => {
      alert(language === 'vi' ? 'Có lỗi xảy ra khi xóa đoạn chat.' : 'Error deleting chat.');
    }
  });

  const handleDeleteChat = () => {
    if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa toàn bộ đoạn chat này?' : 'Are you sure you want to delete this entire chat?')) {
      deleteChatMutation.mutate();
    }
  };
  
  const { data: targetProfile } = useQuery({
    queryKey: ['profile', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return null;
      const { data } = await supabase.from('profiles').select('id, full_name, avatar_url').eq('id', activeChatId).single();
      return data;
    },
    enabled: !!activeChatId && !chats.some(c => c.id === activeChatId)
  });

  // Call Modal State
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  
  // Media & Info State
  const [isUploading, setIsUploading] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) || (targetProfile ? {
    id: targetProfile.id,
    name: targetProfile.full_name || 'Người dùng',
    avatar: targetProfile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200',
    isOnline: true,
    lastActive: undefined,
    lastMessage: 'Hãy là người đầu tiên gửi tin nhắn',
    time: '',
    unread: 0
  } : undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!user?.id) return;

    const channel = messageService.subscribeToMessages(user.id, () => {
      // Invalidate queries to fetch new messages and update recent chats
      queryClient.invalidateQueries({ queryKey: ['messages', user.id] });
      queryClient.invalidateQueries({ queryKey: ['recentChats', user.id] });
    });

    return () => {
      if (channel) {
        import('@/lib/supabase').then(({ supabase }) => supabase.removeChannel(channel));
      }
    };
  }, [user?.id, queryClient]);

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
    if (!inputMessage.trim() && !isUploading) return;
    if (!activeChatId) return;

    if (editingMessageId) {
      updateMessageMutation.mutate({ messageId: editingMessageId, content: inputMessage.trim() });
    } else {
      sendMessageMutation.mutate({ content: inputMessage });
      setInputMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChatId) return;

    setIsUploading(true);
    const media = await messageService.uploadChatMedia(file);
    if (media) {
      sendMessageMutation.mutate({ content: 'Đã gửi một tệp đính kèm', mediaUrl: media.url, mediaType: media.type });
    }
    setIsUploading(false);
  };

  const handleReaction = async (messageId: string, reaction: string) => {
    if (!user?.id) return;
    // Optimistic update could go here
    await messageService.reactToMessage(messageId, user.id, reaction);
    queryClient.invalidateQueries({ queryKey: ['messages', user.id, activeChatId] });
  };

  const handleStartCall = (video: boolean) => {
    setIsVideoCall(video);
    setIsCallModalOpen(true);
  };

  const isEmojiOnly = (str: string) => {
    return str.trim().length > 0 && /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u.test(str.trim());
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const { data: friendsData } = useQuery({
    queryKey: ['friends', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const data = await friendService.fetchFriendData(user.id);
      return data.friends.map(f => ({
        id: f.id,
        name: f.full_name || 'Người dùng',
        avatar: f.avatar_url || '',
        username: `@${(f.full_name || 'user').toLowerCase().replace(/\s+/g, '')}`
      }));
    },
    enabled: !!user?.id && isNewChatModalOpen
  });
  
  const handleEditMessage = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setInputMessage(msg.content);
  };
  
  const handleDeleteMessage = (msgId: string) => {
    if (window.confirm(language === 'vi' ? 'Bạn có chắc chắn muốn xóa tin nhắn này?' : 'Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(msgId);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-0px)] bg-white dark:bg-black rounded-tl-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 m-2 lg:m-4">
      {/* ── Left Sidebar (Chat List) ── */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-card ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'vi' ? 'Đoạn chat' : 'Chats'}
            </h1>
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
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
                <UserAvatar src={chat.avatar} name={chat.name} className="w-14 h-14 text-xl" />
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
                  <UserAvatar src={activeChat.avatar} name={activeChat.name} className="w-10 h-10 text-sm" />
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
                <button onClick={() => setShowInfoPanel(!showInfoPanel)} className={`p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block ${showInfoPanel ? 'bg-gray-100 dark:bg-white/10 text-[#ff3131]' : 'text-gray-500 dark:text-gray-400'}`}>
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
                          {showAvatar && <UserAvatar src={activeChat.avatar} name={activeChat.name} className="w-7 h-7 text-[10px]" />}
                        </div>
                      )}
                      
                      <div className={`relative group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl ${
                          msg.media_type === 'system_call'
                            ? isMe ? 'bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-br-sm' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                            : isEmojiOnly(msg.content) && !msg.media_url
                              ? 'bg-transparent text-5xl p-0'
                              : isMe 
                                ? 'bg-[#ff3131] text-white rounded-br-sm shadow-sm' 
                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-100 dark:border-white/5 shadow-sm'
                        }`}>
                          {msg.media_type === 'system_call' ? (
                            <div 
                              className="flex items-center gap-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => handleStartCall(msg.content.includes('video'))}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                msg.content.includes('lỡ') || msg.content.includes('từ chối')
                                  ? 'bg-red-100 text-red-500 dark:bg-red-900/30'
                                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                {msg.content.includes('lỡ') || msg.content.includes('từ chối') ? (
                                  <PhoneMissed size={20} />
                                ) : (
                                  <PhoneCall size={20} />
                                )}
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="font-semibold text-sm">{msg.content}</span>
                                <span className="text-xs opacity-70 mt-0.5">
                                  Nhấn để gọi lại
                                </span>
                              </div>
                            </div>
                          ) : msg.media_url ? (
                            <div className="mb-2">
                              {msg.media_type === 'image' ? (
                                <a href={msg.media_url} target="_blank" rel="noreferrer" className="block cursor-pointer hover:opacity-90 transition-opacity">
                                  <ImageWithFallback src={msg.media_url} alt="Attachment" className="max-w-[200px] sm:max-w-[250px] rounded-xl object-cover border border-white/10" />
                                </a>
                              ) : (
                                <a href={msg.media_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-black/10 dark:bg-white/10 rounded-xl hover:bg-black/20 dark:hover:bg-white/20 transition-colors mt-1">
                                  <Paperclip size={20} className={isMe ? "text-white" : "text-blue-500"} />
                                  <span className="underline break-all font-medium text-sm">
                                    Tải xuống tệp đính kèm
                                  </span>
                                </a>
                              )}
                            </div>
                          ) : null}
                          
                          
                          {msg.media_type !== 'system_call' && (
                            <p className={`${isEmojiOnly(msg.content) && !msg.media_url ? 'text-5xl leading-none' : 'text-sm whitespace-pre-wrap break-words leading-relaxed'}`}>
                              {msg.content}
                            </p>
                          )}
                        </div>
                        
                        {/* Reaction and Edit/Delete Buttons on Hover */}
                        <div className={`absolute top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMe ? '-left-32' : '-right-20'}`}>
                          {isMe && (
                            <>
                              <button
                                onClick={() => handleEditMessage(msg)}
                                className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow hover:scale-110 transition-transform text-gray-600 dark:text-gray-300"
                                title={language === 'vi' ? "Chỉnh sửa" : "Edit"}
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow hover:scale-110 transition-transform text-red-500"
                                title={language === 'vi' ? "Xóa" : "Delete"}
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                          {['❤️', '👍', '😂'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-700 rounded-full shadow hover:scale-110 transition-transform text-xs"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* Display Reactions */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className={`absolute -bottom-2 ${isMe ? 'right-2' : 'left-2'} flex items-center gap-0.5 z-10 px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-md text-[11px] scale-90 origin-bottom`}>
                            {Object.entries(msg.reactions).map(([reaction, users]) => (
                              <span key={reaction} className="flex items-center">
                                {reaction} {users.length > 1 && <span className="ml-0.5 font-medium text-gray-500">{users.length}</span>}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Timestamp & Status */}
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
                <input 
                  type="file" 
                  ref={imageInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <input 
                  type="file" 
                  ref={docInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
                />
                <div className="flex gap-1 text-[#ff3131] pb-1.5 hidden sm:flex">
                  <button type="button" onClick={() => docInputRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><Paperclip size={20} /></button>
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
                </div>
                
                <div className="flex-1 relative bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center border border-transparent focus-within:border-gray-300 dark:focus-within:border-gray-600 transition-colors">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={editingMessageId ? (language === 'vi' ? "Sửa tin nhắn..." : "Edit message...") : (language === 'vi' ? "Aa" : "Message...")}
                    className="flex-1 bg-transparent px-4 py-3 focus:outline-none text-sm text-gray-900 dark:text-white max-h-32"
                    autoComplete="off"
                  />
                  {editingMessageId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMessageId(null);
                        setInputMessage("");
                      }}
                      className="p-1 mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className={`p-2 mr-1 rounded-full transition-colors ${showEmojiPicker ? 'bg-gray-200 dark:bg-gray-700 text-[#ff3131]' : 'text-[#ff3131] hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                      <Smile size={20} />
                    </button>
                    
                    {showEmojiPicker && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowEmojiPicker(false)}
                        />
                        <div className="absolute bottom-full right-0 mb-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-3 w-72 sm:w-80 z-50">
                          <h4 className="text-xs font-semibold text-gray-500 mb-2 px-1">Biểu tượng cảm xúc</h4>
                          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                            {EMOJI_LIST.map((emoji, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => {
                                  setInputMessage(prev => prev + emoji);
                                }}
                                className="text-xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center justify-center p-1.5"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isUploading || (!inputMessage.trim() && !isUploading)}
                  className={`p-3 mb-0.5 rounded-full transition-all transform hover:scale-105 active:scale-95 ${
                    inputMessage.trim() || isUploading 
                      ? "bg-[#ff3131] text-white hover:bg-[#ff1f1f]" 
                      : "bg-gray-200 text-gray-400 dark:bg-gray-700 cursor-not-allowed"
                  }`}
                >
                  {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20} />}
                </button>
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

      {/* Right Info Panel */}
      {showInfoPanel && activeChat && (
        <div className="absolute right-0 top-0 bottom-0 z-30 shadow-2xl xl:static xl:shadow-none xl:z-0 w-72 md:w-80 shrink-0 border-l border-gray-200 dark:border-white/10 flex flex-col bg-white dark:bg-card">
          <div className="p-4 flex justify-between items-center xl:hidden border-b border-gray-200 dark:border-white/10">
            <h3 className="font-bold text-gray-900 dark:text-white">{language === 'vi' ? 'Thông tin' : 'Details'}</h3>
            <button onClick={() => setShowInfoPanel(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <div className="p-6 flex flex-col items-center border-b border-gray-200 dark:border-white/10">
            <UserAvatar src={activeChat.avatar} name={activeChat.name} className="w-24 h-24 mb-4 text-3xl" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">{activeChat.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{activeChat.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</p>
            
            <div className="flex gap-4">
              <button onClick={() => handleStartCall(false)} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Phone size={18} />
              </button>
              <button onClick={() => handleStartCall(true)} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Video size={18} />
              </button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{language === 'vi' ? 'Tùy chỉnh đoạn chat' : 'Chat Settings'}</h4>
            <div className="space-y-1 mb-6">
              <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <span className="flex items-center gap-3"><Palette size={18} className="text-gray-400" /> {language === 'vi' ? 'Đổi chủ đề' : 'Change theme'}</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <span className="flex items-center gap-3"><Smile size={18} className="text-gray-400" /> {language === 'vi' ? 'Biểu tượng cảm xúc' : 'Emoji'}</span>
                <span className="text-xl">👍</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                <span className="flex items-center gap-3"><Type size={18} className="text-gray-400" /> {language === 'vi' ? 'Chỉnh sửa biệt danh' : 'Edit nicknames'}</span>
              </button>
              <button onClick={handleDeleteChat} className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                <span className="flex items-center gap-3"><Trash2 size={18} /> {language === 'vi' ? 'Xóa đoạn chat' : 'Delete chat'}</span>
              </button>
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-white mt-6 mb-3">{language === 'vi' ? 'File phương tiện' : 'Media files'}</h4>
            <div className="grid grid-cols-3 gap-2">
              {messages.filter(m => m.media_url && m.media_type === 'image').slice(0, 6).map(m => (
                <div key={m.id} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={m.media_url} alt="Media" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call Modal Overlay */}
      {activeChat && (
        <CallModal 
          isOpen={isCallModalOpen} 
          onClose={() => setIsCallModalOpen(false)} 
          callerName={activeChat.name}
          callerAvatar={activeChat.avatar}
          isVideoCall={isVideoCall}
          targetId={activeChat.id}
        />
      )}

      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{language === 'vi' ? 'Tạo tin nhắn mới' : 'New Message'}</h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              {!friendsData || friendsData.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{language === 'vi' ? 'Chưa có bạn bè nào để nhắn tin.' : 'No friends available.'}</p>
              ) : (
                <div className="space-y-2">
                  {friendsData.map(friend => (
                    <button
                      key={friend.id}
                      onClick={() => {
                        setActiveChatId(friend.id);
                        setIsNewChatModalOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left"
                    >
                      <UserAvatar src={friend.avatar} name={friend.name} className="w-12 h-12" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{friend.name}</p>
                        <p className="text-xs text-gray-500">{friend.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
