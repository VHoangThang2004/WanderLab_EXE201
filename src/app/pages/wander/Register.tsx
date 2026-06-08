import { Link } from "react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Loader2, CheckCircle } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuthStore, useLanguageStore } from "@/stores";

export function WanderRegister() {
  const { t, language } = useLanguageStore();
  const { register: registerUser, isLoading } = useAuthStore();

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


        </div>
      </div>
    </div>
  );
}