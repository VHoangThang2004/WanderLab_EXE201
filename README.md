# Software Requirements Specification (SRS) - WanderLab

## 1. Introduction
### 1.1 Purpose
This document provides a complete software requirements specification for the WanderLab system - an AI-integrated experiential travel social network platform. The document details the functional and non-functional requirements, as well as the system architecture, serving the development, testing, and maintenance phases of the project.

### 1.2 Scope
WanderLab is a web platform that combines a Travel Journal, an AI Trip Planner (virtual assistant), and a social network for travelers. The product helps users capture their journeys, explore hyper-local destinations authentically, and connect with a community of travel enthusiasts.

## 2. Overall Description
### 2.1 User Classes
- **Explorer (Guest/Basic User):** Can view other users' travel diaries, search for destinations, and explore public itineraries.
- **Planner (Registered Member):** Can create and manage diaries, use AI to generate personalized itineraries, engage socially (like, comment, share), chat with other users, and upgrade subscription plans.
- **Admin:** Has access to the Admin Dashboard to manage users, moderate reported content, track real-time revenue, and monitor AI system performance.

### 2.2 Operating Environment
- **Platform:** Web Application, fully responsive and cross-device compatible (Desktop, Tablet, Mobile).
- **Supported Browsers:** Modern versions of Chrome, Safari, Firefox, Edge.

## 3. Functional Requirements

### 3.1 Authentication & Profile Module (Auth & Profile)
- Support registration and login via Email/Password or Social accounts (Google, Facebook).
- Profile management: Update personal information, change avatars (stored on Supabase Storage), and change passwords.
- Security features: Secure Forgot Password and Reset Password functionality.

### 3.2 Travel Diary & Social Feed Module
- Create, edit, and manage travel diaries with a day-by-day timeline format.
- Support uploading illustrations, tagging locations, and attaching a detailed budget tracking system for each expense.
- Explore diaries from the community with filters for destination, travel style, and budget.
- Social interactions: Like, Comment, Bookmark, and Share travel diaries.

### 3.3 AI Trip Planner & Virtual Assistant Module (AI Integration)
- **WanderBot:** An AI chatbot that directly answers travel queries and provides destination consulting.
- **AI Itinerary Generation:** Automatically generate detailed trip itineraries based on user inputs including: destination, duration, budget, and personal preferences.
- AI system analyzes data to suggest "hyper-local" destinations that are off the beaten path but rich in local culture.

### 3.4 Interaction & Realtime Chat Module
- 1-1 direct messaging system operating in real-time without requiring page reloads.
- Support for diverse message types: text, images, and document attachments (Word, Excel, PDF, ZIP...).
- Chat interaction features: Drop emoji reactions on individual messages.
- State management: Synchronize read receipts (unread/read status) and display a full-page toast notification for incoming messages.
- User Interface (UI) prepared and integrated for Voice / Video Call features.

### 3.5 Payment & Subscription Module
- Offer multiple subscription tiers: Free, Plus, and Pro, unlocking advanced AI capabilities and extended features.
- Integrate automated VietQR scanning payment gateway via PayOS partner.
- Handle transaction statuses and activate subscription plans fully automatically via Webhooks (Supabase Edge Functions).

### 3.6 Admin Panel Module
- Dashboard displaying real-time statistics on revenue (100% synced with PayOS), user growth, and content creation metrics.
- User account management tools: Ban/Unban user accounts.
- Content Moderation system for reported travel diaries.
- Monitoring board for AI system activity and performance.

## 4. Non-Functional Requirements
- **Performance:** UI response and page load times must be under 3 seconds. Interactions like messaging and system notifications must sync in real-time with latency < 500ms.
- **Security:** The database is protected via PostgreSQL's Row Level Security (RLS). Payment APIs are authenticated using signature verification to prevent fraud.
- **UX/UI:** Minimalist and modern interface design enhanced by smooth micro-animations. Fully responsive layout adapting to various screen sizes.

## 5. System Architecture & Tech Stack
- **Frontend (Client-side):**
  - Framework: React 18 with TypeScript, built on Vite 6.3.
  - UI/Styling: TailwindCSS v4, shadcn/ui. Animations via Framer Motion, and icons via Lucide React.
  - State & Data Management: Zustand (Global State) and TanStack React Query (API Caching).
  - Routing: React Router v7.
- **Backend (BaaS):**
  - Supabase as the core platform managing: PostgreSQL (Database), Authentication, Storage, and Realtime WebSockets (Chat/Notifications).
  - Background processes: Supabase Edge Functions (Handling PayOS Webhooks).
- **Third-Party Services:**
  - Artificial Intelligence (AI): Google Gemini API.
  - Payment Gateway: PayOS (VietQR Sandbox / Production).
- **Deployment:** Vercel server (Frontend Hosting).

## 6. Directory Structure
```text
WanderLab/
├── database/                    # SQL Scripts (init tables, storage, policies, triggers)
├── document/                    # Detailed documentation folder (Schema, API, Roadmap)
├── src/
│   ├── api/                     # API calling services (Chat, User, AI, Payment...)
│   ├── app/
│   │   ├── components/          # React components organization (auth, ui, common, wander)
│   │   ├── data/                # Mock data & Static data
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Page UI breakdown (admin, auth, wander)
│   │   ├── routes.tsx           # System routing configuration
│   │   └── App.tsx              # Root entry component
│   ├── lib/                     # Library integration config (Supabase Client, PayOS)
│   ├── stores/                  # Application state organization (Zustand)
│   ├── styles/                  # Global CSS, Tailwind configurations
│   ├── types/                   # TypeScript Interfaces/Types definitions
│   └── utils/                   # Utility/Helper functions
├── .env                         # Environment variables declaration
└── package.json                 # Project metadata & dependencies configuration
```

## 7. Setup & Deployment Guide
### 7.1 Environment Requirements
- Node.js >= 18
- npm >= 9

### 7.2 Running Development Environment
```bash
# 1. Install all dependencies
npm install

# 2. Initialize environment variables file
cp .env.example .env
# Note: Edit the .env file to fill in credentials for Supabase, Gemini API, and PayOS

# 3. Start the local development server
npm run dev
# Access the application in your browser at: http://localhost:5173
```

### 7.3 Build & Demo Experience
- To build for Production: `npm run build`
- For grading and demonstration purposes (even without setting up environment variables), the project includes mock-data and 2 demo accounts (Shared password: `123456`):
  - **User Account:** `vohoangthang2004@gmail.com`
  - **Admin Account:** `adminwanderlab@gmail.com`

---
*Course: EXE201 — Entrepreneurship | School: FPT Education | Status: 100% Completed (Phase 1-5)*
