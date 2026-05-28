import { Link } from "react-router";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { WanderLogo } from "./WanderLogo";

export function WanderFooter() {
  return (
    <footer className="bg-[#FFF5F3] border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <WanderLogo size="sm" />
            <p className="text-gray-600 text-sm">
              Khám phá trải nghiệm du lịch thật. Lên kế hoạch tự tin.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-600 hover:text-[#ff3131] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#ff3131] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#ff3131] transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-[#ff3131] transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Công Ty</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Tuyển Dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Báo Chí
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Tài Nguyên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Khám Phá Nhật Ký
                </Link>
              </li>
              <li>
                <Link to="/guide" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Hướng Dẫn Sử Dụng
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Đối Tác Với Chúng Tôi
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Trung Tâm Hỗ Trợ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Cộng Đồng
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Pháp Lý</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Chính Sách Bảo Mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Điều Khoản Dịch Vụ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Chính Sách Cookie
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#ff3131] text-sm transition-colors">
                  Liên Hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-600">
          © 2026 WanderLab. Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
}