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
import { WanderPartner } from "./pages/wander/Partner";
import { ChatPage } from "./pages/wander/ChatPage";
import { CreateItinerary } from "./pages/wander/CreateItinerary";
import { CheckoutPage } from "./pages/wander/Checkout";
import { AdminDashboard } from "./pages/wander/AdminDashboard";
import { WanderExplore } from "./pages/wander/Explore";
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
        path: "/create",
        element: (
          <ProtectedRoute>
            <WanderCreateDiary />
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
    ],
  },
]);