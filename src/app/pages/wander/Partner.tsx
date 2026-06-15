import { Link } from "react-router";
import { useState } from "react";
import {
  CheckCircle,
  TrendingUp,
  Users,
  BarChart3,
  MapPin,
  Star,
  Zap,
  Globe,
  Shield,
  Target,
  Briefcase,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useLanguageStore } from "@/stores";

export function WanderPartner() {
  const { t, language } = useLanguageStore();
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    businessType: "",
    location: "",
    website: "",
    message: "",
  });

  const pricingPlans = [
    {
      name: "Free",
      price: "0₫",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "free",
      description: t("planFreeDesc", "partner"),
      features: [
        t("featureFree1", "partner"),
        t("featureFree2", "partner"),
        t("featureFree3", "partner"),
        t("featureFree4", "partner"),
        t("featureFree5", "partner"),
      ],
      color: "bg-[#FFF5F3]",
      popular: false,
      isCurrent: true,
    },
    {
      name: "Starter",
      price: "50.000₫",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "starter",
      description: t("planStarterDesc", "partner"),
      features: [
        t("featureStarter1", "partner"),
        t("featureStarter2", "partner"),
        t("featureStarter3", "partner"),
        t("featureStarter4", "partner"),
        t("featureStarter5", "partner"),
        t("featureStarter6", "partner"),
      ],
      color: "bg-[#FFE8E0]",
      popular: true,
      isCurrent: false,
    },
    {
      name: "Professional",
      price: "150.000₫",
      period: language === 'vi' ? "/tháng" : "/month",
      planKey: "professional",
      description: t("planProfessionalDesc", "partner"),
      features: [
        t("featureProfessional1", "partner"),
        t("featureProfessional2", "partner"),
        t("featureProfessional3", "partner"),
        t("featureProfessional4", "partner"),
        t("featureProfessional5", "partner"),
        t("featureProfessional6", "partner"),
        t("featureProfessional7", "partner"),
        t("featureProfessional8", "partner"),
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

  const testimonials: any[] = [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(t("submitSuccess", "partner"));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#ff3131] to-[#ff914d] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Briefcase className="text-white" size={18} />
                <span className="text-sm font-medium">{t("badge", "partner")}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {t("title", "partner")}
              </h1>

              <p className="text-xl text-white/90 leading-relaxed">
                {t("subtitle", "partner")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all shadow-lg"
                >
                  {t("viewPricingBtn", "partner")}
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  {t("bookDemoBtn", "partner")}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-white/80">{t("partnerCount", "partner")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50k+</p>
                  <p className="text-sm text-white/80">{t("activeTravelers", "partner")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">250%</p>
                  <p className="text-sm text-white/80">{t("avgRoi", "partner")}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <TrendingUp className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("growthAnalytics", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("growthAnalyticsDesc", "partner")}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Shield className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("trustBadge", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("trustBadgeDesc", "partner")}</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Users className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("qualityCustomers", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("qualityCustomersDesc", "partner")}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Globe className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">{t("globalReach", "partner")}</h3>
                  <p className="text-sm text-white/80">{t("globalReachDesc", "partner")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#FFF5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
              {t("whyPartnerTitle", "partner")}
            </h2>
            <p className="text-xl text-gray-600">{t("whyPartnerSubtitle", "partner")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="text-[#ff3131]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff3131] to-[#ff914d] bg-clip-text text-transparent mb-4">
              {t("pricingTitle", "partner")}
            </h2>
            <p className="text-xl text-gray-600">{t("pricingSubtitle", "partner")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden ${plan.popular ? "ring-4 ring-[#ff3131]" : ""
                  }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white text-center py-2 text-sm font-semibold">
                    {t("mostPopular", "partner")}
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg"
                        : plan.isCurrent
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-[#FFE8E0] text-gray-900 hover:bg-[#FFF5F3]"
                      }`}
                    disabled={plan.isCurrent}
                  >
                    {plan.isCurrent ? (
                      t("currentPlan", "partner")
                    ) : (
                      <Link to={`/checkout?plan=${plan.planKey}`}>{t("upgrade", "partner")}</Link>
                    )}
                  </button>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <CheckCircle className="text-[#ff3131] flex-shrink-0 mt-1" size={20} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#FFF5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("trustedTitle", "partner")}</h2>
            <p className="text-xl text-gray-600">{t("trustedSubtitle", "partner")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-[#ff3131] font-semibold">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("readyTitle", "partner")}</h2>
            <p className="text-xl text-gray-600">{t("readySubtitle", "partner")}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelBusinessName", "partner")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelContactName", "partner")}
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelEmail", "partner")}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelPhone", "partner")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelBusinessType", "partner")}
                </label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent bg-white"
                >
                  <option value="">{t("selectTypePlaceholder", "partner")}</option>
                  <option value="hotel">{t("typeHotel", "partner")}</option>
                  <option value="tour">{t("typeTour", "partner")}</option>
                  <option value="activity">{t("typeActivity", "partner")}</option>
                  <option value="restaurant">{t("typeRestaurant", "partner")}</option>
                  <option value="transport">{t("typeTransport", "partner")}</option>
                  <option value="other">{t("typeOther", "partner")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t("labelLocation", "partner")}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t("placeholderLocation", "partner")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("labelWebsite", "partner")}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t("labelIntro", "partner")}
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder={t("placeholderIntro", "partner")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
            >
              {t("submitBtn", "partner")}
            </button>

            <p className="text-sm text-gray-600 text-center">
              {language === 'vi' ? 'Bằng cách gửi, bạn đồng ý với ' : 'By submitting, you agree to our '}
              <a href="#" className="text-[#ff3131] hover:underline">{t("termsLink", "partner")}</a>
              {language === 'vi' ? ' và ' : ' and '}
              <a href="#" className="text-[#ff3131] hover:underline">{t("privacyLink", "partner")}</a>
              {language === 'vi' ? ' của chúng tôi' : ''}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}