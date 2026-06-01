import { Link } from "react-router";

import {
  CheckCircle,
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
  Zap,
  Globe,
  Shield,
  Target,
  Briefcase,
} from "lucide-react";

import { useAuthStore } from "@/stores";

import { useLanguageStore } from "@/stores";

export function WanderPartner() {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const currentPlan = user?.plan || "free";

  const pricingPlans = [
    {
      name: "Free",
      price: "0₫",
      period: "/tháng",
      planKey: "free",
      description: t("freeDesc", "partner"),
      features: [
        t("freeFeat1", "partner"),
        t("freeFeat2", "partner"),
        t("freeFeat3", "partner"),
        t("freeFeat4", "partner"),
        t("freeFeat5", "partner"),
      ],
      color: "bg-[#FFF5F3] dark:bg-gray-900",
      popular: false,
      isCurrent: true,
    },
    {
      name: "Starter",
      price: "50.000₫",
      period: "/tháng",
      planKey: "starter",
      description: t("starterDesc", "partner"),
      features: [
        t("starterFeat1", "partner"),
        t("starterFeat2", "partner"),
        t("starterFeat3", "partner"),
        t("starterFeat4", "partner"),
        t("starterFeat5", "partner"),
        t("starterFeat6", "partner"),
      ],
      color: "bg-[#FFE8E0]",
      popular: true,
      isCurrent: false,
    },
    {
      name: "Professional",
      price: "150.000₫",
      period: "/tháng",
      planKey: "professional",
      description: t("proDesc", "partner"),
      features: [
        t("proFeat1", "partner"),
        t("proFeat2", "partner"),
        t("proFeat3", "partner"),
        t("proFeat4", "partner"),
        t("proFeat5", "partner"),
        t("proFeat6", "partner"),
        t("proFeat7", "partner"),
        t("proFeat8", "partner"),
      ],
      color: "bg-gradient-to-br from-[#ff3131] to-[#ff914d]",
      popular: false,
      isCurrent: false,
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: t("benefit1Title", "partner"),
      description: t("benefit1Desc", "partner"),
    },
    {
      icon: Target,
      title: t("benefit2Title", "partner"),
      description: t("benefit2Desc", "partner"),
    },
    {
      icon: TrendingUp,
      title: t("benefit3Title", "partner"),
      description: t("benefit3Desc", "partner"),
    },
    {
      icon: Shield,
      title: t("benefit4Title", "partner"),
      description: t("benefit4Desc", "partner"),
    },
    {
      icon: BarChart3,
      title: t("benefit5Title", "partner"),
      description: t("benefit5Desc", "partner"),
    },
    {
      icon: Zap,
      title: t("benefit6Title", "partner"),
      description: t("benefit6Desc", "partner"),
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#030213]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ff3131] to-[#ff914d] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-[#030213]/20 backdrop-blur-sm rounded-full">
                <Briefcase className="text-white" size={18} />
                <span className="text-sm font-medium">{t("title", "partner")}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t("heroTitle", "partner")}
              </h1>

              <p className="text-xl text-white/90 leading-relaxed">
                {t("heroDesc", "partner")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#030213] text-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] dark:bg-gray-900 transition-all shadow-lg"
                >
                  {t("viewPricing", "partner")}
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 dark:bg-[#030213]/10 transition-all"
                >
                  {t("bookDemo", "partner")}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-white/80">{t("statPartners", "partner")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50k+</p>
                  <p className="text-sm text-white/80">{t("statTravelers", "partner")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">250%</p>
                  <p className="text-sm text-white/80">{t("statROI", "partner")}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
                  <TrendingUp className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("growthTitle", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("growthDesc", "partner")}</p>
                </div>
                <div className="bg-white/10 dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
                  <Shield className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("trustTitle", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("trustDesc", "partner")}</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
                  <Users className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("customersTitle", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("customersDesc", "partner")}</p>
                </div>
                <div className="bg-white/10 dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
                  <Globe className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("globalTitle", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("globalDesc", "partner")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#FFF5F3] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
              {t("whyTitle", "partner")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t("whyDesc", "partner")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white dark:bg-[#030213] rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="text-[#ff3131]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-[#030213]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
              {t("pricingTitle", "partner")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t("pricingDesc", "partner")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((planDef, index) => {
              const isCurrent = planDef.planKey === currentPlan;
              return (
              <div
                key={index}
                className={`bg-white dark:bg-[#030213] rounded-3xl shadow-lg overflow-hidden ${
                  planDef.popular ? "ring-4 ring-[#ff3131]" : ""
                }`}
              >
                {planDef.popular && (
                  <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white text-center py-2 text-sm font-semibold">
                    {t("popular", "partner")}
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{planDef.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{isCurrent ? t("currentPlan", "partner") : planDef.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">{planDef.price}</span>
                    {planDef.period && <span className="text-gray-600 dark:text-gray-400">{planDef.period}</span>}
                  </div>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      planDef.popular && !isCurrent
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg"
                        : isCurrent
                        ? "bg-gray-200 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-[#FFE8E0] text-gray-900 dark:text-white hover:bg-[#FFF5F3] dark:bg-gray-900"
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent ? (
                      t("currentPlan", "partner")
                    ) : (
                      <Link to={`/checkout?plan=${planDef.planKey}`}>{t("upgrade", "partner")}</Link>
                    )}
                  </button>
                  <ul className="mt-8 space-y-4">
                    {planDef.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="text-[#ff3131] flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

    </div>
  );
}