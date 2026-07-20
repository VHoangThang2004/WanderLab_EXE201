import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { supabase } from "../../../lib/supabase";
import { toast } from "sonner";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useAuth } from "../../../stores/authStore";
import {
  CheckCircle2, Lock, ChevronLeft, CreditCard, Smartphone,
  Building2, Shield, Check, Sparkles, ArrowRight, Copy,
} from "lucide-react";

// ── Plan definitions ──────────────────────────────────────────
interface PlanDef {
  name: string;
  price: string;
  priceNum: number;
  period: string;
  badge?: string;
  color: string;
  features: string[];
}

const PLANS: Record<string, PlanDef> = {
  plus: {
    name: "Plus",
    price: "50.000₫",
    priceNum: 50000,
    period: "tháng",
    color: "from-[#ff3131] to-[#ff914d]",
    features: [
      "Giới hạn sử dụng gấp 2.5 lần gói Free",
      "Đính kèm video phân giải cao 1080p",
      "Trải nghiệm không quảng cáo",
      "Huy hiệu Plus nổi bật",
    ],
  },
  pro: {
    name: "Pro",
    price: "150.000₫",
    priceNum: 150000,
    period: "tháng",
    badge: "Phổ Biến Nhất",
    color: "from-[#ff3131] to-[#ff914d]",
    features: [
      "Giới hạn sử dụng gấp 2.5 lần gói Plus",
      "Đính kèm video siêu nét 2160p (4K)",
      "Trải nghiệm không quảng cáo",
      "Huy hiệu Pro đẳng cấp",
    ],
  },
};

function formatCard(v: string) {
  return v.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").substring(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

// ── Success Screen ────────────────────────────────────────────
function SuccessScreen({ plan }: { plan: PlanDef }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F3] to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center shadow-xl">
            <Check className="text-white" size={40} strokeWidth={3} />
          </div>
          <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-full opacity-20 animate-ping" />
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Thanh toán thành công! 🎉</h1>
          <p className="text-gray-500">Chào mừng bạn đến với WanderLab {plan.name}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 text-left space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-gray-200">
            <span className="font-bold text-gray-900">{plan.name} Plan</span>
            <span className="font-extrabold text-[#ff3131]">{plan.price}/{plan.period}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Mã đơn hàng</span>
            <span className="font-mono font-semibold text-gray-800">WL-{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ngày kích hoạt</span>
            <span className="font-semibold text-gray-800">{new Date().toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Gia hạn tiếp theo</span>
            <span className="font-semibold text-gray-800">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <div className="pt-3 flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 rounded-xl px-3 py-2">
            <CheckCircle2 size={16} /> Đã gửi hóa đơn đến email của bạn
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-2xl font-bold hover:shadow-xl transition-all"
          >
            <Sparkles size={18} /> Đến Dashboard của bạn
          </Link>
          <Link
            to="/partner"
            className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-[#ff3131] transition-all text-sm"
          >
            <ChevronLeft size={16} /> Quay lại trang gói
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────
export function CheckoutPage() {
  const [params] = useSearchParams();
  const planKey = params.get("plan") ?? "plus";
  const plan = PLANS[planKey] ?? PLANS.plus;

  const [payMethod, setPayMethod] = useState("payos");
  const [cardNum, setCardNum] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auth check
  const { user } = useAuth();

  if (done) return <SuccessScreen plan={plan} />;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.includes("@")) e.email = "Email không hợp lệ";
    if (payMethod === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) e.cardNum = "Số thẻ gồm 16 chữ số";
      if (!cardName.trim()) e.cardName = "Vui lòng nhập tên chủ thẻ";
      if (expiry.length < 5) e.expiry = "Định dạng MM/YY";
      if (cvv.length < 3) e.cvv = "CVV gồm 3–4 số";
    }
    return e;
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập để thanh toán.");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    if (payMethod === "payos") {
      try {
        const { data, error } = await supabase.functions.invoke("payos-create", {
          body: { planKey, returnUrl: window.location.origin }
        });
        
        if (error) {
          console.error("Invoke Error:", error);
          let errMsg = error.message;
          // Cố gắng parse nội dung lỗi thực tế từ Edge Function
          if (error.context && typeof error.context.json === 'function') {
            try {
              const errBody = await error.context.json();
              if (errBody.error) errMsg = errBody.error;
            } catch (e) {
              // Ignore parse error
            }
          }
          throw new Error(errMsg);
        }

        if (data?.checkoutUrl) {
          window.location.href = data.checkoutUrl; // Redirect to PayOS QR page
        } else {
          toast.error("Không thể tạo link thanh toán");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("PayOS Error:", err);
        toast.error(err.message || "Đã xảy ra lỗi khi tạo thanh toán");
        setLoading(false);
      }
      return;
    }

    setTimeout(() => { setLoading(false); setDone(true); }, 2000);
  };

  const tax = Math.round(plan.priceNum * 0.1);
  const total = plan.priceNum + tax;

  const paymentMethods = [
    { id: "payos", label: "VietQR (PayOS)", Icon: Smartphone },
    { id: "card", label: "Thẻ tín dụng / Ghi nợ", Icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#FFF5F3]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/partner" className="flex items-center gap-2 text-gray-500 hover:text-[#ff3131] transition-colors text-sm font-medium">
            <ChevronLeft size={18} /> Quay lại
          </Link>
          <WanderLogo size="sm" />
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Lock size={14} className="text-green-500" />
            <span>Thanh toán an toàn</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Hoàn tất đăng ký</h1>
          <p className="text-gray-500 mt-1">Chỉ còn một bước nữa để bắt đầu hành trình với WanderLab</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ─── Left: Payment Form ─────────────────────────── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Email */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
                Thông tin liên hệ
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ email</label>
                <input
                  type="email"
                  placeholder="ban@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm transition-all bg-white text-gray-900 placeholder-gray-400 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-400 mt-1.5">Hóa đơn và thông tin tài khoản sẽ được gửi đến email này</p>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full text-white text-xs flex items-center justify-center font-bold">2</span>
                Phương thức thanh toán
              </h2>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {paymentMethods.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayMethod(id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 text-xs font-semibold transition-all ${
                      payMethod === id
                        ? "border-[#ff3131] bg-red-50 text-[#ff3131]"
                        : "border-gray-200 text-gray-600 hover:border-[#ff914d]"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-center leading-tight">{label}</span>
                  </button>
                ))}
              </div>

              {/* Card form */}
              {payMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số thẻ</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={cardNum}
                        onChange={(e) => setCardNum(formatCard(e.target.value))}
                        className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm font-mono tracking-widest bg-white text-gray-900 placeholder-gray-400 ${errors.cardNum ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                    </div>
                    {errors.cardNum && <p className="text-red-500 text-xs mt-1">{errors.cardNum}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên chủ thẻ</label>
                    <input
                      type="text"
                      placeholder="NGUYEN VAN A"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm uppercase tracking-wide bg-white text-gray-900 placeholder-gray-400 ${errors.cardName ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày hết hạn</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm font-mono bg-white text-gray-900 placeholder-gray-400 ${errors.expiry ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] text-sm font-mono bg-white text-gray-900 placeholder-gray-400 ${errors.cvv ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <div
                      onClick={() => setSaveCard(!saveCard)}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                        saveCard ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] border-transparent" : "border-gray-300"
                      }`}
                    >
                      {saveCard && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-gray-600">Lưu thẻ cho lần thanh toán tiếp theo</span>
                  </label>
                </div>
              )}

              {/* PayOS */}
              {payMethod === "payos" && (
                <div className="text-center space-y-4">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center border-4 border-indigo-300">
                    <div className="text-center">
                      <Smartphone size={40} className="text-indigo-500 mx-auto mb-1" />
                      <p className="text-xs text-indigo-600 font-semibold">VietQR PayOS</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Bạn sẽ được chuyển hướng sang cổng thanh toán an toàn của PayOS để quét mã QR thực hiện chuyển khoản tự động.</p>
                </div>
              )}

              {/* VNPay */}
              {payMethod === "vnpay" && (
                <div className="text-center space-y-4">
                  <div className="w-40 h-40 mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border-4 border-blue-200">
                    <div className="text-center">
                      <Building2 size={40} className="text-blue-500 mx-auto mb-1" />
                      <p className="text-xs text-blue-600 font-semibold">QR VNPay</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Mở ứng dụng ngân hàng → quét mã VNPay để thanh toán <span className="font-bold text-gray-900">{total.toLocaleString("vi-VN")}₫</span></p>
                  <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                    <Copy size={14} /> <span>Nội dung CK: <strong>WANDERLAB {planKey.toUpperCase()}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-2xl font-extrabold text-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Lock size={18} /> Thanh toán {total.toLocaleString("vi-VN")}₫
                  <ArrowRight size={18} />
                </span>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Shield size={12} className="text-green-500" /> SSL 256-bit</span>
              <span>•</span>
              <span>PCI DSS tuân thủ</span>
              <span>•</span>
              <span>Hoàn tiền trong 7 ngày</span>
            </div>
          </div>

          {/* ─── Right: Order Summary ───────────────────────── */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-8">
            {/* Plan card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
                {plan.badge && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    <Sparkles size={11} /> {plan.badge}
                  </div>
                )}
                <h3 className="text-2xl font-extrabold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-white/80">/{plan.period}</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Bao gồm</p>
                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 size={16} className="text-[#ff3131] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-3">
              <h3 className="font-bold text-gray-900">Tóm tắt đơn hàng</h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{plan.name} × 1 tháng</span>
                <span className="font-semibold text-gray-900">{plan.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>VAT (10%)</span>
                <span className="font-semibold text-gray-900">{tax.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Ưu đãi</span>
                <span className="font-semibold text-green-600">–0₫</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="font-extrabold text-[#ff3131] text-lg">{total.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-gradient-to-br from-[#FFF5F3] to-white rounded-2xl border border-red-100 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Shield size={14} className="text-green-500" /> Thanh toán được mã hóa SSL 256-bit
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle2 size={14} className="text-green-500" /> Hoàn tiền 100% trong 7 ngày đầu
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Lock size={14} className="text-green-500" /> Không lưu trữ thông tin thẻ của bạn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
