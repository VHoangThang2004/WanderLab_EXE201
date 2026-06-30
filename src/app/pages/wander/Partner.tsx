import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, X, Copy, CreditCard, Smartphone } from "lucide-react";
import { useLanguageStore, useAuthStore } from "@/stores";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { notificationService } from "@/api/notificationService";
import { toast } from "sonner";
import qrAgribankPlus from "@/assets/AgribankPlus.jpg";
import qrAgribankPro from "@/assets/AgribankPro.jpg";
import qrMomoPlus from "@/assets/MomoPlus.jpg";
import qrMomoPro from "@/assets/MomoPro.jpg";

export function WanderPartner() {
  const { language } = useLanguageStore();
  const { user, setPlan, updateProfile } = useAuthStore();
  const { resetUsage } = useUsageLimits();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo'>('bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(language === 'vi' ? "Đã sao chép!" : "Copied!");
  };

  const handleDowngrade = async (plan: any) => {
    const isConfirmed = window.confirm(
      language === 'vi' 
        ? `Bạn có chắc chắn muốn hạ cấp xuống gói ${plan.name}? Các đặc quyền của gói hiện tại sẽ bị hủy bỏ.`
        : `Are you sure you want to downgrade to the ${plan.name} plan? Your current premium features will be lost.`
    );
  
    if (!isConfirmed) return;
  
    setPlan(plan.planKey);
    try {
      if (user) {
        await updateProfile({ plan: plan.planKey });
        
        // Create in-app notification for downgrade
        await notificationService.createNotification(
          user.id,
          null, // system notification
          'plan_downgrade',
          language === 'vi' 
            ? `Bạn đã hạ cấp thành công xuống gói ${plan.name}. Các giới hạn sử dụng đã được áp dụng.` 
            : `Successfully downgraded to ${plan.name} plan. New usage limits are applied.`
        );
      }
      resetUsage();
      toast.success(
        language === 'vi' 
          ? `Đã hạ cấp thành công xuống gói ${plan.name}.`
          : `Successfully downgraded to ${plan.name} plan.`
      );
    } catch (error) {
      console.error("Failed to downgrade plan in DB", error);
      resetUsage();
      toast.success(
        language === 'vi' 
          ? `Đã hạ cấp xuống gói ${plan.name} (Local).`
          : `Downgraded to ${plan.name} (Local).`
      );
    }
  };

  const pricingPlans = [
    {
      name: "Free",
      price: language === 'vi' ? "0₫" : "$0",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "free",
      description: language === 'vi' ? "Trải nghiệm cơ bản" : "Basic experience",
      features: language === 'vi' ? [
        "Xem, thích & bình luận",
        "Đăng bài: 4 Nhật ký & 2 Lịch trình / ngày",
        "Trợ lý AI: 8 Nhật ký & 4 Lịch trình / ngày",
        "Đính kèm: 5 ảnh & 1 video (720p) / bài",
      ] : [
        "View, like & comment",
        "Post: 4 Journals & 2 Itineraries / day",
        "AI Assist: 8 Journals & 4 Itineraries / day",
        "Attach: 5 images & 1 video (720p) / post",
      ],
      color: "bg-[#FFF5F3]",
      popular: false,
      isCurrent: (user?.plan || 'free') === 'free',
      level: 0,
    },
    {
      name: "Plus",
      price: language === 'vi' ? "19.000₫" : "$0.79",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "plus",
      description: language === 'vi' ? "Trải nghiệm tuyệt vời hơn" : "Better experience",
      features: language === 'vi' ? [
        "Giới hạn sử dụng gấp 2.5 lần gói Free",
        "Đính kèm video phân giải cao 1080p",
        "Trải nghiệm không quảng cáo",
        "Huy hiệu Plus nổi bật",
      ] : [
        "Usage limits 2.5x higher than Free",
        "Attach high resolution 1080p videos",
        "Ad-free experience",
        "Exclusive Plus badge",
      ],
      color: "bg-[#FFE8E0]",
      popular: true,
      isCurrent: (user?.plan || 'free') === 'plus',
      level: 1,
    },
    {
      name: "Pro",
      price: language === 'vi' ? "29.000₫" : "$1.19",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "pro",
      description: language === 'vi' ? "Dành cho tín đồ xê dịch" : "For travel enthusiasts",
      features: language === 'vi' ? [
        "Giới hạn sử dụng gấp 2.5 lần gói Plus",
        "Đính kèm video siêu nét 2160p (4K)",
        "Trải nghiệm không quảng cáo",
        "Huy hiệu Pro đẳng cấp",
      ] : [
        "Usage limits 2.5x higher than Plus",
        "Attach ultra HD 2160p (4K) videos",
        "Ad-free experience",
        "Exclusive Pro badge",
      ],
      color: "bg-gradient-to-br from-[#ff3131] to-[#ff914d]",
      popular: false,
      isCurrent: (user?.plan || 'free') === 'pro',
      level: 2,
    },
  ];

  const currentPlanLevel = pricingPlans.find(p => p.planKey === (user?.plan || 'free'))?.level || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
            {language === 'vi' ? "Nâng cấp trải nghiệm WanderLab" : "Upgrade your WanderLab experience"}
          </h2>
          <p className="text-xl text-gray-600">
            {language === 'vi' ? "Chọn gói phù hợp nhất với nhu cầu khám phá của bạn" : "Choose the plan that best fits your exploration needs"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col ${
                plan.popular ? "ring-4 ring-[#ff3131] transform md:-translate-y-4" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white text-center py-2 text-sm font-semibold tracking-wider uppercase">
                  {language === 'vi' ? "Phổ biến nhất" : "Most popular"}
                </div>
              )}
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-600 text-lg font-medium ml-1">{plan.period}</span>}
                </div>
                
                <ul className="mt-4 mb-8 space-y-4 flex-1">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <CheckCircle className="text-[#ff3131] flex-shrink-0 mt-1" size={20} />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.isCurrent ? (
                  <button
                    className="w-full py-4 rounded-xl font-semibold transition-all mt-auto bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  >
                    {language === 'vi' ? "Gói hiện tại" : "Current plan"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (plan.level < currentPlanLevel) {
                        handleDowngrade(plan);
                      } else {
                        setSelectedPlan(plan);
                        setPaymentMethod('bank');
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-semibold transition-all mt-auto text-center block shadow-md ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg hover:scale-[1.02]"
                        : "bg-[#FFE8E0] text-gray-900 hover:bg-[#FFF5F3] hover:scale-[1.02]"
                    }`}
                  >
                    {plan.level < currentPlanLevel 
                      ? (language === 'vi' ? "Hạ cấp" : "Downgrade") 
                      : (language === 'vi' ? "Nâng cấp ngay" : "Upgrade now")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 scrollbar-hide">
            <button
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className={`${selectedPlan.color.includes('bg-') ? selectedPlan.color : 'bg-gradient-to-r from-[#ff3131] to-[#ff914d]'} p-6 text-center relative`}>
              <h3 className={`text-2xl font-bold ${selectedPlan.popular ? 'text-white' : 'text-gray-900'}`}>
                {language === 'vi' ? "Thanh toán gói" : "Pay for"} {selectedPlan.name}
              </h3>
              <p className={`mt-1 font-medium ${selectedPlan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                {selectedPlan.price}
              </p>
            </div>
            
            <div className="p-6">
              {/* Payment Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    paymentMethod === 'bank' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <CreditCard size={18} />
                  {language === 'vi' ? "Ngân hàng" : "Bank"}
                </button>
                <button
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    paymentMethod === 'momo' ? 'bg-[#a50064] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Smartphone size={18} />
                  Momo
                </button>
              </div>

              {/* QR Display */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="bg-white p-0 md:p-2 rounded-2xl border-2 border-gray-100 shadow-sm inline-block w-full max-w-[360px]">
                  <img
                    src={
                      paymentMethod === 'bank'
                        ? (selectedPlan.planKey === 'plus' ? qrAgribankPlus : qrAgribankPro)
                        : (selectedPlan.planKey === 'plus' ? qrMomoPlus : qrMomoPro)
                    }
                    alt="Payment QR"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  {language === 'vi' ? "Quét mã QR qua ứng dụng ngân hàng hoặc Momo để thanh toán" : "Scan QR code via Bank or Momo app to pay"}
                </p>
              </div>

              {/* Account Details for Manual Transfer */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{language === 'vi' ? "Ngân hàng" : "Bank"}</span>
                  <span className="font-semibold text-gray-900">{paymentMethod === 'bank' ? "Agribank" : "Momo"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{language === 'vi' ? "Chủ tài khoản" : "Account Name"}</span>
                  <span className="font-semibold text-gray-900">VÕ HOÀNG THẮNG</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{language === 'vi' ? "Số tài khoản" : "Account No."}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{paymentMethod === 'bank' ? "8888853382267" : "*******045"}</span>
                    {paymentMethod === 'bank' && (
                      <button onClick={() => handleCopy("8888853382267")} className="text-[#ff3131] hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                        <Copy size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{language === 'vi' ? "Nội dung" : "Message"}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-right">
                      {selectedPlan.planKey === 'plus' ? 'WANDERLABPLUS' : 'WANDERLABPRO'}
                    </span>
                    <button onClick={() => handleCopy(selectedPlan.planKey === 'plus' ? 'WANDERLABPLUS' : 'WANDERLABPRO')} className="text-[#ff3131] hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  disabled={isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    
                    // Simulate 2 seconds of bank API verification
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Simulate upgrading plan for testing and save to DB
                    setPlan(selectedPlan.planKey);
                    
                    try {
                      if (user) {
                        await updateProfile({ plan: selectedPlan.planKey });
                        
                        // Create in-app notification for upgrade
                        await notificationService.createNotification(
                          user.id,
                          null, // system notification
                          'plan_upgrade',
                          language === 'vi' 
                            ? `Bạn đã nâng cấp thành công lên gói ${selectedPlan.name}. Các đặc quyền và giới hạn sử dụng mới đã được kích hoạt!` 
                            : `Successfully upgraded to ${selectedPlan.name} plan. Your new perks and usage limits are now active!`
                        );
                      }
                      resetUsage();
                      toast.success(language === 'vi' ? `Thanh toán thành công! Chào mừng bạn đến với gói ${selectedPlan.name}.` : `Payment successful! Welcome to the ${selectedPlan.name} plan.`);
                    } catch (error) {
                      console.error("Failed to update plan in DB", error);
                      resetUsage();
                      // Fallback toast if db update fails but local state is set
                      toast.success(language === 'vi' ? `Đã nâng cấp gói ${selectedPlan.name} (Local).` : `Upgraded to ${selectedPlan.name} (Local).`);
                    }
                    
                    setIsProcessing(false);
                    setSelectedPlan(null);
                    
                    // Navigate back to Dashboard to see the new limits
                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 500);
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    isProcessing ? "bg-gray-400 text-white cursor-wait" : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {language === 'vi' ? "Đang xác thực giao dịch..." : "Verifying payment..."}
                    </>
                  ) : (
                    language === 'vi' ? "Tôi đã chuyển khoản" : "I have transferred"
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-3">
                  {language === 'vi' ? "Tài khoản của bạn sẽ được nâng cấp trong vòng 5-10 phút sau khi xác nhận thanh toán thành công." : "Your account will be upgraded within 5-10 minutes after payment verification."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}