import { Outlet } from "react-router";
import { WanderSidebar } from "./WanderSidebar";

export function WanderMainLayout() {
  return (
    <div className="min-h-screen bg-[#FFF5F3]">
      <WanderSidebar />
      
      {/* Main Content - with left margin for sidebar on desktop */}
      <main className="lg:ml-72 min-h-screen">
        {/* Mobile top padding to account for fixed header */}
        <div className="lg:hidden h-16" />
        
        {/* Content */}
        <Outlet />
      </main>
    </div>
  );
}
