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
  Settings
} from "lucide-react";
import { useState } from "react";
import { WanderLogo } from "./WanderLogo";
import { useAuthStore, useLanguageStore, useUIStore } from "@/stores";

export function WanderSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  const navItems = [
    { icon: Home, label: t("home"), path: "/", public: true },
    { icon: Compass, label: t("explore"), path: "/explore", public: true },
    { icon: Users, label: t("friends"), path: "/friends", public: false },
    { icon: PlusSquare, label: t("createDiary"), path: "/create", public: false },
    { icon: Route, label: t("createItinerary"), path: "/create-itinerary", public: false },
    { icon: CreditCard, label: t("selectPlan"), path: "/partner", public: true },
    { icon: User, label: t("dashboard"), path: "/dashboard", public: false },
    ...(user?.role === 'admin' ? [{ icon: ShieldCheck, label: t("admin"), path: "/admin-dashboard", public: false }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/create" || path === "/create-itinerary") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border px-4 py-3 z-50 flex items-center justify-between">
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
        className={`fixed top-0 left-0 h-full w-72 bg-sidebar border-r border-sidebar-border text-sidebar-foreground z-40 transform transition-transform duration-300 ${
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
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
                    active
                      ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-md"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-[#ff3131]"
                  }`}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
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
                {/* Settings button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sidebar-foreground/80 hover:text-[#ff3131] hover:bg-sidebar-accent rounded-xl transition-all"
                >
                  <Settings size={18} />
                  <span>{language === 'vi' ? 'Cài đặt' : 'Settings'}</span>
                </button>
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
                {/* Guest Settings button */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-sidebar-foreground/60 hover:text-[#ff3131] transition-all"
                >
                  <Settings size={14} />
                  <span>{language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="bg-card border border-border text-card-foreground rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-6 relative animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                ⚙️ {language === 'vi' ? 'Cài đặt hệ thống' : 'System Settings'}
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Theme Switcher */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {language === 'vi' ? 'Giao diện tối' : 'Dark Mode'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'vi' ? 'Chuyển đổi giao diện sáng/tối' : 'Toggle light/dark theme'}
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    isDarkMode ? 'bg-gradient-to-r from-[#ff3131] to-[#ff914d]' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-card shadow-md transform transition-transform duration-200 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center justify-between py-2 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'vi' ? 'Chọn ngôn ngữ hiển thị' : 'Choose display language'}
                  </p>
                </div>
                <div className="flex bg-muted rounded-lg p-0.5 border border-border/40">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      language === 'vi'
                        ? 'bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>

            {/* Logout Area */}
            {isAuthenticated && (
              <div className="border-t border-border pt-4">
                <button
                  onClick={() => {
                    setIsSettingsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive/10 text-destructive rounded-2xl font-semibold hover:bg-destructive/20 transition-all text-sm"
                >
                  <LogOut size={18} />
                  {language === 'vi' ? 'Đăng xuất tài khoản' : 'Log Out Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}