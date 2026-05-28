import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuthStore } from "@/stores";

const travelPreferences = {
  styles: [
    { id: "adventure", label: "Trekking & Leo Núi", icon: "🏔️" },
    { id: "beach", label: "Biển & Đảo", icon: "🏖️" },
    { id: "culture", label: "Văn Hoá & Di Sản", icon: "🏛️" },
    { id: "food", label: "Ẩm Thực & Culinary", icon: "🍜" },
    { id: "nature", label: "Thiên Nhiên & Sinh Thái", icon: "🌿" },
    { id: "city", label: "Khám Phá Đô Thị", icon: "🏙️" },
  ],
  budgets: [
    { id: "budget", label: "Tiết Kiệm", range: "Dưới 3.000.000₫" },
    { id: "moderate", label: "Vừa Phải", range: "3.000.000₫ – 8.000.000₫" },
    { id: "comfort", label: "Thoải Mái", range: "8.000.000₫ – 20.000.000₫" },
    { id: "luxury", label: "Cao Cấp", range: "Trên 20.000.000₫" },
  ],
  durations: [
    { id: "short", label: "Cuối Tuần (2-3 ngày)" },
    { id: "week", label: "Một Tuần (4-7 ngày)" },
    { id: "extended", label: "Dài Ngày (8-14 ngày)" },
    { id: "long", label: "Dài Hạn (15+ ngày)" },
  ],
};

export function WanderRegister() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle, loginWithFacebook, isLoading } = useAuthStore();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedStyles: [] as string[],
    selectedBudget: "",
    selectedDuration: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      // Validate passwords match before moving to step 2
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return;
      }
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Step 3: Actually register
      try {
        await registerUser(formData.email, formData.password, formData.fullName);
        navigate("/dashboard");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Đăng ký thất bại";
        if (message.includes("already registered")) {
          setError("Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.");
        } else {
          setError(message);
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      setError("Đăng nhập Google thất bại");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch {
      setError("Đăng nhập Facebook thất bại");
    }
  };

  const toggleStyle = (styleId: string) => {
    if (formData.selectedStyles.includes(styleId)) {
      setFormData({ ...formData, selectedStyles: formData.selectedStyles.filter((id) => id !== styleId) });
    } else {
      setFormData({ ...formData, selectedStyles: [...formData.selectedStyles, styleId] });
    }
  };

  const progressPercentage = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <WanderLogo size="lg" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Bước {step} / 3</span>
            <span className="text-sm font-medium text-[#ff3131]">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo Tài Khoản</h1>
                  <p className="text-gray-600">Bắt đầu hành trình khám phá cùng chúng tôi</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Họ và Tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Nguyễn Văn An"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Địa Chỉ Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Mật Khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Tạo mật khẩu mạnh (ít nhất 6 ký tự)"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
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
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Xác Nhận Mật Khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Nhập lại mật khẩu"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
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

                {/* Social login options on step 1 */}
                <div className="pt-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Hoặc đăng ký với</span>
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
            )}

            {/* Step 2: Travel Preferences */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Sở Thích Du Lịch</h1>
                  <p className="text-gray-600">Giúp chúng tôi cá nhân hoá trải nghiệm của bạn</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Bạn thích loại hình du lịch nào? (Chọn tất cả phù hợp)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {travelPreferences.styles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => toggleStyle(style.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          formData.selectedStyles.includes(style.id)
                            ? "border-[#ff3131] bg-[#FFF5F3]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{style.icon}</span>
                        <span className="font-medium text-gray-900 text-sm">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Ngân Sách Thường Dùng Cho Mỗi Chuyến Đi
                  </label>
                  <div className="space-y-2">
                    {travelPreferences.budgets.map((budget) => (
                      <button
                        key={budget.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, selectedBudget: budget.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          formData.selectedBudget === budget.id
                            ? "border-[#ff3131] bg-[#FFF5F3]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{budget.label}</p>
                          <p className="text-sm text-gray-600">{budget.range}</p>
                        </div>
                        {formData.selectedBudget === budget.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Trip Duration & Finish */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Sắp Xong Rồi!</h1>
                  <p className="text-gray-600">Một sở thích nữa để cá nhân hoá bảng tin của bạn</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Thời Gian Chuyến Đi Ưa Thích
                  </label>
                  <div className="space-y-2">
                    {travelPreferences.durations.map((duration) => (
                      <button
                        key={duration.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, selectedDuration: duration.id })}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                          formData.selectedDuration === duration.id
                            ? "border-[#ff3131] bg-[#FFF5F3]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{duration.label}</p>
                        {formData.selectedDuration === duration.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-2">🎉 Tất Cả Đã Sẵn Sàng!</h3>
                  <p className="text-sm text-gray-600">
                    Dựa trên sở thích của bạn, chúng tôi sẽ gợi ý những chuyến đi được cá nhân hoá và kết nối bạn với những người có cùng đam mê khám phá.
                  </p>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 w-4 h-4 text-[#ff3131] border-gray-300 rounded focus:ring-[#ff3131]"
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đồng ý với{" "}
                    <a href="#" className="text-[#ff3131] hover:underline font-semibold">Điều Khoản Dịch Vụ</a> và{" "}
                    <a href="#" className="text-[#ff3131] hover:underline font-semibold">Chính Sách Bảo Mật</a> của WanderLab
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <ChevronLeft size={20} />
                  Quay Lại
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 3 && isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang tạo...
                  </>
                ) : step === 3 ? (
                  "Tạo Tài Khoản"
                ) : (
                  "Tiếp Tục"
                )}
                {!isLoading && <ChevronRight size={20} />}
              </button>
            </div>
          </form>

          {step === 1 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-semibold text-[#ff3131] hover:text-[#ff914d]">
                  Đăng nhập
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}