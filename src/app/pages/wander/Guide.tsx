import { WanderNav } from "../../components/wander/WanderNav";
import { WanderFooter } from "../../components/wander/WanderFooter";
import { Link } from "react-router";
import { Search, BookOpen, Map, PenTool, Users, MessageCircle, Shield, Bell, Star } from "lucide-react";

const guides = [
  {
    icon: Search,
    title: "Khám Phá Nhật Ký Du Lịch",
    description: "Duyệt qua những trải nghiệm du lịch xác thực từ những người Việt đã thực sự đặt chân đến",
    steps: [
      'Nhấn vào "Khám Phá" trên thanh điều hướng',
      "Dùng bộ lọc để tìm theo địa điểm, ngân sách hoặc phong cách du lịch",
      "Nhấn vào bất kỳ thẻ nhật ký nào để xem chi tiết và lịch trình",
      "Lưu nhật ký yêu thích vào bảng điều khiển để tham khảo sau",
    ],
  },
  {
    icon: BookOpen,
    title: "Đọc Chi Tiết Nhật Ký",
    description: "Nhận đầy đủ thông tin về chuyến đi bao gồm ngân sách và lịch trình từng ngày",
    steps: [
      "Xem lịch trình chi tiết từng ngày cùng hoạt động và chi phí",
      "Kiểm tra bảng phân tích ngân sách minh bạch",
      "Đọc mẹo kinh nghiệm từ chính người đã đi",
      "Xem điểm tin cậy và đánh giá từ cộng đồng",
    ],
  },
  {
    icon: PenTool,
    title: "Tạo Nhật Ký Của Bạn",
    description: "Chia sẻ trải nghiệm du lịch của bạn với cộng đồng WanderLab",
    steps: [
      'Nhấn nút "Tạo Nhật Ký" trên thanh điều hướng',
      "Điền thông tin cơ bản: địa điểm, ngày tháng, ngân sách",
      "Thêm hoạt động và lịch trình từng ngày",
      "Tải ảnh lên và cài đặt quyền riêng tư",
      "Đăng tải để truyền cảm hứng cho những người đi sau",
    ],
  },
  {
    icon: Users,
    title: "Kết Nối Với Người Du Lịch",
    description: "Theo dõi các tác giả và tương tác với cộng đồng",
    steps: [
      "Ghé thăm trang cá nhân của bất kỳ tác giả nhật ký nào",
      'Nhấn "Theo Dõi" để nhận cập nhật nhật ký mới của họ',
      "Thích và bình luận về những nhật ký bạn thấy hữu ích",
      "Đặt câu hỏi trong phần bình luận",
    ],
  },
  {
    icon: Map,
    title: "Lên Kế Hoạch Chuyến Đi",
    description: "Dùng gợi ý AI và nhật ký đã lưu để lên kế hoạch hành trình",
    steps: [
      "Vào Bảng Điều Khiển để xem gợi ý AI cá nhân hoá",
      "Duyệt nhật ký phù hợp với sở thích của bạn",
      'Dùng "Sao Chép Lịch Trình" để tùy chỉnh chuyến đi có sẵn',
      "Lưu nhiều nhật ký để so sánh các lựa chọn",
    ],
  },
  {
    icon: Shield,
    title: "Hệ Thống Tin Cậy & Xác Minh",
    description: "Hiểu hệ thống tin cậy của chúng tôi để đảm bảo nội dung xác thực",
    steps: [
      "Tìm huy hiệu Điểm Tin Cậy trên mỗi nhật ký (0-100%)",
      "Nhật ký đã xác minh đã được đội ngũ WanderLab xem xét",
      "Kiểm tra bảng phân tích ngân sách minh bạch",
      "Đọc đánh giá và xếp hạng từ cộng đồng",
    ],
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Trợ Lý Du Lịch AI",
    description: "Nhận trợ giúp và gợi ý ngay lập tức từ chatbot AI của chúng tôi (góc phải phía dưới)",
  },
  {
    icon: Bell,
    title: "Thông Báo",
    description: "Nhận cập nhật khi các tác giả bạn theo dõi đăng nhật ký mới",
  },
  {
    icon: Star,
    title: "Bảng Tin Cá Nhân Hoá",
    description: "Bảng điều khiển hiển thị gợi ý dựa trên sở thích du lịch của bạn",
  },
];

export function WanderGuide() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#030213]">
      <WanderNav />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#030213] rounded-full shadow-sm mb-6">
              <BookOpen className="text-[#ff3131]" size={18} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Hướng Dẫn Bắt Đầu</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Cách Sử Dụng WanderLab
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Hướng dẫn đầy đủ để khám phá, lên kế hoạch và chia sẻ những trải nghiệm du lịch xác thực
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 bg-white dark:bg-[#030213] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Bắt Đầu Nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "1", label: "Đăng Ký", desc: "Tạo tài khoản và thiết lập sở thích du lịch" },
              { num: "2", label: "Khám Phá", desc: "Duyệt nhật ký du lịch đã xác minh và lưu yêu thích" },
              { num: "3", label: "Tạo", desc: "Chia sẻ hành trình của bạn và truyền cảm hứng cho người khác" },
            ].map(({ num, label, desc }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ff3131] to-[#ff914d] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {num}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{label}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Guides */}
      <section className="py-20 bg-[#FFF5F3] dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Hướng Dẫn Chi Tiết</h2>
          <div className="space-y-8">
            {guides.map((guide, index) => {
              const IconComponent = guide.icon;
              return (
                <div key={index} className="bg-white dark:bg-[#030213] rounded-2xl shadow-sm p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#FFF5F3] to-[#FFE8E0] rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-[#ff3131]" size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{guide.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">{guide.description}</p>
                      <div className="space-y-3">
                        {guide.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gradient-to-r from-[#ff3131] to-[#ff914d] rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                              {stepIndex + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white dark:bg-[#030213]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Tính Năng Bổ Sung</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-[#FFF5F3] dark:bg-gray-900 rounded-2xl p-6 text-center">
                  <div className="w-14 h-14 bg-white dark:bg-[#030213] rounded-xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-[#ff3131]" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff3131] to-[#ff914d]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">Mẹo Để Có Trải Nghiệm Tốt Nhất</h2>
            <p className="text-xl text-white/90">Khai thác tối đa WanderLab</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">💡 Hoàn Thiện Hồ Sơ</h3>
              <p className="text-white/90 text-sm">
                Điền đầy đủ hồ sơ cá nhân để tăng điểm tin cậy và nhận gợi ý được cá nhân hoá tốt hơn
              </p>
            </div>
            <div className="bg-white dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">📸 Dùng Ảnh Chất Lượng Cao</h3>
              <p className="text-white/90 text-sm">
                Hình ảnh chất lượng cao thu hút gấp 3 lần lượt tương tác khi tạo nhật ký
              </p>
            </div>
            <div className="bg-white dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">🎯 Tìm Kiếm Cụ Thể</h3>
              <p className="text-white/90 text-sm">
                Dùng bộ lọc tìm kiếm chi tiết để tìm chính xác những gì bạn muốn
              </p>
            </div>
            <div className="bg-white dark:bg-[#030213]/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="font-bold text-white mb-2">🤝 Tương Tác Cộng Đồng</h3>
              <p className="text-white/90 text-sm">
                Bình luận và đặt câu hỏi – cộng đồng WanderLab luôn sẵn sàng hỗ trợ những người đồng hành
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-[#030213]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sẵn Sàng Bắt Đầu Khám Phá?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Tham gia hàng nghìn người Việt đang chia sẻ những trải nghiệm du lịch xác thực
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff3131] to-[#ff914d] text-white rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Tạo Tài Khoản
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-[#030213] text-[#ff3131] border-2 border-[#ff3131] rounded-full font-semibold hover:bg-[#FFF5F3] dark:bg-gray-900 transition-all"
            >
              Duyệt Nhật Ký
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-12 bg-[#FFF5F3] dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Vẫn còn thắc mắc?</p>
          <a href="#" className="text-[#ff3131] font-semibold hover:text-[#ff914d]">
            Truy cập trang Câu Hỏi Thường Gặp →
          </a>
        </div>
      </section>

      <WanderFooter />
    </div>
  );
}

