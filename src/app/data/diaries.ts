export interface DiaryAuthor {
  name: string;
  avatar: string;
  diariesCount: number;
  followersCount: number;
}

export interface DiaryDay {
  day: number;
  title: string;
  activities: string[];
  budget: string;
}

export interface BudgetItem {
  category: string;
  amount: string;
  percentage: number;
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface ReviewPhoto {
  url: string;
  reviewer: string;
  avatar: string;
  caption: string;
  rating: number;
  date: string;
}

export interface RelatedDiary {
  id: string;
  title: string;
  duration: string;
  budget: string;
  trustScore: number;
  image: string;
}

export interface Diary {
  id: string;
  title: string;
  location: string;
  country: string;
  image: string;
  gallery: string[];
  reviewPhotos: ReviewPhoto[];
  author: DiaryAuthor;
  trustScore: number;
  duration: string;
  dates: string;
  totalBudget: string;
  groupSize: string;
  description: string;
  timeline: DiaryDay[];
  budgetBreakdown: BudgetItem[];
  budgetNotes: string[];
  tips: string[];
  reviews: Review[];
  related: RelatedDiary[];
}

export const DIARY_DATA: Record<string, Diary> = {
  "1": {
    id: "1",
    title: "Khám Phá Vịnh Hạ Long 5 Ngày",
    location: "Vịnh Hạ Long, Quảng Ninh",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1431975071466-2c609dac5956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1697850085870-5f248fcb1ff2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1772333389046-857fa5f9f9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1772333389046-857fa5f9f9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Trần Minh Quân",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Buổi sáng trên vịnh – không khí trong lành và cảnh đẹp như tranh vẽ!",
        rating: 5,
        date: "2 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1759526052256-572d57ea54ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Lê Thị Hương",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Những trụ đá vôi phản chiếu xuống mặt nước – khoảnh khắc tuyệt vời nhất chuyến đi!",
        rating: 5,
        date: "1 tháng trước",
      },
      {
        url: "https://images.unsplash.com/photo-1698658989153-a60a73549b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Phạm Đức Anh",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Khám phá hang động bằng thuyền kayak – trải nghiệm không thể quên!",
        rating: 4,
        date: "2 tháng trước",
      },
    ],
    author: {
      name: "Nguyễn Thị Mai",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 15,
      followersCount: 3200,
    },
    trustScore: 98,
    duration: "5 ngày",
    dates: "15–20 tháng 6, 2026",
    totalBudget: "8.500.000₫",
    groupSize: "2 người",
    description:
      "Hành trình 5 ngày khám phá vẻ đẹp huyền bí của Vịnh Hạ Long – Di sản Thiên nhiên Thế giới. Lịch trình đưa bạn qua những hang động kỳ vĩ, làng chài nổi yên bình và những hoàng hôn tuyệt đẹp trên vịnh. Phù hợp cho cặp đôi, gia đình và nhóm bạn yêu thiên nhiên.",
    timeline: [
      {
        day: 1,
        title: "Hà Nội – Hạ Long, Lên Tàu Du Lịch",
        activities: [
          "Khởi hành từ Hà Nội lúc 8h sáng",
          "Đến cảng Tuần Châu, làm thủ tục lên tàu",
          "Ăn trưa trên tàu ngắm cảnh vịnh",
          "Thăm hang Thiên Cung và hang Đầu Gỗ",
        ],
        budget: "1.200.000₫",
      },
      {
        day: 2,
        title: "Chèo Kayak & Làng Chài Cửa Vạn",
        activities: [
          "Tập thái cực quyền buổi sáng trên boong tàu",
          "Chèo kayak khám phá các hang động nhỏ",
          "Thăm làng chài nổi Cửa Vạn",
          "Ngắm hoàng hôn trên vịnh",
        ],
        budget: "1.500.000₫",
      },
      {
        day: 3,
        title: "Đảo Ti Tốp & Bãi Tắm",
        activities: [
          "Leo lên đỉnh đảo Ti Tốp ngắm toàn cảnh vịnh",
          "Tắm biển tại bãi cát trắng đảo Ti Tốp",
          "Câu mực và nướng hải sản buổi tối",
          "Xem phim thiên văn trên boong tàu",
        ],
        budget: "1.800.000₫",
      },
      {
        day: 4,
        title: "Hang Sửng Sốt & Đảo Bồ Hòn",
        activities: [
          "Thăm hang Sửng Sốt – hang động lớn nhất vịnh",
          "Tắm biển tại đảo Bồ Hòn",
          "Học nấu ăn truyền thống Việt Nam trên tàu",
          "Tiệc hải sản nướng buổi tối",
        ],
        budget: "2.000.000₫",
      },
      {
        day: 5,
        title: "Rời Tàu – Về Hà Nội",
        activities: [
          "Ăn sáng cuối cùng trên vịnh",
          "Tổng kết hành trình, chụp ảnh kỷ niệm",
          "Rời tàu tại cảng Tuần Châu",
          "Di chuyển về Hà Nội",
        ],
        budget: "2.000.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Tàu du lịch & Phòng cabin", amount: "3.500.000₫", percentage: 41 },
      { category: "Di chuyển", amount: "1.800.000₫", percentage: 21 },
      { category: "Ăn uống", amount: "1.700.000₫", percentage: 20 },
      { category: "Hoạt động & Tham quan", amount: "1.200.000₫", percentage: 14 },
      { category: "Chi phí khác", amount: "300.000₫", percentage: 4 },
    ],
    budgetNotes: [
      "Tất cả giá hiển thị bằng VND tính đến tháng 6/2026",
      "Chi phí cabin tàu tính cho 2 người ở chung",
      "Di chuyển bao gồm xe khách Hà Nội – Hạ Long và ngược lại",
      "Ngân sách ăn uống gồm bữa trên tàu và một số bữa tự túc",
    ],
    tips: [
      "Đặt tàu cruise trước ít nhất 1 tháng vào mùa cao điểm (tháng 6–8)",
      "Mang theo áo mưa và kem chống nắng, thời tiết thay đổi nhanh",
      "Mặc cả nhẹ nhàng khi mua đồ lưu niệm tại các điểm tham quan",
      "Thử các món hải sản tươi sống ngay trên vịnh – đặc biệt là mực và tôm hùm",
      "Dùng ứng dụng Google Maps offline để không bị mất tín hiệu trên vịnh",
    ],
    reviews: [
      { author: "Trần Minh Quân", rating: 5, text: "Theo đúng lịch trình này và chuyến đi thật tuyệt vời! Ngân sách rất chính xác và hợp lý.", date: "2 tuần trước" },
      { author: "Lê Thị Hương", rating: 5, text: "Hành trình hoàn hảo! Các mẹo rất hữu ích, đặc biệt là lời khuyên đặt tàu sớm.", date: "1 tháng trước" },
      { author: "Phạm Đức Anh", rating: 4, text: "Nhật ký tuyệt vời! Nên thêm một ngày dự phòng nếu thời tiết xấu.", date: "2 tháng trước" },
    ],
    related: [
      { id: "2", title: "Thiên Đường Phú Quốc 5 Ngày", duration: "5 ngày", budget: "7.800.000₫", trustScore: 95, image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "4", title: "Phố Cổ Hội An 5 Ngày", duration: "5 ngày", budget: "6.200.000₫", trustScore: 96, image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },

  "2": {
    id: "2",
    title: "Thiên Đường Phú Quốc 5 Ngày",
    location: "Đảo Phú Quốc, Kiên Giang",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1758737921838-1667dea05df3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1769966734263-629101d6d6ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1680096025643-d41f6aeff989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1680096025643-d41f6aeff989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Nguyễn Hoàng Anh",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Bãi biển Phú Quốc nước trong xanh như pha lê, cát trắng mịn không kém Maldives!",
        rating: 5,
        date: "1 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1769966734263-629101d6d6ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Phạm Thị Lan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Hoàng hôn tại Dinh Cậu – cảnh đẹp nhất mình từng chụp, màu trời như lửa!",
        rating: 5,
        date: "3 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1644633539216-f0042ac2d839?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Vũ Minh Khoa",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Lặn biển ngắm san hô – nước trong vắt có thể thấy đáy, cá nhiều vô kể!",
        rating: 4,
        date: "1 tháng trước",
      },
    ],
    author: {
      name: "Trần Thị Hương",
      avatar: "https://images.unsplash.com/photo-1595085610896-fb31cfd5d4b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 9,
      followersCount: 1850,
    },
    trustScore: 95,
    duration: "5 ngày",
    dates: "1–5 tháng 7, 2026",
    totalBudget: "7.800.000₫",
    groupSize: "2 người",
    description:
      "Phú Quốc – hòn đảo ngọc của Việt Nam với những bãi biển trong xanh tuyệt đẹp, rừng nguyên sinh bao phủ và ẩm thực hải sản tươi ngon. Hành trình 5 ngày đưa bạn khám phá toàn bộ vẻ đẹp hoang sơ lẫn hiện đại của đảo – từ những buổi hoàng hôn tuyệt vời tại Dinh Cậu đến cáp treo dài nhất thế giới tại Hòn Thơm.",
    timeline: [
      {
        day: 1,
        title: "Đến Phú Quốc – Bãi Sao & Dinh Cậu",
        activities: [
          "Bay từ Hà Nội/TP.HCM đến sân bay Phú Quốc",
          "Nhận phòng resort, nghỉ ngơi",
          "Chiều: tắm biển tại bãi Sao – bãi đẹp nhất đảo",
          "Tối: ngắm hoàng hôn tại Dinh Cậu, ăn hải sản chợ đêm",
        ],
        budget: "1.800.000₫",
      },
      {
        day: 2,
        title: "Cáp Treo Hòn Thơm & Snorkeling",
        activities: [
          "Đi cáp treo Hòn Thơm – dài nhất thế giới",
          "Lặn biển ngắm san hô tại vùng nước trong vắt",
          "Ăn trưa hải sản tươi tại nhà hàng nổi",
          "Chiều: thư giãn tại hồ bơi resort",
        ],
        budget: "1.600.000₫",
      },
      {
        day: 3,
        title: "Vườn Quốc Gia & Làng Chài Hàm Ninh",
        activities: [
          "Tham quan Vườn Quốc Gia Phú Quốc",
          "Thăm làng chài Hàm Ninh cổ kính",
          "Thưởng thức ghẹ Hàm Ninh nướng nổi tiếng",
          "Tối: thưởng thức show âm nhạc tại Grand World",
        ],
        budget: "1.500.000₫",
      },
      {
        day: 4,
        title: "Tour 3 Đảo & Câu Cá",
        activities: [
          "Tour 3 đảo: Hòn Dừa, Hòn Roi, Hòn Móng Tay",
          "Câu cá trên biển cùng ngư dân địa phương",
          "Nướng cá câu được ngay trên thuyền",
          "Khám phá nhà máy nước mắm Phú Quốc lâu đời",
        ],
        budget: "1.400.000₫",
      },
      {
        day: 5,
        title: "Mua Sắm & Về Nhà",
        activities: [
          "Sáng sớm: tắm biển lần cuối",
          "Mua đặc sản: nước mắm, hồ tiêu, rượu sim Phú Quốc",
          "Ăn trưa phở cá đặc trưng Phú Quốc",
          "Ra sân bay, kết thúc hành trình",
        ],
        budget: "1.500.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Vé máy bay khứ hồi", amount: "2.800.000₫", percentage: 36 },
      { category: "Resort & Lưu trú", amount: "2.200.000₫", percentage: 28 },
      { category: "Ăn uống & Hải sản", amount: "1.500.000₫", percentage: 19 },
      { category: "Tour & Hoạt động", amount: "900.000₫", percentage: 12 },
      { category: "Mua sắm đặc sản", amount: "400.000₫", percentage: 5 },
    ],
    budgetNotes: [
      "Giá vé máy bay có thể thay đổi theo mùa, nên đặt sớm để tiết kiệm",
      "Resort 3 sao khu vực bãi Trường, tính cho 2 người/phòng",
      "Tour 3 đảo bao gồm bữa trưa hải sản trên thuyền",
      "Mùa cao điểm tháng 12–4, giá có thể cao hơn 30–50%",
    ],
    tips: [
      "Tránh đến vào mùa mưa (tháng 5–10), biển thường động và khó tắm",
      "Cáp treo Hòn Thơm nên đi vào buổi sáng để tránh nắng và xếp hàng",
      "Mặc cả khi mua hải sản ở chợ đêm, giá thường cao hơn 30% so với người địa phương",
      "Thuê xe máy khoảng 120.000–150.000₫/ngày để tự do khám phá đảo",
      "Ghẹ Hàm Ninh là đặc sản không thể bỏ qua, chọn con còn sống để đảm bảo tươi ngon",
    ],
    reviews: [
      { author: "Nguyễn Hoàng Anh", rating: 5, text: "Lịch trình hợp lý, không quá dày đặc. Bãi Sao đúng là thiên đường!", date: "1 tuần trước" },
      { author: "Phạm Thị Lan", rating: 5, text: "Cáp treo Hòn Thơm trải nghiệm tuyệt vời, view đẹp không tưởng. Ngân sách khá chính xác.", date: "3 tuần trước" },
      { author: "Vũ Minh Khoa", rating: 4, text: "Tuyệt vời! Chỉ thiếu thêm mẹo về thời điểm tốt nhất để lặn biển.", date: "1 tháng trước" },
    ],
    related: [
      { id: "1", title: "Khám Phá Vịnh Hạ Long 5 Ngày", duration: "5 ngày", budget: "8.500.000₫", trustScore: 98, image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "5", title: "Đà Nẵng – Thành Phố Biển 4 Ngày", duration: "4 ngày", budget: "6.500.000₫", trustScore: 97, image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },

  "3": {
    id: "3",
    title: "Sa Pa – Ruộng Bậc Thang Mùa Lúa Chín",
    location: "Sa Pa, Lào Cai",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1746956302891-2123ed53b0f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1765503652747-ec6eb893092f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1694152491000-0cf654070339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1657445449727-017d2f9f44e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1694152491000-0cf654070339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Đặng Thị Tuyết",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Ruộng bậc thang mùa lúa chín vàng óng – màu sắc không cần chỉnh filter!",
        rating: 5,
        date: "3 ngày trước",
      },
      {
        url: "https://images.unsplash.com/photo-1663564000694-a440edf76cd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Hoàng Văn Phúc",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Đi bộ qua bản làng người H'Mông, gặp những nụ cười thật sự chân thành!",
        rating: 5,
        date: "2 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1657445449727-017d2f9f44e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Bùi Thị Ngọc",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Sáng sớm Sa Pa sương mù giăng mờ trên thung lũng – như lạc vào chốn tiên cảnh!",
        rating: 5,
        date: "1 tháng trước",
      },
    ],
    author: {
      name: "Lê Văn Tuấn",
      avatar: "https://images.unsplash.com/photo-1695485121912-25c7ea05119c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 22,
      followersCount: 5100,
    },
    trustScore: 99,
    duration: "4 ngày",
    dates: "15–18 tháng 9, 2026",
    totalBudget: "5.200.000₫",
    groupSize: "3 người",
    description:
      "Tháng 9 là thời điểm vàng để chinh phục Sa Pa – khi những thửa ruộng bậc thang bắt đầu chuyển màu vàng óng tuyệt đẹp. Hành trình 4 ngày đưa bạn qua các bản làng dân tộc H'Mông, Dao Đỏ, trek qua những cánh đồng lúa mê hoặc và đỉnh núi Fansipan – nóc nhà Đông Dương.",
    timeline: [
      {
        day: 1,
        title: "Hà Nội – Sa Pa bằng Tàu Đêm",
        activities: [
          "Lên tàu hỏa Hà Nội – Lào Cai lúc 22h",
          "Ngủ trên tàu, tiết kiệm cả đêm khách sạn",
          "Đến Lào Cai sáng sớm, xe đón lên Sa Pa",
          "Nhận phòng, nghỉ ngơi, ăn sáng Sa Pa",
        ],
        budget: "600.000₫",
      },
      {
        day: 2,
        title: "Trek Bản Cát Cát & Ruộng Bậc Thang",
        activities: [
          "Trekking xuống bản Cát Cát của người H'Mông",
          "Ngắm thác nước và cối xay nước cổ truyền",
          "Chụp ảnh ruộng bậc thang mùa lúa chín vàng",
          "Tối: thưởng thức thịt lợn cắp nách và rượu táo mèo",
        ],
        budget: "1.200.000₫",
      },
      {
        day: 3,
        title: "Chinh Phục Fansipan – Nóc Nhà Đông Dương",
        activities: [
          "Cáp treo lên Fansipan (3.143m)",
          "Leo bộ lên đỉnh, chinh phục nóc nhà Đông Dương",
          "Chụp ảnh với tấm biển Fansipan 3143m",
          "Khám phá chùa Fansipan trên đỉnh núi",
        ],
        budget: "1.600.000₫",
      },
      {
        day: 4,
        title: "Bản Lao Chải & Tả Van – Về Hà Nội",
        activities: [
          "Trek buổi sáng qua bản Lao Chải và Tả Van",
          "Giao lưu với người Dao Đỏ, xem dệt thổ cẩm",
          "Mua đặc sản: gạo Séng Cù, rau cải Sa Pa",
          "Xuống Lào Cai, tàu đêm về Hà Nội",
        ],
        budget: "1.800.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Di chuyển (tàu hỏa + xe)", amount: "1.400.000₫", percentage: 27 },
      { category: "Lưu trú (3 đêm)", amount: "1.500.000₫", percentage: 29 },
      { category: "Cáp treo Fansipan", amount: "750.000₫", percentage: 14 },
      { category: "Ăn uống", amount: "900.000₫", percentage: 17 },
      { category: "Hướng dẫn viên & Tour", amount: "400.000₫", percentage: 8 },
      { category: "Mua sắm đặc sản", amount: "250.000₫", percentage: 5 },
    ],
    budgetNotes: [
      "Giá tính cho 3 người, chia đều chi phí phòng và xe",
      "Mùa lúa chín (tháng 9–10) là thời điểm đẹp nhất, giá phòng cao hơn bình thường",
      "Vé cáp treo Fansipan: người lớn 750.000₫, trẻ em 550.000₫",
      "Nên thuê hướng dẫn viên người địa phương cho các tour trek dài",
    ],
    tips: [
      "Thời điểm lý tưởng nhất: tháng 9 (lúa chín vàng) hoặc tháng 4–5 (lúa xanh mướt)",
      "Mang giày trekking đế chống trơn, đường mòn ẩm ướt và dốc",
      "Mặc áo khoác dù là mùa hè, buổi tối Sa Pa khá lạnh (15–20°C)",
      "Đặt phòng homestay của người H'Mông để có trải nghiệm văn hóa chân thực nhất",
      "Cáp treo lên Fansipan chỉ hoạt động đến 17h30, nên lên sớm để tránh đông",
    ],
    reviews: [
      { author: "Đặng Thị Tuyết", rating: 5, text: "Mùa lúa chín đẹp đến nín thở! Lịch trình này quá hoàn hảo, ngân sách phù hợp với học sinh sinh viên.", date: "3 ngày trước" },
      { author: "Hoàng Văn Phúc", rating: 5, text: "Fansipan là điểm nhấn của chuyến đi. Mẹo về thời tiết rất chuẩn, mình đi đúng tháng 9 trời quang tuyệt.", date: "2 tuần trước" },
      { author: "Bùi Thị Ngọc", rating: 5, text: "Hướng dẫn chi tiết, thân thiện với ngân sách. Homestay H'Mông là trải nghiệm đáng nhớ nhất!", date: "1 tháng trước" },
    ],
    related: [
      { id: "6", title: "Hà Nội – Thủ Đô Ngàn Năm 7 Ngày", duration: "7 ngày", budget: "5.500.000₫", trustScore: 94, image: "https://images.unsplash.com/photo-1727860628226-2d545134f8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "4", title: "Phố Cổ Hội An 5 Ngày", duration: "5 ngày", budget: "6.200.000₫", trustScore: 96, image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },

  "4": {
    id: "4",
    title: "Hội An – Phố Cổ Đèn Lồng 5 Ngày",
    location: "Phố Cổ Hội An, Quảng Nam",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1694925232363-ebd99f29cc19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1761150285075-5a686b100ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1696215105730-fa23954dd164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1668184599395-14e6a15fadcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1696215105730-fa23954dd164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Nguyễn Bảo Châu",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Đêm rằm Hội An lên đèn – hàng ngàn chiếc đèn lồng rực rỡ phản chiếu trên sông!",
        rating: 5,
        date: "5 ngày trước",
      },
      {
        url: "https://images.unsplash.com/photo-1560633172-7e66817c64d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Trần Hữu Nghĩa",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Sông Hoài yên tĩnh buổi sáng, thuyền hoa đăng trôi nhẹ – khoảnh khắc bình yên tuyệt đối!",
        rating: 5,
        date: "3 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1668184599395-14e6a15fadcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Lý Thị Kim Anh",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Con phố màu vàng đặc trưng của Hội An vào buổi sáng, trước khi đông khách du lịch.",
        rating: 4,
        date: "2 tháng trước",
      },
    ],
    author: {
      name: "Trần Phương Linh",
      avatar: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 18,
      followersCount: 4200,
    },
    trustScore: 96,
    duration: "5 ngày",
    dates: "10–14 tháng 4, 2026",
    totalBudget: "6.200.000₫",
    groupSize: "2 người",
    description:
      "Hội An – thành phố của ánh đèn lồng lung linh và những con phố cổ nhuốm màu thời gian. Hành trình 5 ngày khám phá phố cổ di sản UNESCO, làng rau Trà Quế, làng gốm Thanh Hà, tắm biển Cửa Đại và học nấu ăn ẩm thực miền Trung đặc sắc. Điểm đến lý tưởng cho những tâm hồn yêu văn hóa và nghệ thuật.",
    timeline: [
      {
        day: 1,
        title: "Bay Đến Đà Nẵng – Vào Hội An",
        activities: [
          "Bay từ Hà Nội/TP.HCM đến Đà Nẵng",
          "Xe đến Hội An, nhận phòng khách sạn phố cổ",
          "Chiều: dạo phố cổ, tham quan Chùa Cầu Nhật Bản",
          "Tối: thả đèn hoa đăng trên sông Hoài",
        ],
        budget: "1.500.000₫",
      },
      {
        day: 2,
        title: "Phố Cổ & Học Nấu Ăn Hội An",
        activities: [
          "Tham quan Hội quán Phúc Kiến, nhà cổ Tấn Ký",
          "Học nấu món Cao Lầu, Mì Quảng tại lớp cooking class",
          "Ăn trưa với những món vừa nấu được",
          "Tối: thưởng thức Bánh Mì Phượng – nổi tiếng nhất thế giới",
        ],
        budget: "1.200.000₫",
      },
      {
        day: 3,
        title: "Làng Rau Trà Quế & Làng Gốm Thanh Hà",
        activities: [
          "Đạp xe ra làng rau Trà Quế (cách trung tâm 3km)",
          "Trải nghiệm làm nông dân một ngày",
          "Thăm làng gốm Thanh Hà hàng trăm năm tuổi",
          "Tự tay nặn gốm cùng nghệ nhân địa phương",
        ],
        budget: "1.000.000₫",
      },
      {
        day: 4,
        title: "Bãi Biển Cửa Đại & An Bàng",
        activities: [
          "Thuê xe đạp ra bãi biển Cửa Đại",
          "Tắm biển, chụp ảnh, thư giãn",
          "Ăn trưa hải sản tươi tại nhà hàng ven biển",
          "Chiều: spa và massage thư giãn",
        ],
        budget: "1.200.000₫",
      },
      {
        day: 5,
        title: "Chợ Hội An & Về Nhà",
        activities: [
          "Sáng sớm: chụp ảnh phố cổ khi chưa đông khách",
          "Mua đặc sản: đèn lồng, Bánh Đậu Xanh, Cao Lầu khô",
          "Ăn Bún Bò Nam Bộ – đặc sản buổi sáng",
          "Ra sân bay Đà Nẵng, kết thúc hành trình",
        ],
        budget: "1.300.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Vé máy bay khứ hồi", amount: "2.400.000₫", percentage: 39 },
      { category: "Khách sạn phố cổ (4 đêm)", amount: "1.600.000₫", percentage: 26 },
      { category: "Ăn uống & Ẩm thực", amount: "1.200.000₫", percentage: 19 },
      { category: "Tham quan & Hoạt động", amount: "700.000₫", percentage: 11 },
      { category: "Di chuyển & Mua sắm", amount: "300.000₫", percentage: 5 },
    ],
    budgetNotes: [
      "Giá phòng khách sạn 3 sao trong khu phố cổ tính cho 2 người/phòng",
      "Cooking class bao gồm nguyên liệu và bữa ăn, giá khoảng 450.000₫/người",
      "Thuê xe đạp: 50.000–80.000₫/ngày – cách di chuyển tốt nhất trong phố cổ",
      "Đêm rằm hàng tháng: phố cổ tắt điện, thắp đèn lồng – không thể bỏ lỡ",
    ],
    tips: [
      "Đến vào đêm rằm (14–15 âm lịch) để xem Hội An lên đèn – trải nghiệm huyền ảo không đâu có",
      "Mặc áo dài khi chụp ảnh ở phố cổ – có thể thuê với giá 100.000–200.000₫",
      "Bánh Mì Phượng (đường Phan Châu Trinh) mở cửa từ 6h30, nên đến sớm tránh xếp hàng dài",
      "Đặt xe chạy bằng điện (khoảng 50.000₫) từ Đà Nẵng để tiết kiệm và thân thiện môi trường",
      "Tháng 10–11 là mùa mưa ở Hội An, nên mang áo mưa và sẵn sàng cho khả năng ngập lụt nhẹ",
    ],
    reviews: [
      { author: "Nguyễn Bảo Châu", rating: 5, text: "Hội An về đêm đẹp như tranh vẽ! Lịch trình cooking class là điểm nhấn tuyệt vời.", date: "5 ngày trước" },
      { author: "Trần Hữu Nghĩa", rating: 5, text: "Ngân sách rất hợp lý cho 2 người. Mẹo chụp ảnh buổi sáng sớm cực kỳ đúng!", date: "3 tuần trước" },
      { author: "Lý Thị Kim Anh", rating: 4, text: "Trải nghiệm làm gốm Thanh Hà rất thú vị. Ước gì lịch trình có thêm ngày tham quan Mỹ Sơn.", date: "2 tháng trước" },
    ],
    related: [
      { id: "5", title: "Đà Nẵng – Thành Phố Biển 4 Ngày", duration: "4 ngày", budget: "6.500.000₫", trustScore: 97, image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "1", title: "Khám Phá Vịnh Hạ Long 5 Ngày", duration: "5 ngày", budget: "8.500.000₫", trustScore: 98, image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },

  "5": {
    id: "5",
    title: "Đà Nẵng – Thành Phố Biển 4 Ngày",
    location: "Đà Nẵng, Miền Trung",
    country: "Việt Nam",
    image: "https://images.unsplash.com/flagged/photo-1583863374731-4224cbbc8c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1700816287310-48009ac7421f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1684576528299-59f1a4e0f167?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1663684591502-93887202a863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1751809999890-ac8de99f705a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1696215105108-c160f08cad88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Ngô Thị Thu Hà",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Cầu Rồng phun lửa – show diễn ngoài trời hoành tráng nhất mình từng xem!",
        rating: 5,
        date: "1 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1663684591502-93887202a863?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Đinh Xuân Bách",
        avatar: "https://images.unsplash.com/photo-1560250097-0dc05786f0d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Cầu Vàng trên Bà Nà Hills – đôi bàn tay khổng lồ nâng đỡ cây cầu, view mây mù huyền ảo!",
        rating: 5,
        date: "2 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1751809999890-ac8de99f705a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Cao Thị Minh Châu",
        avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Đà Nẵng nhìn từ trên cao – thành phố biển đẹp nhất Việt Nam không sai!",
        rating: 4,
        date: "1 tháng trước",
      },
    ],
    author: {
      name: "Lê Hoàng Anh",
      avatar: "https://images.unsplash.com/photo-1656313826909-1f89d1702a81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 11,
      followersCount: 2700,
    },
    trustScore: 97,
    duration: "4 ngày",
    dates: "20–23 tháng 5, 2026",
    totalBudget: "6.500.000₫",
    groupSize: "2 người",
    description:
      "Đà Nẵng – thành phố đáng sống nhất Việt Nam với đường bờ biển Mỹ Khê tuyệt đẹp, cầu Rồng phun lửa về đêm, Bà Nà Hills huyền ảo trên mây và ẩm thực miền Trung đậm đà. Hành trình 4 ngày cân bằng giữa biển – núi – thành phố, trọn vẹn tinh hoa của vùng đất miền Trung đầy nắng gió.",
    timeline: [
      {
        day: 1,
        title: "Đến Đà Nẵng – Cầu Vàng & Bà Nà Hills",
        activities: [
          "Bay đến Đà Nẵng, nhận phòng khách sạn gần biển Mỹ Khê",
          "Cáp treo lên Bà Nà Hills (1.487m)",
          "Đặt chân lên Cầu Vàng – biểu tượng của Đà Nẵng",
          "Khám phá làng Pháp, Fantasy Park trên đỉnh núi",
        ],
        budget: "1.800.000₫",
      },
      {
        day: 2,
        title: "Biển Mỹ Khê & Cầu Rồng",
        activities: [
          "Sáng: tắm biển Mỹ Khê – bãi biển đẹp nhất châu Á",
          "Ăn trưa bún mắm nêm đặc sản Đà Nẵng",
          "Chiều: thăm Bảo tàng Điêu khắc Chăm",
          "Tối: xem Cầu Rồng phun lửa (thứ 7 & Chủ nhật 21h)",
        ],
        budget: "1.500.000₫",
      },
      {
        day: 3,
        title: "Ngũ Hành Sơn & Hội An Day Trip",
        activities: [
          "Tham quan Ngũ Hành Sơn – núi đá cẩm thạch huyền bí",
          "Xem nghệ nhân điêu khắc đá tại làng nghề",
          "Ngày trip xuống Hội An ăn trưa, dạo phố cổ",
          "Tối về Đà Nẵng, ăn hải sản bờ biển",
        ],
        budget: "1.600.000₫",
      },
      {
        day: 4,
        title: "Bán Đảo Sơn Trà & Về Nhà",
        activities: [
          "Sáng sớm: tour đỉnh Bán Đảo Sơn Trà, ngắm thành phố từ trên cao",
          "Tham quan chùa Linh Ứng – tượng Phật bà lớn nhất Việt Nam",
          "Ăn bữa cuối: bánh tráng cuốn thịt heo đặc sản Đà Nẵng",
          "Ra sân bay, kết thúc hành trình",
        ],
        budget: "1.600.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Vé máy bay khứ hồi", amount: "2.500.000₫", percentage: 38 },
      { category: "Khách sạn gần biển (3 đêm)", amount: "1.800.000₫", percentage: 28 },
      { category: "Vé Bà Nà Hills", amount: "850.000₫", percentage: 13 },
      { category: "Ăn uống", amount: "900.000₫", percentage: 14 },
      { category: "Di chuyển & Tham quan", amount: "450.000₫", percentage: 7 },
    ],
    budgetNotes: [
      "Vé Bà Nà Hills người lớn khoảng 850.000₫, bao gồm cáp treo và các show",
      "Khách sạn 3 sao cách biển Mỹ Khê 200m, giá tính cho 2 người/phòng",
      "Cầu Rồng phun lửa miễn phí xem, chỉ vào tối thứ 7 và Chủ nhật",
      "Thuê xe máy 120.000₫/ngày để dễ dàng khám phá toàn thành phố",
    ],
    tips: [
      "Cầu Rồng phun lửa và nước chỉ vào tối thứ 7 và Chủ nhật lúc 21h – đừng bỏ lỡ",
      "Bà Nà Hills nên đi vào ngày thường (thứ 3–5) để tránh đông đúc cuối tuần",
      "Biển Mỹ Khê đẹp nhất lúc bình minh (5h30–7h), ánh sáng hoàn hảo để chụp ảnh",
      "Mì Quảng và Bún Chả Cá là 2 món phải ăn khi đến Đà Nẵng",
      "Grab hoặc taxi Be giá hợp lý hơn taxi truyền thống, nên cài app trước khi đi",
    ],
    reviews: [
      { author: "Ngô Thị Thu Hà", rating: 5, text: "Cầu Vàng tuyệt đẹp hơn mọi hình ảnh! Lịch trình 4 ngày vừa đủ để trải nghiệm Đà Nẵng.", date: "1 tuần trước" },
      { author: "Đinh Xuân Bách", rating: 5, text: "Ngân sách hợp lý, lịch trình không quá gấp. Bán đảo Sơn Trà buổi sáng cực kỳ đẹp!", date: "2 tuần trước" },
      { author: "Cao Thị Minh Châu", rating: 4, text: "Hải sản Đà Nẵng ngon không kém Phú Quốc. Mẹo về Cầu Rồng phun lửa rất hữu ích.", date: "1 tháng trước" },
    ],
    related: [
      { id: "4", title: "Hội An – Phố Cổ Đèn Lồng 5 Ngày", duration: "5 ngày", budget: "6.200.000₫", trustScore: 96, image: "https://images.unsplash.com/photo-1643030080539-b411caf44c37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "2", title: "Thiên Đường Phú Quốc 5 Ngày", duration: "5 ngày", budget: "7.800.000₫", trustScore: 95, image: "https://images.unsplash.com/photo-1693282815546-f7eeb0fa909b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },

  "6": {
    id: "6",
    title: "Hà Nội – Thủ Đô Ngàn Năm 7 Ngày",
    location: "Hà Nội, Miền Bắc",
    country: "Việt Nam",
    image: "https://images.unsplash.com/photo-1727860628226-2d545134f8a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    gallery: [
      "https://images.unsplash.com/photo-1758485780327-f53204cb5b6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1767185623490-83e4a61f5e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1683880392922-ce66f007d08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      "https://images.unsplash.com/photo-1758104372177-6a234763a29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    ],
    reviewPhotos: [
      {
        url: "https://images.unsplash.com/photo-1758104372177-6a234763a29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Trịnh Thị Hoa",
        avatar: "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Phố cổ Hà Nội buổi sáng – xe máy, hàng rong, mùi phở bốc khói. Thật đúng Hà Nội!",
        rating: 5,
        date: "4 ngày trước",
      },
      {
        url: "https://images.unsplash.com/photo-1683880392922-ce66f007d08d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Phan Minh Đức",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Đền Ngọc Sơn và Hồ Hoàn Kiếm – biểu tượng tâm hồn Hà Nội ngàn năm!",
        rating: 5,
        date: "2 tuần trước",
      },
      {
        url: "https://images.unsplash.com/photo-1758104372690-0e14bc4dec5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
        reviewer: "Lưu Thị Hằng",
        avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100",
        caption: "Ẩm thực đường phố Hà Nội phong phú vô cùng – mỗi góc phố là một hương vị khác nhau!",
        rating: 4,
        date: "3 tuần trước",
      },
    ],
    author: {
      name: "Nguyễn Minh Khoa",
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      diariesCount: 30,
      followersCount: 8500,
    },
    trustScore: 94,
    duration: "7 ngày",
    dates: "1–7 tháng 10, 2026",
    totalBudget: "5.500.000₫",
    groupSize: "1 người",
    description:
      "Hà Nội – thủ đô ngàn năm tuổi với 36 phố phường huyền thoại, hồ Hoàn Kiếm thơ mộng, Văn Miếu Quốc Tử Giám cổ kính và nền ẩm thực đường phố phong phú bậc nhất Đông Nam Á. Hành trình 7 ngày khám phá toàn bộ chiều sâu văn hóa, lịch sử và ẩm thực của thủ đô ngàn năm văn hiến.",
    timeline: [
      {
        day: 1,
        title: "Đến Hà Nội – Hồ Hoàn Kiếm & Phố Cổ",
        activities: [
          "Nhận phòng khách sạn khu phố cổ Hà Nội",
          "Dạo bộ quanh Hồ Hoàn Kiếm, thăm đền Ngọc Sơn",
          "Khám phá 36 phố phường – mỗi phố một nghề truyền thống",
          "Tối: ăn Bún Chả trứ danh, uống cà phê trứng",
        ],
        budget: "600.000₫",
      },
      {
        day: 2,
        title: "Lăng Bác & Bảo Tàng Lịch Sử",
        activities: [
          "Viếng Lăng Chủ tịch Hồ Chí Minh (xếp hàng từ 7h)",
          "Tham quan Bảo tàng Hồ Chí Minh, Phủ Chủ tịch",
          "Thăm chùa Một Cột – biểu tượng Phật giáo Việt Nam",
          "Bảo tàng Mỹ thuật Việt Nam",
        ],
        budget: "700.000₫",
      },
      {
        day: 3,
        title: "Văn Miếu & Hoàng Thành Thăng Long",
        activities: [
          "Tham quan Văn Miếu – Quốc Tử Giám lịch sử",
          "Hoàng Thành Thăng Long – di sản UNESCO",
          "Ăn trưa Phở Hà Nội chính gốc",
          "Chiều: Phố Sách Đinh Lễ, mua sách và đặc sản",
        ],
        budget: "800.000₫",
      },
      {
        day: 4,
        title: "Day Trip Ninh Bình – Tràng An",
        activities: [
          "Xe đến Ninh Bình (2 tiếng)",
          "Chèo thuyền qua Tràng An – Di sản Thế giới",
          "Leo lên Hang Múa ngắm toàn cảnh Tam Cốc",
          "Thưởng thức dê núi Ninh Bình nổi tiếng",
        ],
        budget: "1.000.000₫",
      },
      {
        day: 5,
        title: "Làng Gốm Bát Tràng & Ẩm Thực",
        activities: [
          "Xe buýt ra làng gốm Bát Tràng (cách trung tâm 15km)",
          "Tự tay làm và vẽ gốm cùng nghệ nhân",
          "Mua đồ gốm làm quà lưu niệm",
          "Tối: tham gia Phố Đi Bộ Hồ Gươm cuối tuần",
        ],
        budget: "800.000₫",
      },
      {
        day: 6,
        title: "Hà Nội Phố Tây & Hồ Tây",
        activities: [
          "Sáng: dạo bộ quanh Hồ Tây, thăm chùa Trấn Quốc",
          "Khám phá phố Tây Tạ Hiện – cà phê và bia hơi",
          "Trải nghiệm Bia Hơi Hà Nội chính gốc",
          "Tối: xem múa rối nước tại Nhà hát Thăng Long",
        ],
        budget: "700.000₫",
      },
      {
        day: 7,
        title: "Chợ Đồng Xuân & Về Nhà",
        activities: [
          "Sáng sớm: chụp ảnh Hà Nội lúc bình minh",
          "Chợ Đồng Xuân – chợ lớn nhất Hà Nội, mua đặc sản",
          "Ăn Bánh Cuốn Thanh Trì buổi sáng",
          "Di chuyển ra sân bay Nội Bài, kết thúc hành trình",
        ],
        budget: "900.000₫",
      },
    ],
    budgetBreakdown: [
      { category: "Lưu trú (6 đêm phố cổ)", amount: "1.800.000₫", percentage: 33 },
      { category: "Ăn uống & Ẩm thực đường phố", amount: "1.400.000₫", percentage: 25 },
      { category: "Di chuyển nội thành & Ninh Bình", amount: "900.000₫", percentage: 16 },
      { category: "Tham quan di tích", amount: "750.000₫", percentage: 14 },
      { category: "Hoạt động trải nghiệm", amount: "400.000₫", percentage: 7 },
      { category: "Mua sắm & Quà lưu niệm", amount: "250.000₫", percentage: 5 },
    ],
    budgetNotes: [
      "Ngân sách tính cho 1 người, không bao gồm vé máy bay (đã có vé từ trước)",
      "Phố cổ Hà Nội có nhiều hostel tốt giá 150.000–200.000₫/đêm cho khách solo",
      "Ẩm thực đường phố Hà Nội vừa ngon vừa rẻ, 3 bữa khoảng 200.000₫/ngày",
      "Xe buýt nội thành 7.000₫/lượt, tiết kiệm hơn nhiều so với taxi",
    ],
    tips: [
      "Đến Lăng Bác từ 7h sáng và mặc trang phục lịch sự, không mang balo vào bên trong",
      "Cà phê trứng Giảng (phố Nguyễn Hữu Huân) – nên thử, đây là đặc sản độc đáo của Hà Nội",
      "Phố đi bộ Hồ Gươm mở cửa tối thứ 6, thứ 7, Chủ nhật và các ngày lễ",
      "Tàu điện Cát Linh – Hà Đông hoạt động từ 5h30 đến 22h, tiện lợi và không tắc đường",
      "Mùa thu Hà Nội (tháng 9–11) là đẹp nhất: trời mát, hoa sữa nở, lá vàng rụng đầy phố",
    ],
    reviews: [
      { author: "Trịnh Thị Hoa", rating: 5, text: "Hà Nội 7 ngày không hề nhàm! Mỗi ngày đều có điểm đến mới thú vị. Ngân sách siêu tiết kiệm mà vẫn đầy đủ trải nghiệm.", date: "4 ngày trước" },
      { author: "Phan Minh Đức", rating: 5, text: "Day trip Ninh Bình là highlight của chuyến đi. Mẹo đi Lăng Bác sáng sớm rất đúng, không phải xếp hàng lâu.", date: "2 tuần trước" },
      { author: "Lưu Thị Hằng", rating: 4, text: "Làng gốm Bát Tràng rất thú vị, nhất là được tự làm gốm. Nên thêm mẹo về thời tiết mùa đông.", date: "3 tuần trước" },
    ],
    related: [
      { id: "3", title: "Sa Pa – Ruộng Bậc Thang 4 Ngày", duration: "4 ngày", budget: "5.200.000₫", trustScore: 99, image: "https://images.unsplash.com/photo-1694152362587-99d77d21793b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
      { id: "1", title: "Khám Phá Vịnh Hạ Long 5 Ngày", duration: "5 ngày", budget: "8.500.000₫", trustScore: 98, image: "https://images.unsplash.com/photo-1547024842-7c86b2226ef5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
    ],
  },
};
