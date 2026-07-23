import { Link } from "react-router";
import { motion } from "framer-motion";
import { Compass, Sparkles, MapPin, Users, ArrowRight } from "lucide-react";
import { WanderLogo } from "../../components/wander/WanderLogo";
import { useLanguageStore } from "@/stores";

export function MarketingLanding() {
  const { language } = useLanguageStore();

  return (
    <div className="min-h-screen bg-[#FFF5F3] font-sans selection:bg-[#ff3131]/20">
      {/* Simple Header with Logo and CTA */}
      <header className="absolute top-0 left-0 right-0 z-50 py-6 px-4 sm:px-8 lg:px-16 flex items-center justify-between">
        <WanderLogo size="lg" />
        <Link
          to="/register"
          className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#ff3131] font-bold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 border border-[#ff3131]/10"
        >
          {language === 'vi' ? 'Đăng Ký Ngay' : 'Sign Up Now'}
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-[#ff3131]/5 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#ff3131]/20 text-[#ff3131] font-medium text-sm mb-8 shadow-sm"
          >
            <Sparkles size={16} />
            <span>{language === 'vi' ? 'Nền tảng nhật ký du lịch số 1 Việt Nam' : "Vietnam's #1 Travel Diary Platform"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight"
          >
            {language === 'vi' ? (
              <>Lưu giữ từng khoảnh khắc,<br />Chia sẻ mọi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#ff914d]">hành trình</span></>
            ) : (
              <>Capture Every Moment,<br />Share Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff3131] to-[#ff914d]">Journey</span></>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {language === 'vi' 
              ? 'WanderLab giúp bạn dễ dàng ghi lại, sắp xếp và chia sẻ những trải nghiệm du lịch tuyệt vời nhất. Tạo cuốn nhật ký số của riêng bạn ngay hôm nay.'
              : 'WanderLab makes it easy to capture, organize, and share your best travel experiences. Create your digital diary today.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white font-bold text-lg shadow-lg shadow-[#ff3131]/30 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {language === 'vi' ? 'Bắt Đầu Miễn Phí' : 'Start for Free'}
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Compass className="w-8 h-8 text-[#ff3131]" />,
                title: language === 'vi' ? 'Khám Phá' : 'Discover',
                desc: language === 'vi' ? 'Tìm nguồn cảm hứng từ hàng ngàn chuyến đi thực tế của cộng đồng đam mê xê dịch.' : 'Find inspiration from thousands of real trips shared by our travel community.'
              },
              {
                icon: <MapPin className="w-8 h-8 text-[#ff3131]" />,
                title: language === 'vi' ? 'Lên Kế Hoạch' : 'Plan',
                desc: language === 'vi' ? 'Tạo lịch trình chi tiết, quản lý ngân sách và tối ưu thời gian cho chuyến đi hoàn hảo.' : 'Create detailed itineraries, manage budgets, and optimize time for the perfect trip.'
              },
              {
                icon: <Users className="w-8 h-8 text-[#ff3131]" />,
                title: language === 'vi' ? 'Kết Nối' : 'Connect',
                desc: language === 'vi' ? 'Giao lưu, bình luận và chia sẻ mẹo du lịch với những người cùng chung sở thích.' : 'Interact, comment, and share travel tips with like-minded people.'
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#FFF5F3] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-br from-[#ff3131] to-[#ff914d] text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {language === 'vi' ? 'Sẵn sàng cho chuyến đi tiếp theo?' : 'Ready for your next trip?'}
          </h2>
          <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto">
            {language === 'vi' ? 'Chỉ mất 30 giây để tạo tài khoản và bắt đầu ghi lại những trải nghiệm vô giá của bạn.' : 'It takes just 30 seconds to create an account and start recording your priceless experiences.'}
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-[#ff3131] font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            {language === 'vi' ? 'Tham Gia Cùng Chúng Tôi' : 'Join Us Now'}
          </Link>
        </div>
      </section>
      
      {/* Simple Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} WanderLab. All rights reserved.</p>
      </footer>
    </div>
  );
}
