import { Link, useLocation } from "react-router";
import { 
  Users, 
  PlusSquare, 
  Route, 
  CreditCard, 
  Home,
  User,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { WanderLogo } from "./WanderLogo";

export function WanderSidebar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Trang Chủ", path: "/" },
    { icon: Users, label: "Bạn Bè", path: "/friends" },
    { icon: PlusSquare, label: "Tạo Nhật Ký", path: "/create" },
    { icon: Route, label: "Tạo Lịch Trình", path: "/create-itinerary" },
    { icon: CreditCard, label: "Chọn Gói", path: "/partner" },
    { icon: User, label: "Dashboard", path: "/dashboard" },
    { icon: ShieldCheck, label: "Admin", path: "/admin-dashboard" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    // For exact match paths to avoid conflicts (e.g., /create vs /create-itinerary)
    if (path === "/create" || path === "/create-itinerary") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-50 flex items-center justify-between">
        <WanderLogo size="sm" />
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
        className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-100">
            <WanderLogo size="lg" />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${
                    active
                      ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white shadow-md"
                      : "text-gray-700 hover:bg-[#FFF5F3] hover:text-[#ff3131]"
                  }`}
                >
                  <Icon size={22} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-xl p-4 text-center">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                🎒 WanderLab
              </p>
              <p className="text-xs text-gray-600">
                Khám phá thế giới cùng nhau
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}