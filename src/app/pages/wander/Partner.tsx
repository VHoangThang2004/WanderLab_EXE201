import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { CheckCircle, X, Copy, CreditCard, Smartphone } from "lucide-react";
import { useLanguageStore, useAuthStore } from "@/stores";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { notificationService } from "@/api/notificationService";
import { toast } from "sonner";

export function WanderPartner() {
  const { language } = useLanguageStore();
  const { user, setPlan, updateProfile } = useAuthStore();
  const { resetUsage } = useUsageLimits();
  const navigate = useNavigate();
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
      price: language === 'vi' ? "50.000₫" : "$1.99",
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
      price: language === 'vi' ? "150.000₫" : "$5.99",
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
                        navigate("/checkout?plan=" + plan.planKey);
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
    </div>
  );
}