import { Link } from "react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuthStore, useLanguageStore } from "@/stores";

export function WanderRegister() {
  const { t, language } = useLanguageStore();
  const { register: registerUser, loginWithGoogle, loginWithFacebook, isLoading } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(language === 'vi' ? "Mật khẩu xác nhận không khớp" : "Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError(language === 'vi' ? "Mật khẩu phải có ít nhất 6 ký tự" : "Password must be at least 6 characters");
      return;
    }

    try {
      await registerUser(formData.email, formData.password, formData.fullName);
      setIsSuccess(true); // Show success screen
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đăng ký thất bại";
      if (message.includes("already registered") || message.includes("already been registered")) {
        setError(language === 'vi' ? "Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác." : "This email is already registered. Please log in or use another email.");
      } else if (message.includes("valid email")) {
        setError(language === 'vi' ? "Vui lòng nhập địa chỉ email hợp lệ" : "Please enter a valid email address");
      } else if (message.includes("at least")) {
        setError(language === 'vi' ? "Mật khẩu phải có ít nhất 6 ký tự" : "Password must be at least 6 characters");
      } else {
        setError(message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      setError(language === 'vi' ? "Đăng nhập Google thất bại" : "Google sign-in failed");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch {
      setError(language === 'vi' ? "Đăng nhập Facebook thất bại" : "Facebook sign-in failed");
    }
  };

  // Success screen after registration
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <WanderLogo size="lg" />
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {language === 'vi' ? 'Đăng Ký Thành Công!' : 'Registration Successful!'}
            </h1>
            <p className="text-gray-600 mb-2">
              {language === 'vi' ? 'Chúng tôi đã gửi email xác minh đến:' : 'We have sent a verification email to:'}
            </p>
            <p className="font-semibold text-[#ff3131] text-lg mb-6">{formData.email}</p>
            <div className="bg-[#FFF5F3] rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-700">
                {language === 'vi'
                  ? '📧 Vui lòng kiểm tra hộp thư (cả thư rác) và nhấn link xác minh. Sau khi xác minh, bạn có thể đăng nhập.'
                  : '📧 Please check your inbox (including spam folder) and click the verification link. Once verified, you can log in.'}
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center"
            >
              {language === 'vi' ? 'Đi Đến Trang Đăng Nhập' : 'Go to Login Page'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <WanderLogo size="lg" />
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("signUp", "auth")}
            </h1>
            <p className="text-gray-600">
              {language === 'vi' ? 'Bắt đầu hành trình khám phá cùng chúng tôi' : 'Start your journey of discovery with us'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("fullName", "auth")}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={language === 'vi' ? 'Nguyễn Văn An' : 'John Doe'}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  placeholder="email@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
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
                  placeholder={language === 'vi' ? 'Ít nhất 6 ký tự' : 'At least 6 characters'}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
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

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("confirmPassword", "auth")}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder={language === 'vi' ? 'Nhập lại mật khẩu' : 'Re-enter password'}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#ff3131] border-gray-300 rounded focus:ring-[#ff3131]"
              />
              <span className="text-sm text-gray-600">
                {language === 'vi' ? 'Tôi đồng ý với ' : 'I agree to the '}
                <a href="#" className="text-[#ff3131] hover:underline font-semibold">
                  {language === 'vi' ? 'Điều Khoản' : 'Terms'}
                </a>
                {language === 'vi' ? ' và ' : ' and '}
                <a href="#" className="text-[#ff3131] hover:underline font-semibold">
                  {language === 'vi' ? 'Chính Sách Bảo Mật' : 'Privacy Policy'}
                </a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {language === 'vi' ? 'Đang tạo tài khoản...' : 'Creating account...'}
                </>
              ) : (
                t("signUp", "auth")
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t("haveAccount", "auth")}{" "}
              <Link to="/login" className="font-semibold text-[#ff3131] hover:text-[#ff914d]">
                {t("signIn", "auth")}
              </Link>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {language === 'vi' ? 'Hoặc đăng ký với' : 'Or sign up with'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-semibold text-gray-700">Google</span>
              </button>
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-semibold text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}