import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuthStore, useLanguageStore } from "@/stores";

export function WanderLogin() {
  const { t, language } = useLanguageStore();
  const navigate = useNavigate();
  const { login, logout, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      
      // Get fresh user from store state after successful login
      const currentUser = useAuthStore.getState().user;
      
      if (currentUser?.role === 'admin') {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      if (message.includes("Invalid login")) {
        setError(language === 'vi' ? "Email hoặc mật khẩu không đúng" : "Invalid email or password");
      } else if (message.includes("Email not confirmed")) {
        setError(language === 'vi' ? "Vui lòng xác nhận email trước khi đăng nhập" : "Please confirm your email before logging in");
      } else {
        setError(message);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <WanderLogo size="lg" />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'vi' ? 'Chào Mừng Trở Lại' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {language === 'vi' ? 'Đăng nhập để tiếp tục hành trình của bạn' : 'Log in to continue your journey'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">


            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("email", "auth")}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("password", "auth")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-[#ff3131] border-gray-300 rounded focus:ring-[#ff3131]"
                />
                <span className="text-sm text-gray-700">
                  {language === 'vi' ? 'Ghi nhớ đăng nhập' : 'Remember me'}
                </span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-[#ff3131] hover:text-[#ff914d]">
                {t("forgotPassword", "auth")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {language === 'vi' ? 'Đang đăng nhập...' : 'Logging in...'}
                </>
              ) : (
                t("signIn", "auth")
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t("dontHaveAccount", "auth")}{" "}
              <Link to="/register" className="font-semibold text-[#ff3131] hover:text-[#ff914d]">
                {t("signUp", "auth")}
              </Link>
            </p>
          </div>


        </div>


      </div>
    </div>
  );
}