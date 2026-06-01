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
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";
import { WanderLogo } from "./WanderLogo";
import { useAuthStore, useLanguageStore, useThemeStore } from "@/stores";

export function WanderSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme } = useThemeStore();

  const navItems = [
    { icon: Home, label: t("home"), path: "/", public: true },
    { icon: Compass, label: t("explore"), path: "/explore", public: true },
    { icon: Users, label: t("friends"), path: "/friends", public: false },
    { icon: PlusSquare, label: t("createDiary"), path: "/create", public: false },
    { icon: Route, label: t("createItinerary"), path: "/create-itinerary", public: false },
    { icon: CreditCard, label: t("selectPlan"), path: "/partner", public: true },
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
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#030213] border-b border-gray-200 dark:border-gray-800 px-4 py-3 z-50 flex items-center justify-between transition-colors">
        <WanderLogo size="sm" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white rounded-lg transition-colors"
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
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-[#030213] border-r border-gray-200 dark:border-gray-800 z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
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
                      : "text-gray-700 dark:text-gray-300 hover:bg-[#FFF5F3] dark:hover:bg-gray-800 hover:text-[#ff3131] dark:hover:text-[#ff914d]"
                  }`}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme & Language Switcher */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <button
                onClick={() => setLanguage('vi')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'vi'
                    ? 'bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                {/* User info */}
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#FFF5F3] dark:hover:bg-gray-800 transition-all"
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </Link>
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <LogOut size={18} />
                  <span>{t("logout")}</span>
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#ff3131] text-[#ff3131] rounded-xl font-semibold hover:bg-[#FFF5F3] transition-all"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}