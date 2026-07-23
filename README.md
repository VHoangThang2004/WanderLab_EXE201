# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) - WanderLab

## 1. Giới thiệu chung
### 1.1 Mục đích
Tài liệu này cung cấp đặc tả yêu cầu phần mềm hoàn chỉnh cho hệ thống WanderLab - một nền tảng mạng xã hội du lịch trải nghiệm tích hợp AI. Tài liệu trình bày chi tiết các yêu cầu chức năng, phi chức năng, cũng như kiến trúc hệ thống phục vụ cho quá trình phát triển, kiểm thử và bảo trì dự án.

### 1.2 Phạm vi dự án
WanderLab là một nền tảng web kết hợp giữa Nhật ký du lịch (Travel Journal), Trợ lý ảo lên lịch trình (AI Trip Planner) và Mạng xã hội cho cộng đồng xê dịch. Sản phẩm giúp người dùng lưu giữ hành trình, khám phá những địa điểm đậm chất địa phương (hyper-local) và kết nối với những người đam mê du lịch.

## 2. Mô tả tổng quan
### 2.1 Đối tượng người dùng
- **Explorer (Khách/Người dùng cơ bản):** Có thể xem nhật ký du lịch của người khác, tìm kiếm điểm đến và tham khảo các lịch trình công khai.
- **Planner (Thành viên đã đăng ký):** Có thể tạo và quản lý nhật ký cá nhân, sử dụng AI để lên lịch trình cá nhân hóa, tương tác xã hội (thích, bình luận, chia sẻ), nhắn tin với người dùng khác và nâng cấp gói thành viên (Subscription).
- **Admin (Quản trị viên):** Có quyền truy cập Admin Dashboard để quản lý người dùng, kiểm duyệt nội dung bị báo cáo, theo dõi doanh thu thực tế và hiệu suất của hệ thống AI.

### 2.2 Môi trường hoạt động
- **Nền tảng:** Web Application, thiết kế hoàn toàn responsive, tương thích đa thiết bị (Desktop, Tablet, Mobile).
- **Trình duyệt hỗ trợ:** Các phiên bản hiện đại của Chrome, Safari, Firefox, Edge.

## 3. Yêu cầu chức năng đã hoàn thiện

### 3.1 Module Xác thực & Hồ sơ (Auth & Profile)
- Hỗ trợ đăng ký và đăng nhập qua Email/Mật khẩu hoặc tài khoản Mạng xã hội (Google, Facebook).
- Quản lý hồ sơ: Cập nhật thông tin cá nhân, thay đổi ảnh đại diện (lưu trữ trên Supabase Storage) và đổi mật khẩu.
- Bảo mật: Tính năng Quên mật khẩu và Đặt lại mật khẩu an toàn.

### 3.2 Module Nhật ký du lịch & Bảng tin xã hội
- Tạo, chỉnh sửa và quản lý nhật ký du lịch theo định dạng dòng thời gian từng ngày.
- Hỗ trợ tải lên hình ảnh minh họa, gắn thẻ vị trí và hệ thống theo dõi ngân sách chi tiết cho từng khoản chi tiêu.
- Khám phá nhật ký từ cộng đồng với các bộ lọc theo điểm đến, phong cách du lịch và ngân sách.
- Tương tác xã hội: Thích, Bình luận, Lưu (Bookmark) và Chia sẻ nhật ký du lịch.

### 3.3 Module AI Trip Planner & Trợ lý ảo
- **WanderBot:** Chatbot AI trực tiếp giải đáp các thắc mắc về du lịch và tư vấn điểm đến.
- **Tạo lịch trình AI:** Tự động tạo lịch trình chuyến đi chi tiết dựa trên các thông tin đầu vào: điểm đến, thời gian, ngân sách và sở thích cá nhân.
- Khám phá địa điểm "Hyper-local": AI phân tích dữ liệu để đề xuất các điểm đến ít người biết nhưng đậm đà bản sắc văn hóa địa phương.

### 3.4 Module Tương tác & Nhắn tin thời gian thực (Realtime Chat)
- Hệ thống nhắn tin trực tiếp 1-1 hoạt động theo thời gian thực (Realtime) không cần tải lại trang.
- Hỗ trợ đa dạng loại tin nhắn: văn bản, hình ảnh, và tệp đính kèm (Word, Excel, PDF, ZIP...).
- Tương tác tin nhắn: Thả cảm xúc (emoji reaction) cho từng tin nhắn riêng biệt.
- Quản lý trạng thái: Đồng bộ trạng thái đã xem/chưa xem và hiển thị thông báo (toast notification) cho tin nhắn mới.
- Giao diện (UI) đã được chuẩn bị sẵn sàng cho các tính năng Gọi thoại / Gọi video trong tương lai.

### 3.5 Module Thanh toán & Nâng cấp tài khoản (Payment)
- Cung cấp các gói đăng ký: Free, Plus, và Pro, mở khóa các tính năng AI nâng cao.
- **Tích hợp cổng thanh toán PayOS:** Hỗ trợ quét mã VietQR tự động.
- **Đồng bộ hóa toàn diện:** 
  - Xử lý cập nhật dự phòng (Fallback Update) trên cả Web và Mobile để tự động nhận diện `orderCode` từ URL khi chuyển hướng về, khắc phục triệt để lỗi không nhận được Webhook ở môi trường Local/Development.
  - Tự động kích hoạt gói đăng ký qua Supabase Edge Functions (Webhook).

### 3.6 Module Quản trị viên (Admin Dashboard)
- **Bảng điều khiển:** Hiển thị thống kê thời gian thực về doanh thu, tăng trưởng người dùng và số lượng nội dung được tạo.
- **Auto-sync PayOS:** Tự động đồng bộ hóa dữ liệu trực tiếp với API của PayOS, dò tìm và cập nhật các đơn hàng trạng thái `PENDING` thành công.
- Quản lý tài khoản: Khóa/Mở khóa tài khoản người dùng.
- Hệ thống kiểm duyệt nội dung đối với các bài viết/nhật ký bị báo cáo.
- Bảng theo dõi hoạt động và hiệu suất của hệ thống AI.

## 4. Yêu cầu phi chức năng
- **Hiệu suất:** Thời gian phản hồi giao diện và tải trang dưới 3 giây. Các tương tác như nhắn tin, thông báo đồng bộ realtime với độ trễ < 500ms.
- **Bảo mật:** Cơ sở dữ liệu được bảo vệ qua Row Level Security (RLS) của PostgreSQL. API thanh toán được xác thực chữ ký chống gian lận.
- **UX/UI:** Thiết kế giao diện tối giản, hiện đại, kết hợp các micro-animation mượt mà. Layout responsive hoàn toàn trên mọi kích thước màn hình.

## 5. Kiến trúc hệ thống & Công nghệ sử dụng
- **Frontend (Client-side):**
  - Framework: React 18 với TypeScript, chạy trên Vite 6.
  - Giao diện/Styling: TailwindCSS v4, Radix UI (shadcn/ui), Material UI. Animation bằng Framer Motion, icon dùng Lucide React.
  - State & Data Management: Zustand (Global State) và TanStack React Query (API Caching).
  - Routing: React Router v7.
- **Backend (BaaS):**
  - Supabase là nền tảng cốt lõi quản lý: PostgreSQL (Database), Authentication, Storage, và Realtime WebSockets (Chat/Notifications).
  - Background processes: Supabase Edge Functions (Xử lý Webhook từ PayOS).
- **Dịch vụ bên thứ ba:**
  - Trí tuệ nhân tạo (AI): Google Gemini API.
  - Cổng thanh toán: PayOS (VietQR Sandbox / Production).
- **Triển khai (Deployment):** Vercel server (Hosting Frontend).

## 6. Cấu trúc thư mục
```text
WanderLab/
├── database/                    # SQL Scripts (khởi tạo tables, storage, policies, triggers)
├── document/                    # Thư mục tài liệu chi tiết (Schema, API, Roadmap)
├── src/
│   ├── api/                     # Các service gọi API (Chat, User, AI, Payment...)
│   ├── app/
│   │   ├── components/          # Tổ chức các React component (auth, ui, common, wander)
│   │   ├── data/                # Mock data & Dữ liệu tĩnh
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Phân chia UI các trang (admin, auth, wander)
│   │   ├── routes.tsx           # Cấu hình định tuyến hệ thống
│   │   └── App.tsx              # Component gốc
│   ├── lib/                     # Cấu hình tích hợp thư viện (Supabase Client, PayOS)
│   ├── stores/                  # Quản lý state ứng dụng (Zustand)
│   ├── styles/                  # CSS Global, Cấu hình Tailwind
│   ├── types/                   # Định nghĩa TypeScript Interfaces/Types
│   └── utils/                   # Các hàm tiện ích/hỗ trợ
├── .env                         # Khai báo biến môi trường
└── package.json                 # Cấu hình dependencies và thông tin dự án
```

## 7. Hướng dẫn cài đặt & Triển khai
### 7.1 Yêu cầu môi trường
- Node.js >= 18
- npm >= 9

### 7.2 Khởi chạy môi trường phát triển (Local)
```bash
# 1. Cài đặt toàn bộ dependencies
npm install

# 2. Khởi tạo file biến môi trường
cp .env.example .env
# Lưu ý: Cập nhật file .env với các thông tin xác thực từ Supabase, Gemini API, và PayOS (VITE_PAYOS_CLIENT_ID, VITE_PAYOS_API_KEY...)

# 3. Chạy server phát triển
npm run dev
# Truy cập ứng dụng tại trình duyệt qua đường dẫn: http://localhost:5173
```

### 7.3 Build & Trải nghiệm Demo
- Để build cho môi trường Production: `npm run build`
- Phục vụ cho mục đích chấm điểm và trải nghiệm (ngay cả khi chưa setup biến môi trường), dự án đã bao gồm mock-data và 2 tài khoản demo (Mật khẩu chung: `123456`):
  - **Tài khoản User:** `vohoangthang2004@gmail.com`
  - **Tài khoản Admin:** `adminwanderlab@gmail.com`

---
*Môn học: EXE201 — Khởi nghiệp | Trường: FPT Education | Trạng thái: Hoàn thành 100% (Giai đoạn 1-5)*
