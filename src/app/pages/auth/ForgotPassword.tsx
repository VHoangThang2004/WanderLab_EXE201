import { Link } from "react-router";
import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuthStore } from "@/stores";

export function ForgotPassword() {
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <WanderLogo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quên Mật Khẩu?</h1>
            <p className="text-gray-600">Đừng lo! Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center">
              <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-medium mb-2">Đã gửi liên kết khôi phục!</p>
                <p className="text-sm text-green-600">
                  Vui lòng kiểm tra hòm thư của bạn (bao gồm cả thư rác) và làm theo hướng dẫn để tạo mật khẩu mới.
                </p>
              </div>
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-[#ff3131] hover:text-[#ff5e3a] font-semibold transition-colors"
              >
                <ArrowLeft size={16} />
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Địa Chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Đang Gửi...
                  </>
                ) : (
                  "Gửi Liên Kết"
                )}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-semibold transition-colors"
                >
                  <ArrowLeft size={16} />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
