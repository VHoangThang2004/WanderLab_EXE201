import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes.tsx';
import { AIChatbot } from './components/wander/AIChatbot';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

export default function App() {
  const initDone = useRef(false);

  const [isChatPage, setIsChatPage] = useState(
    typeof window !== "undefined" && window.location.pathname === "/chat"
  );

  // Initialize auth ONCE on mount
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    // 1. Check existing session
    useAuthStore.getState().refreshSession();

    // 2. Listen for future auth changes (logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        // Don't interfere with login/register — they handle state themselves.
        // Only react to sign-out and OAuth/token events.
        if (event === 'SIGNED_OUT') {
          useAuthStore.getState().setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          useAuthStore.getState().refreshSession();
        }
        // For SIGNED_IN from OAuth redirect (Google/Facebook), refresh session
        if (event === 'SIGNED_IN') {
          // Only refresh if we don't already have a user (OAuth callback case)
          const { isAuthenticated } = useAuthStore.getState();
          if (!isAuthenticated) {
            useAuthStore.getState().refreshSession();
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Track current page for chatbot visibility
  useEffect(() => {
    const check = () => setIsChatPage(window.location.pathname === "/chat");
    window.addEventListener("popstate", check);
    const id = setInterval(check, 300);
    return () => { window.removeEventListener("popstate", check); clearInterval(id); };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
        {!isChatPage && <AIChatbot />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}