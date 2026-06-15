import { createBrowserRouter, Navigate } from "react-router";
import { WanderLanding } from "./pages/wander/Landing";
import { WanderLogin } from "./pages/wander/Login";
import { WanderRegister } from "./pages/wander/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { WanderGuide } from "./pages/wander/Guide";
import { WanderDashboard } from "./pages/wander/Dashboard";
import { WanderFriends } from "./pages/wander/Friends";
import { WanderDiaryDetail } from "./pages/wander/DiaryDetail";
import { WanderCreateDiary } from "./pages/wander/CreateDiary";
import { WanderEditDiary } from "./pages/wander/EditDiary";
import { WanderPartner } from "./pages/wander/Partner";
import { ChatPage } from "./pages/wander/ChatPage";
import { MessagesPage } from "./pages/wander/Messages";
import { CreateItinerary } from "./pages/wander/CreateItinerary";
import { CheckoutPage } from "./pages/wander/Checkout";
import { AdminDashboard } from "./pages/wander/AdminDashboard";
import { WanderExplore } from "./pages/wander/Explore";
import { WanderUserProfile } from "./pages/wander/UserProfile";
import { GroupDetail } from "./pages/wander/GroupDetail";
import { Notifications } from "./pages/wander/Notifications";
import { Settings } from "./pages/wander/Settings";
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
  // Public standalone routes
  {
    path: "/guide",
    Component: WanderGuide,
  },
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
        path: "/explore",
        Component: WanderExplore,
      },
      {
        path: "/diary/:id",
        Component: WanderDiaryDetail,
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
        path: "/groups/:id",
        element: (
          <ProtectedRoute>
            <GroupDetail />
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
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);