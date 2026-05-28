import { Link } from "react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ChevronRight, ChevronLeft } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";

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
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedStyles: [] as string[],
    selectedBudget: "",
    selectedDuration: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      window.location.href = "/dashboard";
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
                      placeholder="Tạo mật khẩu mạnh"
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
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {step === 3 ? "Tạo Tài Khoản" : "Tiếp Tục"}
                <ChevronRight size={20} />
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