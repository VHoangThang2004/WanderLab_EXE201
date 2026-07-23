import { createBrowserRouter, Navigate } from "react-router";
import { WanderLanding } from "./pages/wander/Landing";
import { MarketingLanding } from "./pages/wander/MarketingLanding";
import { WanderLogin } from "./pages/wander/Login";
import { WanderRegister } from "./pages/wander/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { WanderGuide } from "./pages/wander/Guide";
import { WanderDashboard } from "./pages/wander/Dashboard";
import { WanderFriends } from "./pages/wander/Friends";
import { WanderDiaryDetail } from "./pages/wander/DiaryDetail";
import { WanderPostDetail } from "./pages/wander/PostDetail";
import { WanderCreateDiary } from "./pages/wander/CreateDiary";
import { WanderEditDiary } from "./pages/wander/EditDiary";
import { WanderPartner } from "./pages/wander/Partner";
import { ChatPage } from "./pages/wander/ChatPage";
import { MessagesPage } from "./pages/wander/Messages";
import { CreateItinerary } from "./pages/wander/CreateItinerary";
import { CheckoutPage } from "./pages/wander/Checkout";
import { PaymentSuccessPage } from "./pages/wander/PaymentSuccess";
import { AdminDashboard } from "./pages/wander/AdminDashboard";
import { WanderExplore } from "./pages/wander/Explore";
import { WanderUserProfile } from "./pages/wander/UserProfile";
import { Notifications } from "./pages/wander/Notifications";
import { Settings } from "./pages/wander/Settings";
import { DiaryBook } from "./pages/wander/DiaryBook";
import { DiaryBookDetail } from "./pages/wander/DiaryBookDetail";
import { WanderMainLayout } from "./components/wander/WanderMainLayout";
import { ProtectedRoute, GuestRoute } from "./components/auth/ProtectedRoute";

export const router = createBrowserRouter([
  // Guest-only routes (redirect to dashboard if already logged in)
  {
    path: "/login",
    element: (
      <GuestRoute>
        <WanderLogin />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <WanderRegister />
      </GuestRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <GuestRoute>
        <ForgotPassword />
      </GuestRoute>
    ),
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/landing",
    element: (
      <GuestRoute>
        <MarketingLanding />
      </GuestRoute>
    ),
  },
  // Public standalone routes
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  // Routes with sidebar layout
  {
    path: "/",
    Component: WanderMainLayout,
    children: [
      // Public pages
      {
        index: true,
        Component: WanderLanding,
      },
      {
        path: "/guide",
        Component: WanderGuide,
      },

      {
        path: "/diary/:id",
        Component: WanderDiaryDetail,
      },
      {
        path: "/post/:id",
        Component: WanderPostDetail,
      },
      {
        path: "/partner",
        Component: WanderPartner,
      },
      // Protected pages (require login)
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <WanderDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: <Navigate to="/profile" replace />,
      },
      {
        path: "/friends",
        element: (
          <ProtectedRoute>
            <WanderFriends />
          </ProtectedRoute>
        ),
      },
      {
        path: "/messages",
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <WanderCreateDiary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/edit-diary/:id",
        element: (
          <ProtectedRoute>
            <WanderEditDiary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/diary-book",
        element: (
          <ProtectedRoute>
            <DiaryBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "/diary-book/:id",
        element: (
          <ProtectedRoute>
            <DiaryBookDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-itinerary",
        element: (
          <ProtectedRoute>
            <CreateItinerary />
          </ProtectedRoute>
        ),
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment-cancel",
        element: (
          <ProtectedRoute>
            <PaymentSuccessPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <ProtectedRoute>
            <WanderUserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
]);