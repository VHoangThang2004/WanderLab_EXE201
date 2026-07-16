import { Link, useLocation, useNavigate } from "react-router";
import { 
  Users, 
  PlusSquare, 
  Route, 
  CreditCard, 
  Home,
  User,
  Menu,
  X,
  ShieldCheck,
  LogIn,
  LogOut,
  Compass,
  Settings,
  Bell,
  MessageCircle,
  Bot,
  FileText,
  Sparkles,
  Book,
  Activity,
  Globe2,
  Download,
  Smartphone
} from "lucide-react";
import { useState } from "react";
import { WanderLogo } from "./WanderLogo";
import { useAuthStore, useLanguageStore, useUIStore } from "@/stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/api/notificationService";
import { messageService } from "@/api/messageService";
import { supabase } from "@/lib/supabase";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function WanderSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, t } = useLanguageStore();
  
  const queryClient = useQueryClient();
  const { data: dbNotifications = [] } = useQuery({
    queryKey: ['globalNotifications', user?.id],
    queryFn: () => notificationService.fetchNotifications(user?.id || ''),
    enabled: !!user?.id
  });

  const locationRef = useRef(location);
  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    if (!user?.id) return;
    
    // Notifications Subscription
    const notifChannel = notificationService.subscribeToNotifications(user.id, () => {
      queryClient.invalidateQueries({ queryKey: ['globalNotifications', user.id] });
    });
    
    // Global Messages Subscription
    const msgChannel = messageService.subscribeToMessages(user.id, async (payload) => {
      const newMsg = payload.new;
      if (payload.eventType === 'INSERT' && newMsg && newMsg.receiver_id === user.id) {
        
        // Don't show toast if user is on the messages page (they can see the unread badge or chat)
        const currentLoc = locationRef.current;
        if (currentLoc.pathname.includes('/messages')) {
          // If they are on messages page, the Messages component handles invalidation
          return;
        }

        const { data: sender } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', newMsg.sender_id).single();
        if (sender) {
          toast(
            <div 
              className="flex items-center gap-3 w-full cursor-pointer" 
              onClick={() => {
                toast.dismiss();
                navigate(`/messages?userId=${newMsg.sender_id}`);
              }}
            >
              <img src={sender.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200'} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" alt="avatar" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{sender.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  {newMsg.media_type === 'system_call' ? '📞 Cuộc gọi' : newMsg.media_url ? '📎 Tệp đính kèm' : newMsg.content}
                </p>
              </div>
            </div>, 
            { 
              duration: 5000,
              position: 'top-right',
              className: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl rounded-xl'
            }
          );
        }
      }
    });

    return () => {
      if (notifChannel) supabase.removeChannel(notifChannel);
      if (msgChannel) supabase.removeChannel(msgChannel);
    };
  }, [user?.id, queryClient, navigate]);

  const unreadCount = dbNotifications.filter(n => !n.is_read).length;

  const isAdmin = user?.role === 'admin';

  const navItems = isAdmin
    ? [
        { icon: Activity, label: "Tổng Quan", path: "/admin-dashboard", public: false },
        { icon: Users, label: "Người Dùng", path: "/admin-dashboard?tab=users", public: false },
        { icon: FileText, label: "Kiểm Duyệt Nội Dung", path: "/admin-dashboard?tab=content", public: false },
        { icon: Sparkles, label: "AI & Dữ Liệu", path: "/admin-dashboard?tab=ai", public: false },
      ]
    : [
        { icon: Home, label: t("home"), path: "/", public: true },
        { icon: Users, label: t("friends"), path: "/friends", public: false },
        { icon: Globe2, label: language === 'vi' ? "Cách Sử Dụng" : "How to Use", path: "/guide", public: true },
        { icon: PlusSquare, label: t("createDiary"), path: "/create", public: false },
        { icon: Book, label: language === 'vi' ? "Cuốn Nhật Ký" : "Diary Book", path: "/diary-book", public: false },
        { icon: Route, label: t("createItinerary"), path: "/create-itinerary", public: false },
        { icon: MessageCircle, label: language === 'vi' ? "Nhắn Tin" : "Messages", path: "/messages", public: false },
        { icon: CreditCard, label: t("selectPlan"), path: "/partner", public: false },
      ];

  const isActive = (path: string) => {
    const [pathname, search] = path.split('?');
    if (pathname === "/") {
      return location.pathname === "/";
    }
    if (pathname === "/admin-dashboard") {
      const currentSearch = location.search.replace('?', '');
      const targetSearch = search || '';
      return location.pathname === pathname && currentSearch === targetSearch;
    }
    if (path === "/create" || path === "/create-itinerary") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(pathname);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-4 py-3 z-50 flex items-center justify-between">
        <WanderLogo size="sm" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-sidebar-accent text-sidebar-foreground rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 dark:bg-black/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-gray-100 z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-sidebar-border">
            <WanderLogo size="lg" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              // Show public items always, private items only when authenticated
              if (!item.public && !isAuthenticated) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                    active
                      ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-lg shadow-[#ff3131]/30 hover:shadow-xl hover:scale-105"
                      : "hover:bg-[#FFF5F3]/50 dark:hover:bg-white/5 hover:text-[#ff3131] hover:scale-[1.02]"
                  }`}
                >
                  <Icon size={22} className={active ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-[#ff3131]"} />
                  <span>{item.label}</span>
                  {item.path === "/notifications" && unreadCount > 0 && (
                    <div className={`absolute right-4 px-2 py-0.5 rounded-full text-xs font-bold ${active ? 'bg-white text-[#ff3131]' : 'bg-[#ff3131] text-white'}`}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
          


          {/* User & Settings Section */}
          <div className="p-4 border-t border-sidebar-border">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                {/* User info */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-sidebar-accent transition-all"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#ff3131]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] flex items-center justify-center text-white font-bold text-lg">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.full_name}</p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
                  </div>
                </Link>
                
                {/* 3 Action Icons Row */}
                <div className="flex items-center justify-around pt-3 border-t border-sidebar-border mt-2">
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2.5 text-sidebar-foreground/70 hover:text-[#ff3131] hover:bg-sidebar-accent rounded-xl transition-all"
                    title={language === 'vi' ? 'Cài đặt' : 'Settings'}
                  >
                    <Settings size={22} />
                  </Link>

                  <Link
                    to="/notifications"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative p-2.5 text-sidebar-foreground/70 hover:text-[#ff3131] hover:bg-sidebar-accent rounded-xl transition-all"
                    title={language === 'vi' ? 'Thông báo' : 'Notifications'}
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ff3131] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-sidebar">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2.5 text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                    title={language === 'vi' ? 'Đăng xuất' : 'Logout'}
                  >
                    <LogOut size={22} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <LogIn size={18} />
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#ff3131] text-[#ff3131] rounded-xl font-semibold hover:bg-sidebar-accent transition-all"
                >
                  {t("register")}
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-sidebar-foreground/60 hover:text-[#ff3131] transition-all"
                >
                  <Settings size={14} />
                  <span>{language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}</span>
                </Link>
              </div>
            )}
          </div>

          {/* App Download Banner */}
          <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800/80 dark:to-gray-900 rounded-2xl border border-orange-100 dark:border-gray-700 shadow-sm relative overflow-hidden group mt-auto">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-[#ff3131]/20 to-[#ff914d]/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-1.5">
              <Smartphone size={16} className="text-[#ff3131]" />
              {language === 'vi' ? 'Trải nghiệm mượt mà hơn' : 'Better experience'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-tight">
              {language === 'vi' ? 'Tải ứng dụng WanderLab trên điện thoại' : 'Download WanderLab app on your phone'}
            </p>
            <div className="flex flex-col gap-2.5">
              {/* Google Play Button */}
              <a 
                href="https://play.google.com/store/apps/details?id=com.wanderlab.mobile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full py-2 px-3 bg-black dark:bg-black text-white rounded-xl border border-gray-800 hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" className="w-6 h-6 object-contain" />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[9px] uppercase tracking-wider text-gray-300 font-medium leading-[1]">
                    {language === 'vi' ? 'Tải ứng dụng trên' : 'Get it on'}
                  </span>
                  <span className="text-[15px] font-semibold leading-tight tracking-tight font-sans">
                    Google Play
                  </span>
                </div>
              </a>
              
              {/* APK Button */}
              <a 
                href="/assets/WanderLab.apk" 
                download
                className="flex items-center gap-3 w-full py-2 px-3 bg-black dark:bg-black text-white rounded-xl border border-gray-800 hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm"
              >
                <div className="w-6 h-6 flex items-center justify-center bg-[#3DDC84] rounded-full shrink-0">
                  <Download size={14} className="text-black stroke-[3]" />
                </div>
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[9px] uppercase tracking-wider text-gray-300 font-medium leading-[1]">
                    {language === 'vi' ? 'Tải file cài đặt' : 'Download file'}
                  </span>
                  <span className="text-[15px] font-semibold leading-tight tracking-tight font-sans">
                    Android APK
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </aside>

    </>
  );
}