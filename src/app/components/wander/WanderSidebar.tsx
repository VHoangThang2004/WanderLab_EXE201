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
  Activity,
  FileText,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { WanderLogo } from "./WanderLogo";
import { useAuthStore, useLanguageStore, useUIStore, useNotificationStore } from "@/stores";

export function WanderSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, t } = useLanguageStore();
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        { icon: Compass, label: t("explore"), path: "/explore", public: true },
        { icon: Users, label: t("friends"), path: "/friends", public: false },
        { icon: PlusSquare, label: t("createDiary"), path: "/create", public: false },
        { icon: Route, label: t("createItinerary"), path: "/create-itinerary", public: false },
        { icon: MessageCircle, label: language === 'vi' ? "Nhắn Tin" : "Messages", path: "/messages", public: false },
        { icon: Bot, label: language === 'vi' ? "AI Trợ Lý" : "AI Assistant", path: "/chat", public: false },
        { icon: Users, label: language === 'vi' ? "Hội Nhóm" : "Groups", path: "/groups/1", public: false },
        { icon: CreditCard, label: t("selectPlan"), path: "/partner", public: true },
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
        </div>
      </aside>

    </>
  );
}