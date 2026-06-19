# 🌍 WanderLab

> WanderLab là nền tảng web du lịch trải nghiệm tích hợp nhật ký hành trình theo timeline và AI cá nhân hóa, giúp người dùng lưu giữ, chia sẻ trải nghiệm thực tế và khám phá các điểm đến hyper-local phù hợp với sở thích cá nhân.

Figma Design: [WanderLab Ver5](https://www.figma.com/design/eDaESMChPbgzQvIVEyznxz/WanderLab-Ver5)

---

## ✨ Tính Năng Chính

| Tính năng | Mô tả |
|---|---|
| 📔 **Nhật Ký Hành Trình (Timeline)** | Lưu giữ và chia sẻ trải nghiệm du lịch thực tế với hình ảnh, lịch trình từng ngày, và ngân sách chi tiết |
| 🤖 **AI Trip Planner Cá Nhân Hóa** | Trợ lý ảo WanderBot tư vấn điểm đến và tự động lập lịch trình tối ưu dựa trên sở thích cá nhân |
| 🔍 **Khám Phá Hyper-local** | Tìm kiếm điểm đến độc đáo, trải nghiệm văn hóa địa phương qua lăng kính cộng đồng du khách |
| 💬 **Kết Nối Cộng Đồng** | Nhắn tin trực tiếp, theo dõi, kết nối với những người có chung đam mê xê dịch |
| 💳 **Gói Subscription** | Nâng cấp trải nghiệm (Free / Starter / Professional) tích hợp thanh toán VNPay |
| 🛡️ **Admin Panel** | Quản lý người dùng, kiểm duyệt nội dung, và giám sát hiệu suất hệ thống AI |

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite 6.3
- TailwindCSS v4 + shadcn/ui
- React Router v7
- Zustand (State Management)
- TanStack React Query (API Caching)
- Motion / Framer Motion (Animations)

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)

**AI:** Google Gemini API  
**Payment:** VNPay Sandbox

## 📂 Cấu Trúc Thư Mục

```text
WanderLab/
├── database/                    # Script, cấu hình và SQL về database
│   ├── 00_init_database.sql     # Script khởi tạo các bảng chính
│   ├── 01_messages_table.sql    # Script khởi tạo tính năng Chat
│   ├── 02_seed_mock_data.sql    # Dữ liệu mẫu (Người dùng, Nhật ký, Địa điểm)
│   └── 03_seed_admin.sql        # Script tạo tài khoản Admin
├── document/                    # 📄 Tài liệu dự án (Overview, DB Schema, API, Roadmap)
├── guidelines/                  # Tài liệu hướng dẫn (code conventions, contribution)
├── src/                         # 💻 Source code chính
│   ├── api/                     # Services gọi API (client, diary, friend, message, story)
│   ├── app/
│   │   ├── components/          # React components
│   │   │   ├── auth/            # Các component bảo vệ route (ProtectedRoute)
│   │   │   ├── common/          # Components dùng chung (ErrorBoundary, Loading, EmptyState)
│   │   │   ├── figma/           # Các component xuất từ Figma (ImageWithFallback)
│   │   │   ├── ui/              # shadcn/ui components (button, input, dialog,...)
│   │   │   └── wander/          # Custom components của WanderLab (WanderNav, ChatBox,...)
│   │   ├── data/                # Dữ liệu tĩnh và mock data (destinations, vietnamPaths)
│   │   ├── hooks/               # Custom React hooks (useSavedItineraries)
│   │   ├── pages/               # Các trang giao diện chính
│   │   │   ├── admin/           # Trang quản trị (AdminDashboard)
│   │   │   ├── auth/            # Các trang xác thực (ForgotPassword, ResetPassword)
│   │   │   └── wander/          # Các trang người dùng (Landing, Dashboard, Explore, Create...)
│   │   ├── routes.tsx           # Cấu hình React Router định tuyến
│   │   └── App.tsx              # Root component thiết lập Layout, Providers
│   ├── assets/                  # 🖼️ Hình ảnh, icons tĩnh (png, svg)
│   ├── imports/                 # 📝 Tài liệu markdown guidelines bổ sung
│   ├── lib/                     # Cấu hình thư viện ngoài (Supabase client)
│   ├── stores/                  # Zustand state management stores
│   ├── styles/                  # Global CSS, cấu hình Tailwind và Theme
│   ├── types/                   # TypeScript interfaces (user, diary, chat, itinerary,...)
│   ├── utils/                   # Utilities & constants (format data, vietnamProvinces)
│   └── main.tsx                 # Entry point của ứng dụng React
├── .env                         # Biến môi trường local (chứa API keys)
├── index.html                   # HTML template chính
├── package.json                 # Khai báo dependencies và scripts
├── postcss.config.mjs           # Cấu hình PostCSS
├── vercel.json                  # Cấu hình deploy Vercel
├── vite.config.ts               # Cấu hình Vite bundler
└── README.md                    # (file này)
```

## 🗺️ Danh Sách Trang

| Route | Trang | Auth | Mô tả |
|---|---|---|---|
| `/` | Landing | ❌ | Trang chủ, feed nhật ký |
| `/login` | Login | ❌ | Đăng nhập (Email/Google/Facebook) |
| `/register` | Register | ❌ | Đăng ký tài khoản |
| `/forgot-password` | ForgotPassword | ❌ | Quên mật khẩu |
| `/reset-password` | ResetPassword | ❌ | Đặt lại mật khẩu |
| `/guide` | Guide | ❌ | Hướng dẫn sử dụng |
| `/dashboard` | Dashboard | ✅ | Hồ sơ cá nhân (Tổng quan) |
| `/profile/:username` | UserProfile | ✅ | Trang cá nhân người dùng |
| `/explore` | Explore | ❌ | Khám phá nhật ký |
| `/create` | CreateDiary | ✅ | Tạo nhật ký mới |
| `/edit-diary/:id` | EditDiary | ✅ | Chỉnh sửa nhật ký |
| `/diary/:id` | DiaryDetail | ❌ | Chi tiết nhật ký |
| `/create-itinerary` | CreateItinerary | ✅ | AI lập lịch trình |
| `/friends` | Friends | ✅ | Danh sách bạn bè & theo dõi |
| `/groups/:id` | GroupDetail | ✅ | Chi tiết nhóm |
| `/chat` | ChatPage | ✅ | Nhắn tin |
| `/messages` | Messages | ✅ | Quản lý tin nhắn |
| `/notifications` | Notifications | ✅ | Thông báo |
| `/settings` | Settings | ✅ | Cài đặt tài khoản |
| `/partner` | Partner | ❌ | Đối tác & bảng giá |
| `/checkout` | Checkout | ✅ | Thanh toán subscription |
| `/admin-dashboard` | AdminDashboard | ✅ (Admin) | Quản trị hệ thống |

## 🚀 Chạy Project

### Yêu cầu
- Node.js >= 18
- npm >= 9

### Cài đặt & chạy

```bash
# 1. Cài dependencies
npm install

# 2. Tạo file .env (copy từ template)
cp .env.example .env
# Điền credentials Supabase vào .env

# 3. Chạy development server
npm run dev

# 4. Mở trình duyệt tại http://localhost:5173
```

### Lệnh khác

```bash
npm run build      # Build production bundle
npm run preview    # Preview production build
```

> **Lưu ý:** Project có thể chạy ở chế độ demo (không cần Supabase credentials) — sử dụng mock data có sẵn.

### 🧪 Trải Nghiệm Demo

Bạn có thể chạy dự án ở chế độ demo và sử dụng 2 tài khoản sau để kiểm tra toàn bộ tính năng (Mật khẩu chung: `123456`):

- **Tài khoản User:** `vohoangthang2004@gmail.com`
  *(Khám phá tính năng Tạo nhật ký, AI lên lịch trình, Giao lưu cộng đồng, AI Chatbot)*
- **Tài khoản Admin:** `adminwanderlab@gmail.com`
  *(Trải nghiệm bảo mật Route, Admin Dashboard với các tính năng Quản lý người dùng, Kiểm duyệt nội dung, Giám sát hệ thống AI)*

## 📖 Tài Liệu

Chi tiết về thiết kế hệ thống, database schema, API endpoints, lộ trình thực hiện và hướng dẫn deployment nằm trong thư mục [`document/`](./document/):

| File | Nội dung |
|---|---|
| [`01_project_overview.txt`](./document/01_project_overview.txt) | Tổng quan dự án, tính năng, tech stack |
| [`02_database_schema.txt`](./document/02_database_schema.txt) | 15 bảng PostgreSQL + SQL + ERD |
| [`03_api_endpoints.txt`](./document/03_api_endpoints.txt) | Tất cả REST, Auth, Storage, AI, Payment APIs |
| [`04_implementation_roadmap.txt`](./document/04_implementation_roadmap.txt) | Lộ trình 10 sprints chi tiết |
| [`05_deployment_guide.txt`](./document/05_deployment_guide.txt) | Hướng dẫn setup Supabase, Vercel, VNPay |

## 📋 Tiến Độ

- [x] **Phase 1** — Foundation: Dependencies, folder structure, types, stores, common components
- [x] **Phase 2** — Core Features: Auth (Supabase), Diary CRUD, Social interactions (Like, Comment, Follow), File upload
- [x] **Phase 3** — Advanced: Chat realtime, AI chatbot, payments *(Đã hoàn thiện UI & luồng hoạt động)*
  - *Chi tiết: Các tính năng AI Chatbot (`AIAssistant.tsx`), AI Lập lịch trình (`CreateItinerary.tsx`), Thanh toán (`Checkout.tsx`) và Nhắn tin (`ChatPage.tsx`) đã hoàn thiện giao diện xuất sắc và luồng tương tác phía người dùng.*
- [x] **Phase 4** — Admin Panel: Dashboard quản trị *(Đã hoàn thiện toàn bộ tính năng Client-side)*
  - *Chi tiết: Giao diện `AdminDashboard.tsx` đã hoạt động với 4 phân hệ bảo mật: Tổng quan thống kê, Quản lý người dùng, Kiểm duyệt nội dung, và Giám sát AI.*
- [ ] **Phase 5** — Backend Integration & Deploy: Kết nối tính năng Advanced & Admin với API thật và đưa lên môi trường Production.

---

**Môn học:** EXE201 — Entrepreneurship | **Trường:** FPT Education