import { Link } from "react-router";
import { useState } from "react";
import {
  CheckCircle,
  TrendingUp,
  Users,
  BarChart3,
  MapPin,
  DollarSign,
  Star,
  Zap,
  Globe,
  Shield,
  Target,
  Briefcase,
} from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const pricingPlans = [
  {
    name: "Free",
    price: "0₫",
    period: "/tháng",
    planKey: "free",
    description: "Bản miễn phí - Đang sử dụng",
    features: [
      "AI trợ lý: 5-10 lượt/ngày",
      "Đăng tải nội dung Full HD",
      "Giới hạn dung lượng video",
      "Tạo nhật ký du lịch",
      "Chia sẻ với cộng đồng",
    ],
    color: "bg-[#FFF5F3]",
    popular: false,
    isCurrent: true,
  },
  {
    name: "Starter",
    price: "50.000₫",
    period: "/tháng",
    planKey: "starter",
    description: "Phù hợp cho người dùng thường xuyên",
    features: [
      "AI trợ lý: 100 lượt/tháng",
      "Chất lượng video 2K",
      "Video không giới hạn dung lượng",
      "Phân tích cơ bản",
      "Hỗ trợ qua email",
      "Lưu trữ không giới hạn",
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
    description: "Dành cho người sáng tạo nội dung chuyên nghiệp",
    features: [
      "AI trợ lý: Không giới hạn",
      "Nội dung 4K siêu nét",
      "Không giới hạn dung lượng",
      "Cá nhân hóa trang cá nhân",
      "Phân tích & thông tin nâng cao",
      "Hỗ trợ ưu tiên 24/7",
      "Huy hiệu xác minh",
      "Truy cập API",
    ],
    color: "bg-gradient-to-br from-[#ff3131] to-[#ff914d]",
    popular: false,
    isCurrent: false,
  },
];

const benefits = [
  {
    icon: Users,
    title: "50.000+ Du Khách Đang Hoạt Động",
    description: "Kết nối với cộng đồng du khách được xác minh đang tích cực lên kế hoạch chuyến đi",
  },
  {
    icon: Target,
    title: "Tiếp Cận Mục Tiêu",
    description: "Được khám phá bởi du khách quan tâm cụ thể đến điểm đến và dịch vụ của bạn",
  },
  {
    icon: TrendingUp,
    title: "ROI Trung Bình 250%",
    description: "Đối tác của chúng tôi thấy tăng trưởng đáng kể về đặt chỗ và hiển thị thương hiệu",
  },
  {
    icon: Shield,
    title: "Tin Tưởng & Xác Minh",
    description: "Hưởng lợi từ hệ thống xác minh xây dựng niềm tin của du khách",
  },
  {
    icon: BarChart3,
    title: "Phân Tích Thời Gian Thực",
    description: "Theo dõi hiển thị, nhấp chuột và chuyển đổi với thông tin chi tiết",
  },
  {
    icon: Zap,
    title: "Tích Hợp Dễ Dàng",
    description: "Thiết lập liền mạch với hệ thống đặt chỗ và trang web hiện có",
  },
];

const testimonials = [
  {
    company: "Phú Quốc Resort",
    author: "Nguyễn Minh Châu",
    role: "Chủ Sở Hữu",
    image: "https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBwcm9maWxlfGVufDF8fHx8MTc3MTgxNDE5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "WanderLab đã biến đổi doanh nghiệp của chúng tôi. Chúng tôi đã thấy tăng 300% đặt phòng từ du khách quốc tế.",
    rating: 5,
  },
  {
    company: "Sa Pa Adventures",
    author: "Trần Văn Hùng",
    role: "Giám Đốc Marketing",
    image: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjYXN1YWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE3OTYyMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "Chất lượng khách hàng tiềm năng rất xuất sắc. Đây là những du khách thực sự quan tâm và sẵn sàng đặt chỗ.",
    rating: 5,
  },
  {
    company: "Hội An Food Tours",
    author: "Lê Thị Hương",
    role: "Người Sáng Lập",
    image: "https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBwcm9maWxlfGVufDF8fHx8MTc3MTgxNDE5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    text: "Bảng điều khiển phân tích cung cấp thông tin chi tiết mà chúng tôi chưa từng có. Giờ đây chúng tôi có thể tối ưu hóa dịch vụ dựa trên dữ liệu thực.",
    rating: 5,
  },
];

export function WanderPartner() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã quan tâm! Chúng tôi sẽ liên hệ trong vòng 24 giờ.");
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
                <span className="text-sm font-medium">Dành Cho Doanh Nghiệp Du Lịch</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Chọn Gói Của Bạn
              </h1>

              <p className="text-xl text-white/90 leading-relaxed">
                Tham gia mạng lưới đã xác minh của WanderLab và tiếp cận 50.000+ du khách đang hoạt động lên kế hoạch chuyến phiêu lưu tiếp theo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] transition-all shadow-lg"
                >
                  Xem Giá
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  Đặt Lịch Demo
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-6">
                <div>
                  <p className="text-3xl font-bold">500+</p>
                  <p className="text-sm text-white/80">Doanh Nghiệp Đối Tác</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">50k+</p>
                  <p className="text-sm text-white/80">Du Khách Hoạt Động</p>
                </div>
                <div>
                  <p className="text-3xl font-bold">250%</p>
                  <p className="text-sm text-white/80">Tăng ROI Trung Bình</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <TrendingUp className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">Phân Tích Tăng Trưởng</h3>
                  <p className="text-sm text-white/80">Theo dõi hiệu suất với thông tin chi tiết thời gian thực</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Shield className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">Huy Hiệu Tin Cậy</h3>
                  <p className="text-sm text-white/80">Trạng thái đối tác đã xác minh xây dựng uy tín</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Users className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">Khách Hàng Chất Lượng</h3>
                  <p className="text-sm text-white/80">Kết nối với du khách sẵn sàng đặt chỗ</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <Globe className="text-white mb-3" size={32} />
                  <h3 className="font-bold mb-2">Tiếp Cận Toàn Cầu</h3>
                  <p className="text-sm text-white/80">Truy cập thị trường quốc tế dễ dàng</p>
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
              Tại Sao Hợp Tác Với WanderLab?
            </h2>
            <p className="text-xl text-gray-600">Mọi thứ bạn cần để phát triển doanh nghiệp du lịch</p>
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
              Giá Cả Đơn Giản, Minh Bạch
            </h2>
            <p className="text-xl text-gray-600">Chọn gói phù hợp với nhu cầu doanh nghiệp của bạn</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden ${
                  plan.popular ? "ring-4 ring-[#ff3131]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white text-center py-2 text-sm font-semibold">
                    Phổ Biến Nhất
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
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white hover:shadow-lg"
                        : plan.isCurrent
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#FFE8E0] text-gray-900 hover:bg-[#FFF5F3]"
                    }`}
                    disabled={plan.isCurrent}
                  >
                    {plan.isCurrent ? (
                      "Đang Sử Dụng"
                    ) : (
                      <Link to={`/checkout?plan=${plan.planKey}`}>Nâng Cấp</Link>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Được Tin Tưởng Bởi Các Doanh Nghiệp Hàng Đầu</h2>
            <p className="text-xl text-gray-600">Xem đối tác của chúng tôi nói gì</p>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sẵn Sàng Bắt Đầu?</h2>
            <p className="text-xl text-gray-600">Điền form và chúng tôi sẽ liên hệ trong vòng 24 giờ</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tên Doanh Nghiệp *
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
                  Tên Liên Hệ *
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
                  Địa Chỉ Email *
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
                  Số Điện Thoại
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
                  Loại Hình Doanh Nghiệp *
                </label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent bg-white"
                >
                  <option value="">Chọn loại hình</option>
                  <option value="hotel">Khách Sạn / Resort</option>
                  <option value="tour">Công Ty Lữ Hành</option>
                  <option value="activity">Nhà Cung Cấp Hoạt Động</option>
                  <option value="restaurant">Nhà Hàng</option>
                  <option value="transport">Vận Chuyển</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Địa Điểm *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Thành phố, Việt Nam"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Website
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
                Giới thiệu về doanh nghiệp của bạn
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                placeholder="Doanh nghiệp bạn cung cấp dịch vụ gì? Mục tiêu của bạn với WanderLab là gì?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff3131] focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-xl font-semibold hover:shadow-lg transition-all text-lg"
            >
              Gửi Đơn Đăng Ký
            </button>

            <p className="text-sm text-gray-600 text-center">
              Bằng cách gửi, bạn đồng ý với{" "}
              <a href="#" className="text-[#ff3131] hover:underline">Điều Khoản Dịch Vụ</a> và{" "}
              <a href="#" className="text-[#ff3131] hover:underline">Chính Sách Bảo Mật</a> của chúng tôi
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}