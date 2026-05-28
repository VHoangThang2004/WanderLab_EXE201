import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Fetch user profile from our users table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const user: User = {
            id: data.user.id,
            email: data.user.email || '',
            full_name: profile?.full_name || data.user.user_metadata?.full_name || '',
            avatar_url: profile?.avatar_url || null,
            cover_image_url: profile?.cover_image_url || null,
            bio: profile?.bio || null,
            location: profile?.location || null,
            role: profile?.role || 'explorer',
            status: profile?.status || 'active',
            reputation_score: profile?.reputation_score || 0,
            diaries_count: profile?.diaries_count || 0,
            followers_count: profile?.followers_count || 0,
            following_count: profile?.following_count || 0,
            created_at: data.user.created_at,
            updated_at: profile?.updated_at || data.user.created_at,
          };

          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, fullName) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Create profile record
            await supabase.from('profiles').upsert({
              id: data.user.id,
              full_name: fullName,
              email: data.user.email,
              role: 'explorer',
              status: 'active',
            });

            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              full_name: fullName,
              avatar_url: null,
              cover_image_url: null,
              bio: null,
              location: null,
              role: 'explorer',
              status: 'active',
              reputation_score: 0,
              diaries_count: 0,
              followers_count: 0,
              following_count: 0,
              created_at: data.user.created_at,
              updated_at: data.user.created_at,
            };

            set({ user, isAuthenticated: true, isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      },

      loginWithFacebook: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'facebook',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, isLoading: false });
        localStorage.removeItem('wanderlab_access_token');
        localStorage.removeItem('wanderlab_refresh_token');
      },

      refreshSession: async () => {
        set({ isLoading: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name || '',
              avatar_url: profile?.avatar_url || null,
              cover_image_url: profile?.cover_image_url || null,
              bio: profile?.bio || null,
              location: profile?.location || null,
              role: profile?.role || 'explorer',
              status: profile?.status || 'active',
              reputation_score: profile?.reputation_score || 0,
              diaries_count: profile?.diaries_count || 0,
              followers_count: profile?.followers_count || 0,
              following_count: profile?.following_count || 0,
              created_at: session.user.created_at,
              updated_at: profile?.updated_at || session.user.created_at,
            };

            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'wanderlab-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
