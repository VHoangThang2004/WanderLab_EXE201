import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes.tsx';
import { AIChatbot } from './components/wander/AIChatbot';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// Create a single QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  const { refreshSession, setLoading } = useAuthStore();

  const [isChatPage, setIsChatPage] = useState(
    typeof window !== "undefined" && window.location.pathname === "/chat"
  );

  // Listen for Supabase auth state changes
  useEffect(() => {
    // Check existing session on mount
    refreshSession();

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await refreshSession();
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.getState().setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession, setLoading]);

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
        {!isChatPage && <AIChatbot />}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}