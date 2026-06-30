import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { WanderSidebar } from "./WanderSidebar";
import { CallModal } from "./CallModal";
import { useAuthStore } from "@/stores";
import { supabase } from "@/lib/supabase";

export function WanderMainLayout() {
  const { user } = useAuthStore();
  const [incomingCall, setIncomingCall] = useState<any>(null);

  useEffect(() => {
    if (!user?.id) return;
    
    // Listen for incoming call signals globally
    const channel = supabase.channel(`user_signals_${user.id}`)
      .on('broadcast', { event: 'incoming_call' }, (payload) => {
        setIncomingCall(payload.payload);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#FFF5F3] dark:bg-background transition-colors duration-300">
      <WanderSidebar />
      
      {/* Main Content - with left margin for sidebar on desktop */}
      <main className="lg:ml-72 min-h-screen">
        {/* Mobile top padding to account for fixed header */}
        <div className="lg:hidden h-16" />
        
        {/* Content */}
        <Outlet />
      </main>

      {/* Global Incoming Call Modal */}
      {incomingCall && (
        <CallModal 
          isOpen={true}
          onClose={() => setIncomingCall(null)}
          callerName={incomingCall.callerName}
          callerAvatar={incomingCall.callerAvatar}
          isVideoCall={incomingCall.isVideoCall}
          targetId={incomingCall.callerId}
          isIncoming={true}
          incomingOffer={incomingCall.offer}
        />
      )}
    </div>
  );
}
