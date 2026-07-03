import { useSearchParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { Check, XCircle, ChevronLeft, Sparkles } from "lucide-react";

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const code = params.get("code");
  const cancel = params.get("cancel");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "cancelled">("loading");

  useEffect(() => {
    if (cancel === "true") {
      setStatus("cancelled");
    } else if (code === "00") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }, [code, cancel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        {status === "success" && (
          <>
            <div className="relative mx-auto w-24 h-24">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center shadow-xl">
                <Check className="text-white" size={40} strokeWidth={3} />
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full opacity-20 animate-ping" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thanh toán thành công! 🎉</h1>
              <p className="text-gray-500">Tài khoản của bạn đã được nâng cấp.</p>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-2xl font-bold hover:shadow-xl transition-all"
              >
                <Sparkles size={18} /> Đến Dashboard
              </Link>
            </div>
          </>
        )}

        {status === "cancelled" && (
          <>
            <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <XCircle className="text-orange-500" size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Đã hủy thanh toán</h1>
              <p className="text-gray-500">Bạn đã hủy giao dịch thanh toán.</p>
            </div>
            <Link
              to="/partner"
              className="flex items-center justify-center gap-2 w-full py-3 mt-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#ff3131] transition-all"
            >
              <ChevronLeft size={16} /> Quay lại trang chọn gói
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-500" size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại</h1>
              <p className="text-gray-500">Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.</p>
            </div>
            <Link
              to="/partner"
              className="flex items-center justify-center gap-2 w-full py-3 mt-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#ff3131] transition-all"
            >
              <ChevronLeft size={16} /> Quay lại trang chọn gói
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
