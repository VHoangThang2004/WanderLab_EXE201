import { createBrowserRouter } from "react-router";
import { WanderLanding } from "./pages/wander/Landing";
import { WanderLogin } from "./pages/wander/Login";
import { WanderRegister } from "./pages/wander/Register";
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
import { WanderMainLayout } from "./components/wander/WanderMainLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: WanderLogin,
  },
  {
    path: "/register",
    Component: WanderRegister,
  },
  {
    path: "/guide",
    Component: WanderGuide,
  },
  {
    path: "/chat",
    Component: ChatPage,
  },
  // Routes with sidebar layout
  {
    path: "/",
    Component: WanderMainLayout,
    children: [
      {
        index: true,
        Component: WanderLanding,
      },
      {
        path: "/dashboard",
        Component: WanderDashboard,
      },
      {
        path: "/friends",
        Component: WanderFriends,
      },
      {
        path: "/diary/:id",
        Component: WanderDiaryDetail,
      },
      {
        path: "/create",
        Component: WanderCreateDiary,
      },
      {
        path: "/partner",
        Component: WanderPartner,
      },
      {
        path: "/create-itinerary",
        Component: CreateItinerary,
      },
      {
        path: "/checkout",
        Component: CheckoutPage,
      },
      {
        path: "/admin-dashboard",
        Component: AdminDashboard,
      },
    ],
  },
]);