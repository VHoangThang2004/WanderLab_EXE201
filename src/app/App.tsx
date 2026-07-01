import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes.tsx';
import { AIChatbot } from './components/wander/AIChatbot';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from './components/ui/sonner';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { useEffect, useRef, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Các route KHÔNG hiển thị chatbot
const CHATBOT_HIDDEN_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/chat', '/guide'];

export default function App() {
  const initDone = useRef(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
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

  // Track current path for chatbot visibility
  useEffect(() => {
    const check = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", check);
    const id = setInterval(check, 300);
    return () => { window.removeEventListener("popstate", check); clearInterval(id); };
  }, []);

  const showChatbot = isAuthenticated && !CHATBOT_HIDDEN_PATHS.includes(currentPath);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
        {showChatbot && <AIChatbot />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}