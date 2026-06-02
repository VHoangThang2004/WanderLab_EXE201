# 🌍 WanderLab

> Nền tảng mạng xã hội du lịch thông minh dành cho người Việt — kết hợp **Nhật ký du lịch**, **AI Trip Planner** và **Cộng đồng du khách**.

Figma Design: [WanderLab Ver5](https://www.figma.com/design/eDaESMChPbgzQvIVEyznxz/WanderLab-Ver5)

---

## ✨ Tính Năng Chính

| Tính năng | Mô tả |
|---|---|
| 📔 **Nhật Ký Du Lịch** | Tạo, chia sẻ nhật ký với ảnh, timeline, ngân sách chi tiết |
| 🤖 **AI Trip Planner** | Chatbot WanderBot tư vấn + tự động lập lịch trình |
| 🔍 **Khám Phá** | Tìm kiếm nhật ký theo địa điểm, phong cách, ngân sách |
| 💬 **Chat & Kết Nối** | Nhắn tin trực tiếp, theo dõi, kết bạn |
| 💳 **Gói Subscription** | Free / Starter / Professional với thanh toán VNPay |
| 🛡️ **Admin Panel** | Quản lý users, kiểm duyệt nội dung, thống kê AI |

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

```
WanderLab/
├── document/                    # 📄 Tài liệu dự án
│   ├── 01_project_overview.txt  #   Tổng quan dự án
│   ├── 02_database_schema.txt   #   Thiết kế DB (15 bảng, SQL)
│   ├── 03_api_endpoints.txt     #   Danh sách API endpoints
│   ├── 04_implementation_roadmap.txt # Lộ trình 10 sprints
│   └── 05_deployment_guide.txt  #   Hướng dẫn deploy
│
├── src/
│   ├── api/                     # Axios HTTP client + interceptors
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/            # ProtectedRoute, GuestRoute
│   │   │   ├── common/          # ErrorBoundary, LoadingSpinner, EmptyState
│   │   │   ├── figma/           # Components export từ Figma
│   │   │   ├── ui/              # shadcn/ui (48 components)
│   │   │   └── wander/          # Custom WanderLab components
│   │   ├── data/                # Mock data (đang thay bằng API)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/wander/        # 14 trang chính (xem bên dưới)
│   │   ├── routes.tsx           # Route configuration
│   │   └── App.tsx              # Root component
│   ├── lib/                     # Supabase client
│   ├── stores/                  # Zustand stores (auth, ui)
│   ├── styles/                  # Global CSS + theme
│   ├── types/                   # TypeScript interfaces
│   └── utils/                   # Utilities (format, constants)
│
├── .env.example                 # Template biến môi trường
├── package.json
├── vite.config.ts
└── README.md                    # (file này)
```

## 🗺️ Danh Sách Trang

| Route | Trang | Auth | Mô tả |
|---|---|---|---|
| `/` | Landing | ❌ | Trang chủ, feed nhật ký |
| `/login` | Login | ❌ | Đăng nhập (Email/Google/Facebook) |
| `/register` | Register | ❌ | Đăng ký tài khoản |
| `/guide` | Guide | ❌ | Hướng dẫn sử dụng |
| `/dashboard` | Dashboard | ✅ | Hồ sơ cá nhân |
| `/explore` | Explore | ❌ | Khám phá nhật ký |
| `/create` | CreateDiary | ✅ | Tạo nhật ký mới |
| `/diary/:id` | DiaryDetail | ❌ | Chi tiết nhật ký |
| `/create-itinerary` | CreateItinerary | ✅ | AI lập lịch trình |
| `/friends` | Friends | ✅ | Bạn bè & theo dõi |
| `/chat` | ChatPage | ✅ | Nhắn tin |
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
- [x] **Phase 2** — Core Features: Diary CRUD, social interactions, file upload (Đã hoàn thiện Dark/Light theme, Đa ngôn ngữ, API Supabase)
- [x] **Phase 3** — Advanced: Chat realtime, AI chatbot lập lịch trình, payments (Đã dựng UI và tích hợp cơ bản)
- [ ] **Phase 4** — Admin & Deploy: Admin panel, testing, production deployment (Đã có UI Admin, đang trong giai đoạn bug fixing & chuẩn bị deploy)

**Cập nhật mới nhất:**
- Đã sửa lỗi chức năng Viết và Submit nhật ký (Diary).
- Hoàn thiện UI và chức năng chuyển đổi ngôn ngữ (Tiếng Anh/Tiếng Việt).
- Thêm chức năng Dark/Light theme và đồng bộ dữ liệu tài khoản người dùng với Supabase.
- Tích hợp dữ liệu các tỉnh thành Việt Nam để tạo nhật ký du lịch.

---

**Môn học:** EXE201 — Entrepreneurship | **Trường:** FPT Education