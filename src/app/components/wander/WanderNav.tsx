import { Link, useLocation } from "react-router";
import { Search, Menu, X, User, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { WanderLogo } from "./WanderLogo";

const NAV_LINKS = [
  { to: "/", label: "Trang Chủ" },
  { to: "/create", label: "Tạo Nhật Ký" },
  { to: "/create-itinerary", label: "Tạo Lịch Trình" },
  { to: "/guide", label: "Cách Sử Dụng", icon: true },
  { to: "/partner", label: "Chọn Gói" },
];

export function WanderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // ── Smooth scroll to top on every route change ──
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;
  const showIndicator = (path: string) => path !== "/" && isActive(path);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <WanderLogo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex flex-col items-center pb-1 font-medium transition-colors ${
                  isActive(to) ? "text-[#ff3131]" : "text-gray-700 hover:text-[#ff3131]"
                }`}
              >
                <span className="flex items-center gap-1">
                  {icon && <HelpCircle size={18} />}
                  {label}
                </span>

                {/* Gradient indicator pill */}
                {showIndicator(to) && (
                  <span
                    className="absolute -bottom-[17px] left-1/2 -translate-x-1/2 h-[4px] rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] transition-all duration-300"
                    style={{ width: "70%" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-700 hover:text-[#ff3131] transition-colors">
              <Search size={20} />
            </button>
            <Link
              to="/login"
              className={`font-medium transition-colors ${
                isActive("/login") ? "text-[#ff3131]" : "text-gray-700 hover:text-[#ff3131]"
              }`}
            >
              Đăng Nhập
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full hover:shadow-lg transition-all"
            >
              <User size={18} />
              <span>Đăng Ký</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-200">
            {NAV_LINKS.map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive(to)
                    ? "bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10 text-[#ff3131]"
                    : "text-gray-700 hover:text-[#ff3131] hover:bg-gray-50"
                }`}
              >
                {icon && <HelpCircle size={16} />}
                {isActive(to) && (
                  <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#ff3131] to-[#ff914d] mr-1" />
                )}
                {label}
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100 space-y-1">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl font-medium transition-all ${
                  isActive("/login")
                    ? "text-[#ff3131] bg-gradient-to-r from-[#ff3131]/10 to-[#ff914d]/10"
                    : "text-gray-700 hover:text-[#ff3131] hover:bg-gray-50"
                }`}
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-[#ff3131] hover:bg-gradient-to-r hover:from-[#ff3131]/10 hover:to-[#ff914d]/10 transition-all"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
